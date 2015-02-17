var hug = angular.module('hugApp', ['ngRoute','ngMaterial','ngAnimate']); // empty array here is for dependencies injections

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

var controllers = {}; // will contain all the controller needed for the module
controllers.ConnexionController = ConnexionController;
controllers.UnitesController = UnitesController;
controllers.RoomsController = RoomsController;
controllers.InterventionsPatientController = InterventionsPatientController;
controllers.DeconnexionController = DeconnexionController;
controllers.sideNav = sideNav;
controllers.LeftController = LeftController;
controllers.RightController = RightController;


// --------------------------------------
// binding functions to their factory/controllers
// --------------------------------------

hug.controller('getters', controllers.ConnexionController);
hug.controller('getters', controllers.UnitesController);
hug.controller('getters', controllers.RoomsController);
hug.controller('getters', controllers.InterventionsPatientController);
hug.controller('DeconnexionController',controllers,DeconnexionController)

// esthétique side nav
hug.controller('sideNav', controllers.sideNav);
hug.controller('LeftController', controllers.LeftController);
hug.controller('RightController', controllers.RightController);



// ----------------------------
// config for the app (routing)
// ----------------------------

hug.config(function($routeProvider){

	//var access = routingConfig.accessLevels;

	$routeProvider
	.when('/connexion',{

		controller : controllers.ConnexionController,
		templateUrl: 'Partials/connexion.html'
	//	access : access.anon

	}).when('/unites',{

		controller : controllers.UnitesController,
		templateUrl: 'Partials/unites.html'
	//	access : access.user
	//	resolve : isLoggedIn()

	}).when('/rooms',{

		controller : controllers.RoomsController,
		templateUrl: 'Partials/rooms.html'
	//	access : access.user
	//	resolve : isLoggedIn()

	}).when('/interventions/patient/:Idpatient',{

		controller : controllers.InterventionsPatientController,
		templateUrl: 'Partials/interventions.html'
	//	access : access.user
	//	resolve : isLoggedIn()

	}).when('/deconnexion',{

		controller : controllers.DeconnexionController,
		templateUrl: 'Partials/deconnexion.html'
	//	resolve : isLoggedIn()
	//	access : access.user

	}).otherwise({redirectTo : '/connexion'});
});



hug.factory('getters',function($http){

	var factory = {};

	// -----------------------------------------------------------------------
	// password is currently not encrypted, should be fixed in the near future
	// -----------------------------------------------------------------------

	factory.checkUser = function(){
		var url = '/api/connexion';
		var data ={"username": username,"password": password};

		return $http.post(url,data); // asynchronus request to server
	};

	factory.getUnites = function(){

		// load unites
		var url = '/api/unites';
		return $http.get(url); // asynchronus request to server

	};

	factory.getInfosUnite = function(idUnit){

		var url = '/api/unite?ID='+idUnit;
		return $http.get(url); // asynchronus request to server

	};


	return factory;
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


// -----------
// controllers
// -----------

// ----------
// esthétique
// ----------

function sideNav($scope, $timeout, $mdSidenav, $log) {

  $scope.toggleLeft = function() {
    $mdSidenav('left').toggle()
                      .then(function(){
                          $log.debug("toggle left is done");
                      });
  };

  $scope.toggleRight = function() {
    $mdSidenav('right').toggle()
                        .then(function(){
                          $log.debug("toggle RIGHT is done");
                        });
  };
};

function LeftController($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('left').close()
                      .then(function(){
                        $log.debug("close LEFT is done");
                      });
  };
};

function RightController($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function() {
    $mdSidenav('right').close()
                        .then(function(){
                          $log.debug("close RIGHT is done");
                        });
  };
};

function DeconnexionController($scope){
	userInfos = "";
	console.log("You have been disconnected");
	window.location = "#/connexion";
}

// -------
// GETTERS
// -------

function ConnexionController($scope, $http, getters) {

	$scope.submit = function() {
		$scope.errorMessage  = "";
		if ($scope.username != '' & $scope.password != '') {

			username = $scope.username;
			password = $scope.password;

			var handleSuccess = function(data, status) {
				if (data != '') {
					//stock les informations du l'utilisateur
					userInfos = data;
					window.location = "#/unites";
				}else
					$scope.errorMessage = "Les identifiants entrés ne correspondent pas.";
			};

			getters.checkUser().success(handleSuccess);

		}else
			$scope.errorMessage =  "Veuillez remplir les 2 champs s'il vous plait.";
	}
}


function UnitesController($scope,$http, getters){

	var handleSuccess = function(data, status) {

		var i = 0;
		var infosUnites = {};
		console.log(data);
		for(i in data.units){
			//console.log(data.units[i]);
			infosUnites[i] = {
				"nomUnit" : data.units[i].LONG_NAME,
				"ID" : data.units[i].ID
			};
		}

		$scope.unites = infosUnites;
	};

	getters.getUnites().success(handleSuccess);
}



function RoomsController($scope,$http,$routeParams, getters){
	// continue only if unite is chosen
	if (exist($routeParams.unite))
		var idUnit = $routeParams.unite;
	else
		window.location="#/unites";

	var handleSuccess = function(data, status) {
		console.log(data);
		var infosRooms = {};
		$scope.rooms = {};
		var counter = 0;

		

	};

	getters.getInfosUnite(idUnit).success(handleSuccess);

}



function InterventionsPatientController($scope,$http,$routeParams,getters){
	var isOk = false;

	if(exist($routeParams.Idpatient)){
		var Idpatient = $routeParams.Idpatient;
		isOk = true; // we have all the variables we need
	}


	if(!isOk)
		window.location="#/unites";

	/* initialisation done - treatment starts */

	var handleSuccess = function(data, status) {

		$scope.patient = data;
		// retrieve list of types of interventions that applies to that patient
		}
	getters.getPatient(Idpatient).success(handleSuccess);
}

// -------
// SETTERS
// -------

// ---------
// DELETTERS
// ---------

// --------
// CREATERS
// --------
