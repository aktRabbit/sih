const router=require('express').Router();
const river = require('../models/river-model');
const user = require('../models/user-model');
const mongoose = require('../databases/mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


router.get('/',isLogged,(req,res)=>{
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

router.get('/register',(req,res)=>{
  res.render('register');
});

router.post('/register',(req,res)=>{
  user.register(new user({username:req.body.username}),req.body.password,(err,body)=>{
   if(err){
     console.log(err);
     return res.render('register');
   }
   else {
     passport.authenticate("local")(req,res,()=>{
       var ob='{"success":1}';
       res.send(JSON.parse(ob));
     });
   }
 });

});

router.get('/login',(req,res)=>{
  res.render('login');
});

router.post('/login',passport.authenticate("local",{
  failureRedirect:"/login"
}),(req,res)=>{
  res.send("success");
});

router.get('/logout',(req,res)=>{
  req.logout();
  res.send("success");
});

function isLogged(req,res,next){
  if(req.isAuthenticated())
  return next();
  res.send("kuch ni milega");
}

module.exports=router;
