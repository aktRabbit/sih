var mongoose = require('mongoose');
const keys = require('../config/keys');


mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGODB_URI);


module.exports=mongoose;
