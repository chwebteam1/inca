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

// configuration ===============================================================
mongoose.connect(database.url+"/hug"); // connect to mongoDB database on modulus.io

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}


// importation of the xml file into the database
fs.readFile(xmlinputfilepath, "utf8", function (err, data) {

    var jsonresult = parser.toJson(data);
	jsonresult = JSON.parse(jsonresult);
	console.log(jsonresult);

	// empties the collections
	DBunits.remove(function(){});

	

	// store units
	for (unites in jsonresult.UNIT_LIST){
		DBunits.create(jsonresult.UNIT_LIST[unites],function(){});
	}
	
	console.log("database imported successfully.");

});






app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
