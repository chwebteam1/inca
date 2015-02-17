var mongoose = require('mongoose');

module.exports = mongoose.model('rooms', {
	ID : String,
	LABEL : String,
	SEX : String,
	idBed1 : String,
	idBed2 : String
});