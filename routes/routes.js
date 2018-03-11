
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const router=require('express').Router();
const register = require('../functions/register');
const login = require('../functions/login');
const profile = require('../functions/profile');
const password = require('../functions/password');
const config = require('../config/config.json');
const mongoose = require('../databases/mongoose');
const river = require('../models/river-model');

router.get('/',(req,res)=>{
  river.find().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  })
});

router.post('/',(req,res)=>{
  console.log(req.body);
  var river_obj=new river({
    name:req.body.name,
    quantity:req.body.quantity,
    tou:req.body.tou

});
river_obj.save().then((doc)=>{
  res.send("tum pro h baba");
  console.log(doc);
},(err)=>{
  console.log(err);
});
});


router.post('/authenticate', (req, res) => {

	const credentials = auth(req);

	if (!credentials) {

		res.status(400).json({ message: 'Invalid Request !' });

	} else {

		login.loginUser(credentials.name, credentials.pass)

		.then(result => {

			const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

			res.status(result.status).json({ message: result.message, token: token });

		})

		.catch(err => res.status(err.status).json({ message: err.message }));
	}
});

router.post('/users', (req, res) => {

	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

		res.status(400).json({message: 'Invalid Request !'});

	} else {

		register.registerUser(name, email, password)

		.then(result => {

			res.setHeader('Location', '/users/'+email);
			res.status(result.status).json({ message: result.message })
		})

		.catch(err => res.status(err.status).json({ message: err.message }));
	}
});

router.get('/users/:id', (req,res) => {

	if (checkToken(req)) {

		profile.getProfile(req.params.id)

		.then(result => res.json(result))

		.catch(err => res.status(err.status).json({ message: err.message }));

	} else {

		res.status(401).json({ message: 'Invalid Token !' });
	}
});

router.put('/users/:id', (req,res) => {

	if (checkToken(req)) {

		const oldPassword = req.body.password;
		const newPassword = req.body.newPassword;

		if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

			res.status(400).json({ message: 'Invalid Request !' });

		} else {

			password.changePassword(req.params.id, oldPassword, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		}
	} else {

		res.status(401).json({ message: 'Invalid Token !' });
	}
});

router.post('/users/:id/password', (req,res) => {

	const email = req.params.id;
	const token = req.body.token;
	const newPassword = req.body.password;

	if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

		password.resetPasswordInit(email)

		.then(result => res.status(result.status).json({ message: result.message }))

		.catch(err => res.status(err.status).json({ message: err.message }));

	} else {

		password.resetPasswordFinish(email, token, newPassword)

		.then(result => res.status(result.status).json({ message: result.message }))

		.catch(err => res.status(err.status).json({ message: err.message }));
	}
});

function checkToken(req) {

	const token = req.headers['x-access-token'];

	if (token) {

		try {

				var decoded = jwt.verify(token, config.secret);

				return decoded.message === req.params.id;

		} catch(err) {

			return false;
		}

	} else {

		return false;
	}
}

  module.exports=router;
