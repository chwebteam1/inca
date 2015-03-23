var hug = angular.module('hugApp', ['ngRoute','ngMaterial','ngAnimate','ngSanitize']); // dependencies injections


var userInfos = ""; // will contain information of the user connected
var username = ""; // logs
var password = ""; // logs


// -----------------------
// list of the controllers
// -----------------------

function isLoggedIn(){
	if(userInfos == ""){
		window.location = "#/connexion";
		return false;
	}else
		return true;
}



// ----------------------------
// config for the app (routing)
// ----------------------------

hug.config(function($routeProvider){

	$routeProvider
	.when('/connexion',{

		controller : controllers.ConnexionController,
		templateUrl: '../views/connexion.html'

	}).when('/intervention/:IdUnite/:Idpatient',{

		controller : controllers.AddInterventionController,
		templateUrl: '../views/addIntervention.html'

	}).when('/unites',{

		controller : controllers.UnitesController,
		templateUrl: '../views/unites.html'

	}).when('/rooms',{

		controller : controllers.RoomsController,
		templateUrl: '../views/rooms.html'

	}).when('/interventions/patient/:IdUnite/:Idpatient',{

		controller : controllers.InterventionsPatientController,
		templateUrl: '../views/interventions.html'

	}).when('/interventions/historic',{

		controller : controllers.HistoricController,
		templateUrl: '../views/historic.html'

	}).when('/deconnexion',{

		controller : controllers.DeconnexionController,
		templateUrl: '../views/deconnexion.html'

	}).otherwise({redirectTo : '/connexion'});
});

// -------
// general
// -------



function exist(variable){
	if (typeof variable !== 'undefined')
		return true;
	else
		return false;
}

