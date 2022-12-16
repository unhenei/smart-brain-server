// show user home page
const handleProfile = (db) => (req, res) => {
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
}

// for profile page info loading
const handleProfileChange = (db, bcrypt) => (req, res) => {
	const {name, email, passwordNew, passwordCheck} = req.body;
	const salt = bcrypt.genSaltSync(10);	
	let hashNew = ''
	let passwordValid = true

	if (!passwordNew && !passwordCheck){
		//for user not changing password
		const hash = db('register')
					.select('hash')
					.where('email','=',email)
		hashNew = hash
	} else {
		hashNew = bcrypt.hashSync(passwordNew, salt);
		passwordValid = bcrypt.compareSync(passwordCheck, hashNew);
	}

	if (!name){
		// name cannot be left in blank
		return res.status(400).json('invalid submission')
	}

	if (!passwordValid){
		// check if newPassword and newPasswordCheck is matched
		return res.status(400).json('invalid submission')
	}

	db.transaction(trx => {
			trx.update({
				hash: hashNew
			})
			.into('register')
			.where('email', '=', email)
			.returning('email')
			.then(emailPrimaryKey => {
				return trx('users')
					.returning('*')
					.update({
						name: name
					})
					.where('email','=',emailPrimaryKey[0].email)
				})
			.then(user=>{
				res.json(user[0])
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json(err))
	}

// for account delete
const handleProfileDelete = (db) => (req, res) => {
	const {email} = req.body;
	db.transaction(trx => {
		trx('users').where('email', email).del().returning('email')
		.then(email => {
			return trx('register')
					.where('email', email[0].email)
					.del()
					.then(res.json('account deleted'))
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to delete account'))
}


module.exports={
	handleProfile,
	handleProfileChange,
	handleProfileDelete
}