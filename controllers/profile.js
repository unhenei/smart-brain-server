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
	// //WORK FOR NAME
	// const {name, email} = req.body;
	// if (!name ){
	// 	// if any field is leave in blank
	// 	return res.status(400).json('invalid submission')
	// }
	// db.transaction(trx => {
	// 		trx.update({
	// 			name: name
	// 		})
	// 		.into('users')
	// 		.where('email', '=', email)
	// 		.returning('*')
	// 		.then(user => {
	// 			console.log('user', user)
	// 			res.json(user[0]);
	// 		})
	// 		.then(trx.commit)
	// 		.catch(trx.rollback)
	// 	})
	// 	.catch(err => console.log(err))

    // //WORK FOR PASSWORD
	// const {email, passwordNew, passwordCheck} = req.body;
	// const salt = bcrypt.genSaltSync(10);
	// const hashNew = bcrypt.hashSync(passwordNew, salt);
	// const passwordValid = bcrypt.compareSync(passwordCheck, hashNew);
	// if (!passwordNew || !passwordCheck){
	// 	// if any field is leave in blank
	// 	return res.status(400).json('invalid submission1')
	// }
	// if (!passwordValid){
	// 	return res.status(400).json('invalid submission2')
	// }

	// ///要先找出在資料庫中的位置

	// db.transaction(trx => {
	// 		trx.update({
	// 			hash: hashNew
	// 		})
	// 		.into('register')
	// 		.where('email', '=', email)
	// 		.returning('*')
	// 		.then(user => {
	// 			console.log('user', user)
	// 			res.json(user[0]);
	// 		})
	// 		.then(trx.commit)
	// 		.catch(trx.rollback)
	// 	})
	// 	.catch(err => console.log(err))

	const {name, email, passwordNew, passwordCheck} = req.body;
	const salt = bcrypt.genSaltSync(10);
	// let hashNew = bcrypt.hashSync(passwordNew, salt);
	// let passwordValid = bcrypt.compareSync(passwordCheck, hashNew);
	

	let hashNew = ''
	let passwordValid = true

	if (!passwordNew && !passwordCheck){
		const hash = db('register')
					.select('hash')
					.where('email','=',email)
		hashNew = hash
		console.log('hash',hash, 'hashNew',hashNew)
	} else {
		hashNew = bcrypt.hashSync(passwordNew, salt);
		passwordValid = bcrypt.compareSync(passwordCheck, hashNew);
	}

	if (!name){
		// if any field is leave in blank
		return res.status(400).json('invalid submission1')
	}

	if (!passwordValid){
		return res.status(400).json('invalid submission2')
	}

	///要先找出在資料庫中的位置
	db.transaction(trx => {
			trx.update({
				hash: hashNew
			})
			.into('register')
			.where('email', '=', email)
			.returning('email')
			.then(emailPrimaryKey => {
				console.log('email', emailPrimaryKey)
				return trx('users')
					.returning('*')
					.update({
						name: name
					})
					.where('email','=',emailPrimaryKey[0].email)
				})
			.then(user=>{
				console.log('user',user)
				res.json(user[0])
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => console.log(err))

	//WORK FOR NAME
	// db.transaction(trx => {
	// 	trx.update({
	// 		name: name
	// 	})
	// 	.into('users')
	// 	.where('email', '=', email)
	// 	.returning('*')
	// 	.then(user => {
	// 		console.log('user', user)
	// 		res.json(user[0]);
	// 	})
	// 	.then(trx.commit)
	// 	.catch(trx.rollback)
	// })
	// .catch(err => console.log(err))


	// db.transaction(trx => {
	// 	trx.update({
	// 		hash: hashNew
	// 	})
	// 	.into('register')
	// 	.where('email', '=', email)
	// 	.returning('email')
	// 	.then(emailPrimaryKey => {
	// 		return trx('users')
	// 			.returning('*')
	// 			.update({
	// 				name: name
	// 			})
	// 			.where('email', '=', emailPrimaryKey)
	// 	})
	// 	.then(user => {
	// 		console.log('user', user)
	// 		res.json(user[0]);
	// 	})
	// 	.then(trx.commit)
	// 	.catch(trx.rollback)
	// })
	// .catch(err => console.log(err))


	// db.transaction(trx => {
	// 	trx.insert({
	// 		hash: hash,
	// 		email: email
	// 	})
	// 	.into('register')
	// 	.returning('email')
	// 	.then(registerEmail => {
	// 		return trx('users')
	// 			.returning('*')
	// 			.insert({
	// 				name: name,
	// 				email: registerEmail[0].email,
	// 				joined: new Date(),
	// 			})
	// 			.then(user => {
	// 				res.json(user[0]);
	// 			})
	// 	})
	// 	.then(trx.commit)
	// 	.catch(trx.rollback)
	// })
	// .catch(err => res.status(400).json('unable to register'))
}


module.exports={
	handleProfile,
	handleProfileChange
}