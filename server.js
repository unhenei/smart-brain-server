const express = require('express');
const bodyParser = require('body-parser');

const database = {
	users: [
	{
		id: '001',
		name: 'Jason',
		email: 'jason@gmail.com',
		password: 'jasonisawesome',
		entries: 0,
	},
	{
		id: '002',
		name: 'LeaYH',
		email: 'leayh@gmail.com',
		password: 'leayhgogogirl',
		entries: 0,
	},
	{
		id: '003',
		name: 'eddie',
		email: 'brett@gmail.com',
		password: 'linglingtobe',
		entries: 0,
	},
	{
		id: '004',
		name: 'sarah',
		email: 'sarahkim@gmail.com',
		password: 'sarahisaking',
		entries: 0,
	}
	]
}

const app = express();
app.listen(3000, () => {
	console.log('app is running on port 3000')
})
app.use(bodyParser.json());


app.get('/', (req,res)=>{
	res.send('this is working')
})



app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json('success')
	}else{
		res.status(400).json('failed to login')
	}
})


app.post('/register', (req, res) => {
	const {name, email, password} = req.body;
	database.users.push({
		id: '005',
		name: name,
		email: email,
		password: password,
		entries: 0,
	})
	res.send(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user)
		}
	})
	if(!found){
		res.status(400).json('user not found')
	}
})

app.put('/image', (req, res) => {
	const {id} = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries ++
			return res.json(user.entries)
		}
	})
	if(!found){
		res.status(400).json('not found')
	}
})

