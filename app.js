const express = require('express');
const bodyparser = require('body-parser');
const dbRoutes = require('./routes/db-routes');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const path= require('path');
const keys = require('./config/keys');



var app=express();


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs');
app.use(dbRoutes);

var port=process.env.PORT||3000;


app.listen(port,process.env.IP,()=>{
  console.log(`Starting at port ${port}`);
});
