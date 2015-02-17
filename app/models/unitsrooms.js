var mongoose = require('mongoose');

module.exports = mongoose.model('unitsrooms', {
	IdUnit : String,
	IdRoom : String
});