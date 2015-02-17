var mongoose = require('mongoose');

module.exports = mongoose.model('units', {
	ID : String,
	ABBR : String,
	LONG_NAME : String,
	SHORT_NAME : String
});