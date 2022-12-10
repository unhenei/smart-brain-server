const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knex = require('knex');
const cors = require('cors');

const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

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

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfile(db))

app.put('/profile', profile.handleProfileChange(db, bcrypt))

app.put('/image', image.handleImage(db))

app.post('/imageUrl', image.handleApiCall)




