
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
const moment = require('moment');
const predict=require('../machine_learning/ml');

var state_list = [
"andhra pradesh",
"arunachal pradesh",
"assam",
"bihar",
"chhattisgarh",
"goa",
"gujarat",
"haryana",
"himachal pradesh",
"jammu and kashmir",
"jharkhand",
"karnataka",
"kerala",
"madhya pradesh",
"maharashtra",
"manipur",
"meghalaya",
"mizoram",
"nagaland",
"odisha",
"punjab",
"rajasthan",
"sikkim",
"tamil nadu",
"telangana",
"tripura",
"uttarakhand",
"uttar pradesh",
"west bengal",
"andaman and nicobar islands",
"chandigarh",
"dadra and nagar haveli",
"daman and diu",
"delhi",
"lakshadweep",
"puducherry"
]


//Query by the block admin to get his added river
router.post('/river',(req,res)=>{
  var res_obj=[];
  river.find({userID:req.body.userID}).then((doc)=>{
    for(var i=0;i<doc.length;i+=1)
    {
    var len=doc[i].updated_at.length;
    var date=moment(doc[i].updated_at[len-1]);
    var res_obj1={
      river_name:doc[i].river_name,
      pH:doc[i].pH[len-1],
      tds:doc[i].tds[len-1],
      dissolve_oxygen:doc[i].dissolve_oxygen[len-1],
      quantity:doc[i].quantity[len-1],
      updated_at:date.format('MMM Do YYYY')
    };
    res_obj.push(res_obj1);
  }
    res.send(res_obj);
  },(err)=>{
    res.status(400).send(err);
  })
});


//preprocessing statelist and their count

var state_li=[];
var count=[];
state_list.forEach((state)=>{
  var co=0;
  river.find({state:state}).then((doc)=>{
    var river_list=[];
    var river_obj={};
    doc.forEach((river_one)=>{
      if(river_obj[river_one["river_name"]]===undefined)
      {
        co+=1;
        river_list.push(river_one["river_name"]);
        river_obj[river_one["river_name"]]=5;
      }
    });
    state_li.push(state);
    count.push(co);
  },(err)=>{
    res.status(500).send("Internal Server Error");
  })
});


//adding a new river


var arr=["gand"];
router.post('/',(req,res)=>{
  river.find({river_name:req.body.river_name.toLowerCase(),state:req.body.state}).then((doc)=>{
    if(doc.length===0)
    {
      for(var i=0;i<state_li.length;i++){
        if(state_li[i]===req.body.state){
          count[i]++;
          break;
        }
      }
    }
  })
    var current_date=new Date();
  setTimeout(function () {
    var river_obj=new river();
    river_obj.userID=req.body.userID;
    river_obj.river_name=req.body.river_name;
    river_obj.quantity.push(req.body.quantity);
    river_obj.pH.push(req.body.pH);
    river_obj.tds.push(req.body.tds);
    river_obj.dissolve_oxygen.push(req.body.dissolve_oxygen);
    river_obj.type_of_uses.push(req.body.type_of_uses);
    river_obj.updated_at.push(moment().valueOf());
    river_obj.latitude=req.body.latitude;
    river_obj.longitude=req.body.longitude;
    river_obj.pincode=req.body.pincode;
    river_obj.district=req.body.district;
    river_obj.state=req.body.state;
    river_obj.save().then((doc)=>{
    res.send(arr);
  },(err)=>{
    res.status(401).send("Invalid format");
    console.log(err);
  });
}, 1000)

});

//Updating the added river
router.post('/update',(req,res)=>{
  var current_date=new Date();
  river.findOne({river_name:(req.body.river_name).toLowerCase(),userID:req.body.userID}).then((doc)=>{
    doc.quantity.push(req.body.quantity);
    doc.pH.push(req.body.pH);
    doc.tds.push(req.body.tds);
    doc.dissolve_oxygen.push(req.body.dissolve_oxygen);
    doc.type_of_uses.push(req.body.type_of_uses);
    doc.updated_at.push(moment().valueOf());
    doc.save().then((riv)=>{
      console.log(riv);
      res.status(200).send(arr);
    },(err)=>{
      console.log("error in saving after updating");
    });


  },(err)=>{
    res.status(404).send("Given river doesnt exist");
  })
});



