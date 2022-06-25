const express = require('express');
const router = express.Router();
const db  = require('./config/dbConnection');
const { addValidation, loginValidation, editValidation } = require('./middleware/validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const async = require('async');

router.post('/addUser', addValidation, (req, res, next) => {
	var err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(409).json({
			code: '409',
			message: err.errors,
		});
	} else {
		db.query(
			`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
			(err, result) => {
				if (result.length) {
					return res.status(409).send({
						code: '409',
						message: 'The usernmae is already exist!'
					});
				} else {
					bcrypt.hash(req.body.password, 10, (err, hash) => {
						if (err) {
							return res.status(500).send({
								code: '509',
								message: err
							});
						} else {
							db.query(
								`INSERT INTO users (firstName, lastName, address, postCode, phoneNumber, email, username, password) VALUES ('${req.body.firstName}', '${req.body.lastName}', '${req.body.address}', '${req.body.postCode}', '${req.body.phoneNumber}', '${req.body.email}', '${req.body.username}', ${db.escape(hash)})`,
								(err, result) => {
									if (err) {
										// throw err;
										return res.status(400).send({
											message: err
										});
									}
									return res.status(200).send({
										code: '000',
										message: 'Successfully Added!',
										token: jwt.sign(result.insertId,'secretKey')
									});
								}
							);
						}
					});
				}
			}
		);
	}
});
				
router.post('/login', loginValidation, (req, res, next) => {
	if(
		!req.headers.authorization ||
		!req.headers.authorization.startsWith('Bearer') ||
		!req.headers.authorization.split(' ')[1]
	){
		return res.status(409).json({
			code: "409",
			message: "Please provide the token",
		});
	}

	var err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(409).json({
			code: '409',
			message: err.errors,
		});
	} else {

		const theToken = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(theToken, 'secretKey');

		db.query(
			`SELECT * FROM users WHERE username = ${db.escape(req.body.username)} AND id = ${decoded};`,
			(err, result) => {
				// user does not exists
				if (err) {
					// throw err;
					return res.status(509).send({
						code: '509',
						message: err
					});
				}
				if (!result.length) {
					return res.status(409).send({
						code: '409',
						message: 'Username or password is incorrect!'
					});
				}
				// check password
				bcrypt.compare(
					req.body.password,
					result[0]['password'],
					(bErr, bResult) => {
						// wrong password
						if (bErr) {
							// throw bErr;
							return res.status(200).send({
								code: '200',
								message: 'Username or password is incorrect!'
							});
						}

						if (bResult) {
							var userDetails = {
								firstName : result[0].firstName,
								lastName : result[0].lastName,
								address : result[0].address,
								postCode : result[0].postCode,
								phoneNumber : result[0].phoneNumber,
								email : result[0].email,
								username : result[0].username,
							}
							return res.status(200).send({
								code: '200',
								message: 'Logged in!',
								user: userDetails
							});
						}

						return res.status(408).send({
							code: '408',
							message: 'Username or password is incorrect!'
						});
					}
				);
			}
		);
	}
});

router.get('/getUsers', (req, res, next) => {
	db.query('SELECT * FROM users', function (error, results, fields) {
		if (error) throw error;
		return res.status(200).send({ 
			code: '200',
			message: 'Users List',
			data: results, 
		});
	});
});

router.put('/editUser', editValidation, (req, res, next) => {
	var err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(409).json({
			code: "409",
			message: err.errors,
		});
	} else {
		db.query('SELECT * FROM users WHERE id = ?', [req.body.id], function (err, results) {
			if (err) throw err;

			// Return error if id does not exist
			if (_.isEmpty(results)) {
				return res.status(200).send({
					code: "200",
					message: 'User does not exist!' 
				});
			}

			const query = "UPDATE `users` SET ? WHERE id = ?";
			db.query(query, [req.body, req.body.id], function (error, results, fields) {
				if (error) throw error;

				db.query('SELECT * FROM users WHERE id = ?', [req.body.id], function (error, results, fields) {
					if (error) throw error;
					return res.status(200).send({
						code: "200",
						message: 'User has been successfully updated!',
						data: results
					});
				});
			});

		});
	}
});

router.delete('/deleteUserByID', editValidation, (req, res, next) => {
	var err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(409).json({
			code: "409",
			message: err.errors,
		});
	} else {
		db.query('SELECT * FROM users WHERE id = ?', [req.body.id], function (err, results) {
			if (err) throw err;

			if (_.isEmpty(results)) {
				return res.status(200).send({
					code: "409",
					message: 'User does not exist!' 
				});
			}

			db.query('DELETE FROM users WHERE id = ?', [req.body.id], function (error, results, fields) {
				if (error) throw error;

				return res.status(200).send({
					code: "200",
					message: 'User has been successfully deleted!' 
				});
	
				// db.query('SELECT * FROM users', function (error, results, fields) {
				// 	if (error) throw error;
				// 	return res.send({
				// 		data: results, 
				// 		message: 'User has been successfully deleted!' 
				// 	});
				// });
			});
		})
	}
})

router.delete('/deleteUsers', editValidation, async (req, res, next) => {
	var err = validationResult(req);
	if (!err.isEmpty()) {
		return res.status(409).json({
			code: "409",
			message: err.errors,
		});
	} else {
		let ids = req.body.id
		let notExist = [];

		for (let i=0; i < ids.length; i++) {
			const id = await checkUser(ids[i])
			if (id) notExist.push(id)
		}
		
		var msgs = {};
		if (!_.isEmpty(notExist)) {
			msgs.Failed = 'User with id: '+notExist+' does not exist!'
			// return res.send({
			// 	message: 'User with id: '+notExist+' does not exist!' 
			// });
		}

		// Delete record if all ids are found
		let newIds = ids.filter(x => !notExist.includes(x));
		if (!_.isEmpty(newIds)) {
			db.query('DELETE FROM users WHERE id IN (?)', [newIds], function (error, results, fields) {
				if (error) throw error;

				msgs.Success = {
					message: 'User with id: '+newIds+' has been successfully deleted!'
				}

				return res.status(200).send({
					code: '200',
					message: msgs
				});
			});
		} else {
			return res.status(200).send({
				code: '200',
				message: msgs
			});
		}
		
	}
})

async function checkUser(data) {
	return new Promise(resolve => {
		db.query('SELECT * FROM users WHERE id = ?', [data], function (err, results) {
			if (err) throw err;

			if (_.isEmpty(results)) {
				resolve(data)
			} else {
				resolve()
			}
		})
	})
}

module.exports = router;