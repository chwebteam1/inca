var mongoose = require('mongoose');

module.exports = mongoose.model('act_group', {
	"ID" : String, // Forgind an ID for collection binding purposes
	"PLANNED_DATETIME": String,
	"PLANNED_DATETIME_DISPLAY": String,
	"VALID_ANTICIP": String,
	"TYPE": String,
	"TITLE": String,
	"SUBTITLE_1": String,
	"SUBTITLE_2": String,
	"COLOR": String,
	"RESERVE": String,
	"idPatient" : String
});