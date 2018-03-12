'use strict';

const user = require('../models/user-model');
const bcrypt = require('bcryptjs');
const mongoose = require('../databases/mongoose');

exports.registerUser = (name, email, password) =>
	new Promise((resolve,reject) => {
	   const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
    user.find({email:email}).then((doc)=>{
      if(doc.length===0)
      {
        const newUser = new user({
    			name: name,
    			email: email,
    			hashed_password: hash,
    			created_at: new Date()
    		});
    		newUser.save()
    		.then(() => resolve({ status: 201, message: 'User Registered Sucessfully !' }))
    		.catch(err => {
    				reject({ status: 500, message: 'Internal Server Error !' });
    		});
      }
      else {
        reject({ status: 409, message: 'User Already Registered !' });
      }

    }).catch(err=>{
      reject({ status: 500, message: 'Internal Server Error !' })
    });

	});
