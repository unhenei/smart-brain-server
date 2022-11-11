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
app.get('/signin', (req,res)=>{
	res.send('lets sign in')
})


app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json('success')
	}else{
		res.status(400).json('failed to login')
	}
})