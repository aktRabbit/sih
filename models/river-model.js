
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riverSchema = new Schema({
    userID: String,
    river_name: String,
    quantity: [Number],
    pH: [Number],
    tds:[Number],
    dissolve_oxygen: [Number],
    type_of_uses: [Schema.Types.Mixed],
    updated_at : [Number],
    pincode : Number,
    district: String,
    state:String,
    latitude:Number,
    longitude:Number

});

const River = mongoose.model('river', riverSchema);

module.exports = River;
