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
	// URI : /unite
	// method : GET
	// Date : 17.02.2015
	// -----------------

	// get the data of a particular unit
	app.get('/api/unite', function(req, res) {

		// log message
		console.log("data of unit " + req.query.ID + " requested");

		// let's look for the id of the rooms of the unit
		unites.find({ID : req.query.ID}, function(err, UniteInfos) {
			console.log(UniteInfos);
			if (err) {
				return res.status(badRequestError).end();
			}

			//return the data of the unite
			res.json(UniteInfos);

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