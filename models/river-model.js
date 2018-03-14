
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riverSchema = new Schema({
    email: String,
    river_name: String,
    quantity: [Number],
    pH: [Number],
    tds:[Number],
    dissolve_oxygen: [Number],
    type_of_uses: [Schema.Types.Mixed],
    updated_at : [String],
    pincode : Number,
    district: String

});

const River = mongoose.model('river', riverSchema);

module.exports = River;
