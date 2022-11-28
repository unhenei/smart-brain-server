const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knex = require('knex');
const cors = require('cors');

const db = knex({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'ycw',
    password : 'smartbrain',
    database : 'smart-brain'
  }
});

const app = express();
app.listen(3000, () => {
	console.log('app is running on port 3000')
})

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=>{
	res.send('this is working')
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('register')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
			if(isValid){
				return db.select('*').from('users')
						.where('email', '=', req.body.email)
						.then(user => {
							res.json(user)
						})
						.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status.json('wrong email or password')  //wrong password
			}
		})
		.catch(err => res.status(400).json('wrong email or password'))  //wrong email
})


app.post('/register', (req, res) => {
	const {name, email, password} = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('register')
		.returning('email')
		.then(registerEmail => {
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: registerEmail[0].email,
					joined: new Date(),
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where({id: id})
	.then(user => {
		if (user.length){
			res.json(user[0])
		}else{
			res.status(400).json('Not Found')
		}
	})
	.catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries)
	})
	.catch(err => res.status(400).json('unable to get entries'))
})



