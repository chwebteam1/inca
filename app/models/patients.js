var mongoose = require('mongoose');

module.exports = mongoose.model('patients', {
	ID : String,
	AGE_STRING : String,
	FIRST_NAME : String,
	LAST_NAME : String,
	SEXE : String,
	PHOTO_URL : String
});