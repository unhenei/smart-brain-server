const handleSignin = (db, bcrypt) => (req, res) => {
	const {email, password} = req.body;
	if ( !email || !password ){
		// if any field is leave in blank
		return res.status(400).json('invalid submission')
	}
	db.select('email', 'hash').from('register')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash)
			if(isValid){
				return db.select('*').from('users')
						.where('email', '=', email)
						.then(user => {
							res.json(user)
						})
						.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status.json('wrong email or password')  //wrong password
			}
		})
		.catch(err => res.status(400).json('wrong email or password'))  //wrong email
}

module.exports={handleSignin: handleSignin}
