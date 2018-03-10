const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riverSchema = new Schema({
    name: String,
    quantity: String,
    tou: String
});

const River = mongoose.model('ankit', riverSchema);

module.exports = River;
