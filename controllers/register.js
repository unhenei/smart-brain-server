const handleRegister = (db, bcrypt) => (req, res) => {
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
}

module.exports={
	handleRegister: handleRegister
};