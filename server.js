// set up ======================================================================
var express  = require('express');
var app      = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var port     = process.env.PORT || 8080; // set the port
var database = require('./config/database'); // load the database config
var fs = require('fs');

var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var parser = require('xml2json');

var jsonoutputfilepath = './data/UnitList.json';
var xmlinputfilepath = './data/UnitList.xml';

// set connections to the collections in hug
var DBbeds = require('./app/models/beds');
var DBpatients = require('./app/models/patients');
var DBrooms = require('./app/models/rooms');
var DBunits = require('./app/models/units');
var DBunitsrooms = require('./app/models/unitsrooms');
var DBusers = require('./app/models/unitsrooms');
var DBact_group = require('./app/models/act_group');
var DBact = require('./app/models/act');
var DBinterventions = require('./app/models/interventions');
var DBhistoric = require('./app/models/historic');

// configuration ===============================================================
mongoose.connect(database.url+"/hug"); // connect to mongoDB database

// checks if a value is integer or not
function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}


// importation of the xml file into the database
fs.readFile(xmlinputfilepath, "utf8", function (err, data) {

    var jsonresult = parser.toJson(data);
	jsonresult = JSON.parse(jsonresult);

	// empties the collections
	DBbeds.remove(function(){});
	DBpatients.remove(function(){});
	DBrooms.remove(function(){});
	DBunits.remove(function(){});
	DBunitsrooms.remove(function(){});
	DBusers.remove(function(){});
	DBact_group.remove(function(){});
	DBact.remove(function(){});
	DBinterventions.remove(function(){});
	DBhistoric.remove(function(){});



	data = null;
	// store units

	for (unites in jsonresult.UNIT_LIST){

		data = {
			"ID" : jsonresult.UNIT_LIST[unites].ID,
			"SHORT_NAME" : jsonresult.UNIT_LIST[unites].SHORT_NAME,
			"ABBR" : jsonresult.UNIT_LIST[unites].ABBR,
			"LONG_NAME" : jsonresult.UNIT_LIST[unites].LONG_NAME
		};

		DBunits.create(data,function(){});

		// store relations between rooms and units
		for (room in jsonresult.UNIT_LIST[unites].ROOM){
			DBunitsrooms.create({"IdUnit" : jsonresult.UNIT_LIST[unites].ID, "IdRoom" : jsonresult.UNIT_LIST[unites].ROOM[room].ID},function(){});
			var infosRoom = jsonresult.UNIT_LIST[unites].ROOM[room];

			// store rooms

			data = {
				"ID" : infosRoom.ID,
				"LABEL" : infosRoom.LABEL,
				"SEX" : infosRoom.SEX,
				"idBed1" : infosRoom.BED[0].ID, // toujours 2 lits dans une chambre
				"idBed2" : infosRoom.BED[1].ID  // toujours 2 lits dans une chambre
			};
			DBrooms.create(data,function(){});

			for (bed in infosRoom.BED){

				// store beds

				data = {
					"ID" : infosRoom.BED[bed].ID,
					"LABEL" : infosRoom.BED[bed].LABEL,
					"POS_X" : infosRoom.BED[bed].POS_X,
					"POS_Y" : infosRoom.BED[bed].POS_Y,
					"idPatient" : infosRoom.BED[bed].PATIENT.ID
				};

				DBbeds.create(data,function(){});

				// store patients

				data = {
					"ID" : infosRoom.BED[bed].PATIENT.ID,
					"AGE_STRING" : infosRoom.BED[bed].PATIENT.AGE_STRING,
					"FIRST_NAME" : infosRoom.BED[bed].PATIENT.FIRST_NAME,
					"LAST_NAME" : infosRoom.BED[bed].PATIENT.LAST_NAME,
					"SEXE" : infosRoom.BED[bed].PATIENT.SEXE,
					"PHOTO_URL" : infosRoom.BED[bed].PATIENT.PHOTO_URL
				}

				DBpatients.create(data,function(){});

				var lstPatients = infosRoom.BED[bed].PATIENT;
				var actGrp;

				var idActGroup = Math.floor((Math.random() * Date.now()) + 1);

				for (actGrp = 0; actGrp < lstPatients.ACT_GROUP.length; actGrp++){
					// store ACT_GROUP (type d'action)
					
					data = {
						"ID" : idActGroup, // forging an ID for collection binding purpose
						"PLANNED_DATETIME": lstPatients.ACT_GROUP[actGrp].PLANNED_DATETIME,
						"PLANNED_DATETIME_DISPLAY": lstPatients.ACT_GROUP[actGrp].PLANNED_DATETIME_DISPLAY,
						"VALID_ANTICIP": lstPatients.ACT_GROUP[actGrp].VALID_ANTICIP,
						"TYPE": lstPatients.ACT_GROUP[actGrp].TYPE,
						"TITLE": lstPatients.ACT_GROUP[actGrp].TITLE,
						"SUBTITLE_1": lstPatients.ACT_GROUP[actGrp].SUBTITLE_1,
						"SUBTITLE_2": lstPatients.ACT_GROUP[actGrp].SUBTITLE_2,
						"COLOR": lstPatients.ACT_GROUP[actGrp].COLOR,
						"RESERVE": lstPatients.ACT_GROUP[actGrp].RESERVE,
						"idPatient" : infosRoom.BED[bed].PATIENT.ID
					}

					DBact_group.create(data,function(){});

					var listActrGrp = lstPatients.ACT_GROUP[actGrp];

					if(listActrGrp.ACT.length === undefined){ // means there's only one act in the act_group

						data = {
							"ID" : listActrGrp.ACT.ID,
							"TASK_ID" : listActrGrp.ACT.TASK_ID,
							"TITLE" : listActrGrp.ACT.TITLE,
							"SUBTITLE_1" : listActrGrp.ACT.SUBTITLE_1,
							"SUBTITLE_2" : listActrGrp.ACT.SUBTITLE_2,
							"PLANNED_DATETIME" : listActrGrp.ACT.PLANNED_DATETIME,
							"PLANNED_DATETIME_DISPLAY" : listActrGrp.ACT.PLANNED_DATETIME_DISPLAY,
							"ACT_STATUS_CODE" : listActrGrp.ACT.ACT_STATUS_CODE,
							"TASK_STATUS_CODE" : listActrGrp.ACT.TASK_STATUS_CODE,
							"RESERVE" : listActrGrp.ACT.RESERVE,
							"TYPE" : listActrGrp.ACT.TYPE,
							"COLOR" : listActrGrp.ACT.COLOR,
							"IDS_DAL" : listActrGrp.ACT.IDS_DAL,
							"INFO_PART_LIST" : listActrGrp.ACT.INFO_PART_LIST,
							"INFORMATION" : listActrGrp.ACT.INFORMATION,
							"INTERVENTION" : listActrGrp.ACT.INTERVENTION,
							"idActGroup" : idActGroup
						};

						DBact.create(data,function(){});

					}else{

						for (var act = 0; act < listActrGrp.ACT.length; act++){

							data = {
								"ID" : listActrGrp.ACT[act].ID,
								"TASK_ID" : listActrGrp.ACT[act].TASK_ID,
								"TITLE" : listActrGrp.ACT[act].TITLE,
								"SUBTITLE_1" : listActrGrp.ACT[act].SUBTITLE_1,
								"SUBTITLE_2" : listActrGrp.ACT[act].SUBTITLE_2,
								"PLANNED_DATETIME" : listActrGrp.ACT[act].PLANNED_DATETIME,
								"PLANNED_DATETIME_DISPLAY" : listActrGrp.ACT[act].PLANNED_DATETIME_DISPLAY,
								"ACT_STATUS_CODE" : listActrGrp.ACT[act].ACT_STATUS_CODE,
								"TASK_STATUS_CODE" : listActrGrp.ACT[act].TASK_STATUS_CODE,
								"RESERVE" : listActrGrp.ACT[act].RESERVE,
								"TYPE" : listActrGrp.ACT[act].TYPE,
								"COLOR" : listActrGrp.ACT[act].COLOR,
								"IDS_DAL" : listActrGrp.ACT[act].IDS_DAL,
								"INFO_PART_LIST" : listActrGrp.ACT[act].INFO_PART_LIST,
								"INFORMATION" : listActrGrp.ACT[act].INFORMATION,
								"INTERVENTION" : listActrGrp.ACT[act].INTERVENTION,
								"idActGroup" : idActGroup
							};

							DBact.create(data,function(){});

							// I've implemented the extraction of the interventions but it isn't necessary for our application
							// as we don't display them. Even so, the way interventions are stored in the xml file is "challenging"
							// to retrieve which is why I wanted to demonstrate that it's possible.

							var deeper = true;
							var container = listActrGrp.ACT[act];
							var listInterventions = {};

							var i = 0;
							var idAct = 0; //init arbitrary value
							data = {'idAct' : 'first'};

							// iterates through all the interventions in all the acts in all the act groups of every patient of every unit
							while(deeper){

								if(container.TASK_ID != idAct && container.TASK_ID !== undefined)
									idAct = container.TASK_ID;

								data = seekIntervention(container,idAct);

								deeper = data.deeper;
								if(deeper){
									listInterventions[i] = data.info;
									i++;
								}
								container = data.container;

							}

							for (interventions in listInterventions){
								DBinterventions.create(listInterventions[interventions],function(){});
							}

						}
					}
					idActGroup = Math.floor((Math.random() * Date.now()) + 1);
				}
			}


		}

	}

	console.log("Database imported with success");

});


// used for the interventions digging
function seekIntervention(container, idAct){
	var data = {
		'deeper' : false,
		'info' : {},
		'container' : container
	};

	if(container.hasOwnProperty('INTERVENTION')){
		container = container.INTERVENTION;
		data.deeper = true;
		data.info = {
				'LABEL' : container.LABEL,
				'ID' : container.ID,
				'idAct' : idAct
			};
		data.container = container;

	}

	return data;
}




app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// logs will be displayed like following
// :method :url :status :response-time ms - :res[content-length]

app.use(morgan('dev')); // log every request to the console with colored code

// parse url UTF-8 only, will populate the request with an object body which will contain key-value pairs
app.use(bodyParser.urlencoded({'extended':'true'}));

// parse json in url
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
