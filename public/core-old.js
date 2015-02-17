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

	factory.getRooms = function(idUnit){
		// load rooms
		var url = '/api/rooms?ID='+idUnit;
		return $http.get(url); // asynchronus request to server

	};

	factory.getBeds = function(idBed1,idBed2){
		// load beds
		var url = '/api/beds?idBed1='+idBed1+'&idBed2='+idBed2;
		return $http.get(url); // asynchronus request to server

	};

	factory.getPatient = function(idPatient){
		var url = '/api/patient?idPatient='+idPatient;
		return $http.get(url); // asynchronus request to server
	}

	factory.getPatients = function(idPatient1,idPatient2){
		// load patients
		var patients = {};

		var url = '/api/patients?idPatient1='+idPatient1+'&idPatient2='+idPatient2;
		return $http.get(url); // asynchronus request to server

	};

	factory.getTypeInterventionsPatient = function(idPatient){
		var url = '/api/interventions/group?idPatient='+idPatient;

		return $http.get(url); // asynchronus request to server
	}

	factory.getInterventionsPatient = function(idGroup){
		var url = '/api/interventions/patient?idGroup='+idGroup;

		return $http.get(url); // asynchronus request to server
	}

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
		var infosRooms = {};
		$scope.rooms = {};
		var counter = 0;

		var noRoomError = "Inconnue";
		var noBedError = "Aucun lit enregistré dans la chambre";
		var noPatientError = "Aucun patient n'occupe ce lit";

		// test de sécurité - pas de chambre dans l'untié
		if (data == null){
			$scope.rooms[0] = {nomRoom : noRoomError};
			$scope.uniteID = idUnit;
		}else{
			// on fait le tour des chambres dans l'unité
			for (var room in data.rooms){

				// retrieves the infos of the beds in the room
				getters.getBeds(data.rooms[room].idBed1,data.rooms[room].idBed2).success(function(databeds,status){

					// test de sécurité - pas de lits dans la chambre
					if(databeds == null){
						$scope.rooms[0] = {nomRoom : data.rooms[room].LABEL, patient1 : noBedError, patient2 : noBedError};
						$scope.uniteID = idUnit;
					}else{

						var idPatient1 = databeds.beds[0].idPatient;
						var idPatient2 = databeds.beds[1].idPatient;

						if(idPatient1 == '' & idPatient2 == ''){
							$scope.rooms[0] = {nomRoom : data.rooms[room].LABEL, patient1 : noPatientError, patient2 : noPatientError};
							$scope.uniteID = idUnit;
						}else{

							// retrieves the infos of the patients in the beds
							getters.getPatients(idPatient1,idPatient2).success(function(dataPatients,status){

								infosRooms = {
									"nomRoom"    : data.rooms[room].LABEL,
									"patient1"   : dataPatients.patients[0].FIRST_NAME + ' ' + dataPatients.patients[0].LAST_NAME,
									"patient2"   : dataPatients.patients[1].FIRST_NAME + ' ' + dataPatients.patients[1].LAST_NAME,
									"photo_url1" : dataPatients.patients[0].PHOTO_URL,
									"photo_url2" : dataPatients.patients[1].PHOTO_URL,
									"roomNb"     : room,
									"patient1ID" : dataPatients.patients[0].ID,
									"patient2ID" : dataPatients.patients[1].ID
								};

								$scope.rooms[counter] = infosRooms;
								$scope.uniteID = idUnit;

								counter++;
							});
						}
					}
				});

			}
		}

	};

	getters.getRooms(idUnit).success(handleSuccess);

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
		getters.getTypeInterventionsPatient(Idpatient).success(function(dataTypeIntervention,status){

			var i = 0;
			var y = 0;
			var infoIntervention = {};
			var dataType = {};
			$scope.typeIntervention = {};

			// goes through the list of type of interventions for a patient
			// for each type we inc i variable
			for(i = 0; i < dataTypeIntervention.length; i++){

				dataType =  {
					TYPE : dataTypeIntervention[i].TYPE,
					TITLE_TYPE : dataTypeIntervention[i].TYPE,
					SUBTITLE_TYPE1 : dataTypeIntervention[i].SUBTITLE_1,
					SUBTITLE_TYPE2 : dataTypeIntervention[i].SUBTITLE_2
				};
				//console.log(dataType);

				$scope.typeIntervention[i] = {"infos" : {},"interventions" : {}};
				$scope.typeIntervention[i].infos = dataType;

				getters.getInterventionsPatient(dataTypeIntervention[i].ID).success(function(data,status){

					$scope.typeIntervention[i] = {"infos" : {},"interventions" : {}};
					$scope.typeIntervention[i].infos = dataType;
					if(exist(data[0])){
						$scope.typeIntervention[i].interventions = {};
						// goes through the interventions of a certain type
						for (y = 0; y < data.length;y++){
							infoIntervention = {
								PLANNED_DATETIME : data[y].PLANNED_DATETIME,
								PLANNED_DATETIME_DISPLAY : data[y].PLANNED_DATETIME_DISPLAY,
								INFORMATION : data[y].INFORMATION,
								ACT_STATUS_CODE : data[y].ACT_STATUS_CODE,
								TITLE : data[y].TITLE,
								ID : data[y].ID
							};
							$scope.typeIntervention[i].interventions[y] = infoIntervention;
						}
						console.log($scope.typeIntervention[i]);

					}

					//console.log($scope);
				});
			}
		});
	};

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
