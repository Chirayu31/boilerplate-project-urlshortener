const mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
    longurl: String,
    code: String
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;