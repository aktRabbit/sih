'use strict';

const user = require('../models/user-model');
const bcrypt = require('bcryptjs');
const mongoose = require('../databases/mongoose');

exports.loginUser = (userID, password) =>
	new Promise((resolve,reject) => {
		user.find({userID: userID})
		.then(users => {
			if (users.length == 0) {
				reject({ status: 404, message: 'User Not Found !' });
			} else {
				return users[0];
			}
		})

		.then(user => {
			const hashed_password = user.hashed_password;
			if (bcrypt.compareSync(password, hashed_password)) {
				resolve({ status: 200, message: userID });
			} else {
				reject({ status: 401, message: 'Invalid Credentials !' });
			}
		})
		.catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

	});
