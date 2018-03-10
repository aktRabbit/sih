var mongoose = require('mongoose');
const keys = require('../config/keys');


mongoose.Promise=global.Promise;
mongoose.connect(keys.mongodb.dbURI||'mongodb://localhost:27017/Bihar');


module.exports=mongoose;
