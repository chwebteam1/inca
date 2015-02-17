var mongoose = require('mongoose');

module.exports = mongoose.model('beds', {
	ID : String,
	LABEL : String,
	POS_X : String,
	POS_Y : String,
	idPatient : String
});