//get the name of entire river
router.get('/riverlist',(req,res)=>{
  var river_obj={};
  var river_list=[];
  river.find().then((doc)=>{
    doc.forEach((river_one)=>{
      if(river_obj[river_one["river_name"]]===undefined)
      {
        river_list.push(river_one["river_name"]);
        river_obj[river_one["river_name"]]=5;
      }
    });
    res.send(river_list);
  },(err)=>{
    res.status(500).send("Internal Server Error");
  })
});

//give river by river name
router.post('/search/river',(req,res)=>{
  var ph=[],quantity1=[],tDs=[],disoxy=[],rivername,update=[];
  river.find({river_name:req.body.river_name}).then((docs)=>{
    var maxi_len=0;
    docs.forEach(doc=>{
      if(maxi_len<doc.pH.length)
        maxi_len=doc.pH.length;
    });
    for(var i=0;i<maxi_len;i++)
    {
      var pph=0,qu=0,td=0,dis=0,flag=0;
      var count=0;
      docs.forEach((doc)=>{
        if(i<doc.pH.length)
        {
          count+=1;
          pph+=doc.pH[i];
          qu+=doc.quantity[i];
          td+=doc.tds[i];
          dis+=doc.dissolve_oxygen[i];
          rivername=doc.river_name;
          if(flag===0)
          {
            flag++;
            var date=moment(doc.updated_at[i]);
            update.push(date.format('MMM Do YYYY'));
          }
       }
      });
      ph.push(pph/count);
      quantity1.push(qu/count);
      tDs.push(td/count);
      disoxy.push(dis/count);
   }
   var len=docs[0].pH.length;
   predict(ph,docs[0].updated_at[len-1],(result)=>{
     if(result){
       var river_obj={
         pH:ph,
         quantity:quantity1,
         tds:tDs,
         dissolve_oxygen:disoxy,
         river_name:rivername,
         update:update,
         result:result
       };
       res.send(river_obj);
     }

   });

  })
});

//give river by pincode
router.post('/search/pincode',(req,res)=>{
  var river_obj={};
  var river_list=[];
  river.find({pincode:req.body.pincode}).then((doc)=>{
    doc.forEach((river_one)=>{
      if(river_obj[river_one["river_name"]]===undefined)
      {
        river_list.push(river_one["river_name"]);
        river_obj[river_one["river_name"]]=5;
      }
    });
    res.send(river_list);
  },(err)=>{
    res.status(500).send("Internal Server Error");
  })
});

//search state and their count;

router.get('/search/state',(req,res)=>{

  res.send({
    state:state_li,
    count:count
  })

  });


//query by a particular state
router.post('/search/statename',(req,res)=>{
  console.log(req.body.state);
  var river_obj={};
  var river_list=[];
  river.find({state:req.body.state}).then((doc)=>{
    doc.forEach((river_one)=>{
      if(river_obj[river_one["river_name"]]===undefined)
      {
        river_list.push(river_one["river_name"]);
        river_obj[river_one["river_name"]]=5;
      }
    });
    res.send(river_list);
  },(err)=>{
    res.status(500).send("Internal Server Error");
  })
});

//latitude longitude get req

router.get('/latlang',(req,res)=>{
  var latitude=[];
  var longitude=[];
  var river_obj={};
  var river_name=[];
  river.find().then((doc)=>{
    doc.forEach((river_one)=>{

        river_name.push(river_one["river_name"]);
        latitude.push(river_one["latitude"]);
        longitude.push(river_one["longitude"]);

    });
    res.send({river_name,latitude,longitude});
  },(err)=>{
    res.status(500).send("Internal Server Error");
  })
});

//login route
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


//add new userID
router.post('/users', (req, res) => {
	const name = req.body.name;
  const userID = req.body.userID;
	const email = req.body.email;
	const password = req.body.password;
	if (!name || !email || !password || !userID || !userID.trim() || !name.trim() || !email.trim() || !password.trim()) {
		res.status(400).json({message: 'Invalid Request !'});
	} else {
		register.registerUser(userID, name, email, password)
		.then(result => {
			res.setHeader('Location', '/users/'+userID);
			res.status(result.status).json({ message: result.message })
		})
		.catch(err => res.status(err.status).json({ message: err.message }));
	}
});


//get info of user on the basis of userID
router.get('/users/:id', (req,res) => {
	if (checkToken(req)) {
		profile.getProfile(req.params.id)
		.then(result => res.json(result))
		.catch(err => res.status(err.status).json({ message: err.message }));
	} else {
		res.status(401).json({ message: 'Invalid Token !' });
	}
});



//change the name of password
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


//forget password
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


//cheching token
function checkToken(req) {
	const token = req.headers['x-access-token'];
  //console.log(token);
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
