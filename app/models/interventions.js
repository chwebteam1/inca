var mongoose = require('mongoose');

module.exports = mongoose.model('interventions', {
	"ID" : String,
	"LABEL" : String,
	"idAct" : String
});