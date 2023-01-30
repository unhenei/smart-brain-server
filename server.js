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
    host : '0.0.0.0',
    port : 5432,
    user : 'ycw',
    password : 'smartbrain',
    database : 'smart-brain'
  }
});

const app = express();
app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`)
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

app.delete('/profile', profile.handleProfileDelete(db))

app.put('/image', image.handleImage(db))

app.post('/imageUrl', image.handleApiCall)




