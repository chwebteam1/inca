// set connections to the collections in hug
var beds = require('./models/beds');
var patients = require('./models/patients');
var rooms = require('./models/rooms');
var unites = require('./models/units');
var unitsrooms = require('./models/unitsrooms');
var users = require('./models/unitsrooms');
var hugUsers = require('./models/users');
var Async = require('./lib/async.js');
var act_group = require('./models/act_group');
var act = require('./models/act');
var historic = require('./models/historic');

// -------
// general
// -------


var detailledlogs = false;
var badRequestError = 400;

function jsonToArray(parsed){
	var arr = [];
	for(var x in parsed){
		arr.push(parsed[x]);
	}
	return arr;
}

function exist(variable){
	if (typeof variable !== 'undefined')
		return true;
	else
		return false;
}

module.exports = function(app) {

	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------
	// ---------------------------------- API ----------------------------------
	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------

	// -----------------
	// URI : /connexion
	// method : POST
	// Date : 03.01.2015
	// -----------------


	// check if a user exist
	app.post('/api/connexion', function(req, res) {

		// log message
		if(detailledlogs)
			console.log("Default Page requested");

		// return the infos of the user if the suername and password matches
		var query  = hugUsers.where('username').equals(req.body.username).where('password').equals(req.body.password);
		//var user = null;
		query.findOne(function (err, user) {
			if (err) return handleError(err);
			if (user) {
				// doc may be null if no document matched
				res.json(user); // return all units in JSON format
			}else{
				res.send(null);
			}
		});
	});


	// -----------------
	// URI : /unites
	// method : GET
	// Date : 03.01.2015
	// -----------------


	// get the list of all the units
	app.get('/api/unites', function(req, res) {

		// log message
		if(detailledlogs)
			console.log("list of all units requested");

		var data = {};
		unites.find(function (err, units) {
			if (err) return handleError(err);
			if (units) {
				data['units'] = units;
				res.json(data); // return all units in JSON format
			}else{
				res.send(null);
			}
		});
	});


	// -----------------
	// URI : /rooms
	// method : GET
	// Date : 04.01.2015
	// -----------------

	// get the list of all the rooms
	app.get('/api/rooms', function(req, res) {

		// log message
		if(detailledlogs)
			console.log("list of rooms in unit " + req.query.ID + " requested");

		var data = {};
		// let's look for the id of the rooms of the unit
		unitsrooms.find({IdUnit : req.query.ID}, function(err, roomsUnitsInfos) {
			if (err) {
				return res.status(badRequestError).end();
			}

			if(exist(roomsUnitsInfos[0])){
				rooms.find({IdRoom : roomsUnitsInfos.ID} , function(err, roomsInfos) {
					if (err) {
						return res.status(badRequestError).end();
					}

					data["rooms"] =  roomsInfos;
					res.json(data);
				});
			}else{
				if(detailledlogs)
					console.log("no match found for rooms in unit " + req.query.ID);
				res.json(null);
			}
		});

	});


	// -----------------
	// URI : /beds
	// method : GET
	// Date : 06.01.2015
	// -----------------

	// get the informations of the 2 beds in the room
	app.get('/api/beds', function(req, res) {

		// log message
		if(detailledlogs)
			console.log("List of the 2 beds " + req.query.idBed1 + " - " + req.query.idBed2 + " with their informations requested");

		var data = {};

		// let's look for information of the beds in the room
		var query = beds.find();
		query.where('ID').in([req.query.idBed1, req.query.idBed2]);
		query.exec(function(err, roomBeds) {
			if (err) {
				return res.status(badRequestError).end();
			}
			data['beds'] = roomBeds;
			res.json(data);
		});

	});


	// -----------------
	// URI : /patient
	// method : GET
	// Date : 07.01.2015
	// -----------------

	// get the infos of 1 patient
	app.get('/api/patient', function(req, res) {
		// log message

		if(detailledlogs)
			console.log("Info about the patient " + req.query.idPatient+" requested");

		var data = {};

		// let's look for informations of the patient
		patients.findOne({ID : req.query.idPatient},function(err, Patient) {
			if (err) {
				return res.status(badRequestError).end();
			}

			res.json(Patient);
		});


	});


	// -----------------
	// URI : /patients
	// method : GET
	// Date : 06.01.2015
	// -----------------

	// get the infos of 2 patients
	app.get('/api/patients', function(req, res) {
		// log message
		if(detailledlogs)
			console.log("Info about the patient " + req.query.idPatient1 + " and "+ req.query.idPatient2 +" requested");

		var data = {};
		// let's look for informations of the patients in the room
		var query = patients.find();
		var arguments = [];
		arguments = jsonToArray(req.query);
		query.where('ID').in(arguments);
		query.exec(function(err, roomPatients) {
			if (err) {
				return res.status(badRequestError).end();
			}
			data['patients'] = roomPatients;
			res.json(data);
		});


	});


	// -------------------
	// URI : /intervention
	// method : DELETE
	// Date : 04.03.2015
	// -------------------

	// deletes an act
	app.delete('/api/intervention', function(req, res) {
		var idAct = req.query.idAct;

		// log message
		if(detailledlogs)
			console.log("deleting act "+ idAct);

		var condition = {'ID' : idAct};
		var query = act.findOne(condition);
		query.exec(function(err,data){
			if(err) return handleError(err);
			if(data){
				var idActGroup = data.idActGroup;
			
				query = act.findOneAndRemove(condition);
				query.exec(function(){
					// now we need to check if the act_group is empty or not
					// if it is we should erase it
					// to see if it's empty let's run a simple test
					condition = {'idActGroup' : idActGroup};
					query = act.findOne(condition);
					query.exec(function(err,data){
						if(err) return handleError(err);

						if(!data){ // there's no act in this act_group anymore
							if(detailledlogs)
								console.log("deleting act_group "+ idActGroup);
							condition = {'ID' : idActGroup};
							query = act_group.findOneAndRemove(condition);
							query.exec(function(){});
						}
						res.send(null);
					});

				});
			}

		});

	});

	// -------------------
	// URI : /intervention/historic
	// method : PUT
	// Date : 04.03.2015
	// -------------------

	// adds an act to historic and removes it from it's original place
	app.post('/api/intervention/historic', function(req, res) {
		var infoIntervention = req.body.Intervention;
		// log message
		if(detailledlogs)
			console.log("adding an act to historic and removing it from it's original place");

		var idAct = infoIntervention.ID;
		var idActGroup = infoIntervention.idActGroup;

		// log message
		if(detailledlogs)
			console.log("move act " + idAct + " to historic");


		infoIntervention.ACT_STATUS_CODE = 'completed'; // act transferred to server


		historic.create(infoIntervention,function(){ // callback will be used to delete the entry in the act collection
			var condition = {'ID' : idAct};
			var query = act.findOneAndRemove(condition);

			query.exec(function(){
				// now we need to check if the act_group is empty or not
				// if it is we should erase it
				// to see if it's empty let's run a simple test
				condition = {'idActGroup' : idActGroup};
				query = act.findOne(condition);
				query.exec(function(err,data){
					if(err) return handleError(err);

					if(!data){ // there's no act in this act_group anymore
						if(detailledlogs)
							console.log("deleting act_group "+ idActGroup);
						condition = {'ID' : idActGroup};
						query = act_group.findOneAndRemove(condition);
						query.exec(function(){});
					}
					res.send(null);
				});
			});

		});
	});

	// -------------------
	// URI : /intervention/historic
	// method : GET
	// Date : 14.03.2015
	// -------------------

	// retrievs data from the historic
	app.get('/api/intervention/historic', function(req, res) {
		//log message
		if(detailledlogs)
			console.log("retriving data from historic");

		var data = {};
		var query = historic.find();

		query.exec(function(err,historic){
			if(err) return handleError(err);
			if(historic){
				res.json(historic);
			}else{
				if(detailledlogs)
					console.log("no match found");
				res.send(null);
			}

		});

	});


	// --------------------------------
	// URI : /interventions/group{patientID}
	// method : GET
	// Date : 07.01.2015
	// --------------------------------

	// get the list of all the act_group that applies to a specific patient

	app.get('/api/interventions/group', function(req, res) {
		var idPatient = req.query.idPatient;
		// log message
		if(detailledlogs)
			console.log("getting the list of all the act_group of a patient " + idPatient);


		var data = {};
		var condition = { 'idPatient' : idPatient };
		var query = act_group.find(condition);

		query.exec(function (err, actGrp) {
			if (err) return handleError(err);
			if (actGrp) {
				res.json(actGrp); // return all ACT_GROUP in JSON format
			}else{
				if(detailledlogs)
					console.log("no match found");
				res.send(null);
			}
		});
	});

	// --------------------------------
	// URI : /interventions/patient/{idGroup}
	// method : GET
	// Date : 07.01.2015
	// --------------------------------

	// get the list of all the interventions of a certain type for a specific patient

	app.get('/api/interventions/patient/', function(req, res) {
		var idActGroup = req.query.idGroup;
		// log message
		if(detailledlogs)
			console.log("getting the list of all acts in act_group " + idActGroup + " for a patient");

		var data = {};
		var condition = { 'idActGroup' : idActGroup };
		var query = act.find(condition);

		query.exec(function (err, acts) {
			if (err) return handleError(err);

			if (acts) {
				if(acts != [])
					res.json(acts); // return all ACT in JSON format
				else
					res.send(null);
			}else{
				if(detailledlogs)
					console.log("no match found");
				res.send(null);
			}
		});
	});

	// --------------------------------
	// URI : /intervention/add/
	// method : POST
	// Date : 01.03.2015
	// --------------------------------

	// adds an act to it's appropriate act_group if existing or to a new one
	app.post('/api/intervention/add/',function(req,res){

		// log message
		if(detailledlogs)
			console.log("adding user entry new act");

		var actToAdd = req.body.act;
		var idPatient = req.body.idPatient;
		var planned_datetime = actToAdd.date + " " + actToAdd.time_display;
		var condition = { 'idPatient' : idPatient, 'PLANNED_DATETIME' : planned_datetime};
		var query = act_group.find(condition);

		query.exec(function(err,actGrpCorrespond){
			if(err)
				res.send(err);

			if(actGrpCorrespond.length > 0) {// there is a corresponding act_group
				var idActGroup = actGrpCorrespond[0].ID;
			}else{ // we'll have to create an act group for that act

				// filling all the necessary information

				//  I don't check if the idActGroup already exists !
				var idActGroup = Math.floor((Math.random() * Date.now()) + 1);

				var data = {
					"ID" : idActGroup, // Forgind an ID for collection binding purposes
					"PLANNED_DATETIME": planned_datetime,
					"PLANNED_DATETIME_DISPLAY": actToAdd.time,
					"VALID_ANTICIP": 0, // default value
					"TYPE": actToAdd.type,
					"TITLE": actToAdd.title,
					"SUBTITLE_1": actToAdd.subtitle1,
					"SUBTITLE_2": actToAdd.subtitle2,
					"COLOR": '#000000', // irrelevant
					"RESERVE": "false", // false is the most common value for RESERVE (irrelevant for the project)
					"idPatient" : idPatient
				};

				// creation of the act_group
				act_group.create(data,function(){});
			}

			var ForgedAct = {
				"ID" : Math.floor((Math.random() * Date.now()) + 1), // random ID => irrelevant
				"TASK_ID" : Math.floor((Math.random() * Date.now()) + 1), // random TASK_ID => irrelevant
				"TITLE" : actToAdd.title,
				"SUBTITLE_1" : actToAdd.subtitle1,
				"SUBTITLE_2" : actToAdd.subtitle2,
				"PLANNED_DATETIME" : planned_datetime,
				"PLANNED_DATETIME_DISPLAY" : actToAdd.time_display,
				"ACT_STATUS_CODE" : "planned",
				"TASK_STATUS_CODE" : "planned",
				"RESERVE" : "false", // false is the most common value for RESERVE (irrelevant for the project)
				"TYPE" : actToAdd.type,
				"COLOR" : "#000000", // irrelevant
				"IDS_DAL" : Math.floor((Math.random() * Date.now()) + 1), // random IDS_DAL => irrelevant
				"INFO_PART_LIST" : "", // ireelevant
				"INFORMATION" : actToAdd.information,
				"INTERVENTION" : actToAdd.type, // should be filled with a list of interventions 1 x depth level, the first is the type
				"idActGroup" : idActGroup
			};

			// add the act to it's act group
			act.create(ForgedAct,function(){
				res.send(null); // everything went ok
			});
		});
	});

	// -----------
	// application
	// -----------

	app.get('*', function(req, res) {
		res.send('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
}