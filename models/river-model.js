
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riverSchema = new Schema({
    userID: String,
    river_name:{
      type:String,
      required:true
    },
    quantity: [Number],
    pH: [Number],
    tds:[Number],
    dissolve_oxygen: [Number],
    type_of_uses: [Schema.Types.Mixed],
    updated_at : [Number],
    pincode :{
      type:Number,
      required:true
    },
    district :{
      type:String,
      required:true
    },
    state :{
      type:String,
      required:true
    },
    latitude:Number,
    longitude:Number,
    temp_updating_time: Number,
    drainage:[[Number]]

});

const River = mongoose.model('river', riverSchema);

module.exports = River;
