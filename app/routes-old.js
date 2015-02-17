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

// -------
// general
// -------
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

	/*var userRoles = {
        public: 1, // 001
        user:   2, // 010
        admin:  4  // 100
    };
    var accessLevels = {
        public: userRoles.public | // 111
                userRoles.user   |
                userRoles.admin,
        anon:   userRoles.public,  // 001
        user:   userRoles.user |   // 110
                userRoles.admin,
        admin:  userRoles.admin    // 100
    };*/

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
		console.log("list of rooms in unit " + req.query.ID + " requested");

		var data = {};
		//console.log(req.query.ID);
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


	// --------------------------------
	// URI : /interventions/group{patientID}
	// method : GET
	// Date : 07.01.2015
	// --------------------------------

	// get the list of all the type of interventions that applies tooo a specific patient

	app.get('/api/interventions/group', function(req, res) {
		var idPatient = req.query.idPatient;


		var data = {};
		var condition = { 'idPatient' : idPatient };
		var query = act_group.find(condition);

		query.exec(function (err, actGrp) {
			if (err) return handleError(err);
			if (actGrp) {
				res.json(actGrp); // return all ACT_GROUP in JSON format
			}else{
				console.log("no match found");
				res.send(null);
			}
		});
	});

	// --------------------------------
	// URI : /interventions/{idGroup}
	// method : GET
	// Date : 07.01.2015
	// --------------------------------

	// get the list of all the interventions of a certain type for a specific patient

	app.get('/api/interventions/patient/', function(req, res) {
		var idActGroup = req.query.idGroup;


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
				console.log("no match found");
				res.send(null);
			}
		});
	});

	// -----------
	// application
	// -----------

	app.get('*', function(req, res) {
		/*var role = userRoles.public, username = '';
		if(req.user) {
			role = req.user.role;
			username = req.user.username;
		}

		res.cookie('user', JSON.stringify({
			'username': username,
			'role': role
		}));*/
		res.send('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
}