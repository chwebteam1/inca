var mongoose = require('mongoose');

module.exports = mongoose.model('act', {
	"ID" : String,
	"TASK_ID" : String,
	"TITLE" : String,
	"SUBTITLE_1" : String,
	"SUBTITLE_2" : String,
	"PLANNED_DATETIME" : String,
	"PLANNED_DATETIME_DISPLAY" : String,
	"ACT_STATUS_CODE" : String,
	"TASK_STATUS_CODE" : String,
	"RESERVE" : String,
	"TYPE" : String,
	"COLOR" : String,
	"IDS_DAL" : String,
	"INFO_PART_LIST" : String,
	"INFORMATION" : String,
	"INTERVENTION" : String,
	"idActGroup" : String
});