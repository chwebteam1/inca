// -----------
// controllers
// -----------

var controllers = {}; // will contain all the controller needed for the module
controllers.ConnexionController = ConnexionController;
controllers.UnitesController = UnitesController;
controllers.popUpIntervention = popUpIntervention;
controllers.RoomsController = RoomsController;
controllers.DialogController = DialogController;
controllers.AddInterventionController = AddInterventionController;
controllers.InterventionsPatientController = InterventionsPatientController;
controllers.HistoricController = HistoricController;
controllers.DeconnexionController = DeconnexionController;
controllers.sideNav = sideNav;
controllers.LeftController = LeftController;
controllers.RightController = RightController;


// ----------------------------------------------
// binding functions to their factory/controllers
// ----------------------------------------------

// -------
// getters
// -------

hug.controller('getters', controllers.ConnexionController);
hug.controller('getters', controllers.UnitesController);
hug.controller('getters', controllers.RoomsController);
hug.controller('getters', controllers.DialogController);
hug.controller('getters', controllers.getters);
hug.controller('getters', controllers.HistoricController);

// -------
// posters
// -------

hug.controller('posters', controllers.AddInterventionController);
hug.controller('posters', controllers.DialogController);
hug.controller('posters', controllers.posters);

// ---------
// deletters
// ---------

hug.controller('deletters', controllers.DialogController);
hug.controller('deletters', controllers.deletters);


// -------
// general
// -------

hug.controller('DeconnexionController',controllers,DeconnexionController);
hug.controller('popUpIntervention',controllers.popUpIntervention);

// -------------------
// esthétique side nav
// -------------------

hug.controller('sideNav', controllers.sideNav);
hug.controller('LeftController', controllers.LeftController);
hug.controller('RightController', controllers.RightController);



// -------------
// POPUP HANDLER
// -------------

function popUpIntervention($scope, $mdDialog) {
	$scope.alert = '';
	$scope.showAdvanced = function(ev,idActGroup, posActGroup) {

		$mdDialog.show({
			controller: DialogController,
			templateUrl: '../views/listInterventions.tmpl.html',
			targetEvent: ev,
			locals : {'actGroupID' : idActGroup, 'intervention' : $scope.interventions[posActGroup]}
		})
		.then(function(answer) {
			$scope.alert = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.alert = 'You cancelled the dialog.';
		});
	};
};

function DialogController($scope, $mdDialog,getters, actGroupID,intervention,deletters,posters) {

	// let's retrieve all the interventions corresponding to the actGroupID
	getters.getInterventionsPatient(actGroupID).success(function(data,status){

		if(exist(data[0])){
			console.log(data);
			$scope.listInterventions = data;
		}else{
			$scope.listInterventions = {0 : intervention};
			console.log($scope.listInterventions);
		}
	});


	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		console.log(answer);
		if(answer.action == 0){ // move the intervention to the historic

			$scope.listInterventions[answer.index].ACT_STATUS_CODE = "completedToValid"; // act completed but not transferred to server yet
			var data = $scope.listInterventions[answer.index];
			console.log(data);
			posters.moveToHistoric(data);

		}else if(answer.action == 1){ // delete the intervention
			deletters.deleteIntervention(answer.id);// we just ahve to send the id of the act to be deleted
			//InterventionsPatientController();
		}
		$mdDialog.hide(answer);
	};

}


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
		if ($scope.username != '' && $scope.password != '') {

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

		// security test - no room no unit
		if (data == null){
			$scope.rooms[0] = {nomRoom : noRoomError};
			$scope.uniteID = idUnit;
		}else{
			// all the rooms in the unit (alwys 2 beds in one room)
			for (var room in data.rooms){

				// retrieves the infos of the beds in the room
				getters.getBeds(data.rooms[room].idBed1,data.rooms[room].idBed2).success(function(databeds,status){

					// security tests - no bed no room
					if(databeds == null){
						$scope.rooms[0] = {nomRoom : data.rooms[room].LABEL, patient1 : noBedError, patient2 : noBedError};
						$scope.uniteID = idUnit;
					}else{

						var idPatient1 = databeds.beds[0].idPatient;
						var idPatient2 = databeds.beds[1].idPatient;

						if(idPatient1 == '' && idPatient2 == ''){
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
	var compteur = 0;
	var i = 0;
	var y = 0;
	var infoIntervention = {};
	var dataType = {};

	if(exist($routeParams.Idpatient)){
		var Idpatient = $routeParams.Idpatient;
		var IdUnite   = $routeParams.IdUnite;
		isOk = true; // we have all the variables we need
	}

	$scope.idPatient = Idpatient;

	if(!isOk)
		window.location="#/unites";

	/* initialization done - treatment starts */


	var handleSuccessTypeIntervention = function(dataTypeIntervention,status){

		$scope.interventions = {};

		// goes through the list of type of interventions for a patient
		console.log(dataTypeIntervention);
		$scope.interventions = dataTypeIntervention;

	};

	var handleSuccess = function(data, status) {

		$scope.patient = data;
		$scope.unite = IdUnite;
		// retrieve list of types of interventions that applies to that patient
		var data = getters.getTypeInterventionsPatient(Idpatient).success(handleSuccessTypeIntervention);
	};

	getters.getPatient(Idpatient).success(handleSuccess);
}



function HistoricController($scope,$http,$routeParams,getters){
	var isOk = false;

	if(exist($routeParams.idPatient) && exist($routeParams.idUnite)){
		var idPatient = $routeParams.idPatient;
		var idUnite   = $routeParams.idUnite;
		isOk = true;
	}

	if(!isOk)
		window.location="#/unites";

	var handleSuccess = function(data, status) {
		$scope.historic = data;
	};

	$scope.patient = {'ID' : '','idUnite' : ''};
	$scope.patient.ID = idPatient;
	$scope.patient.idUnite = idUnite;
	getters.getHistoric().success(handleSuccess);
}



function AddInterventionController($scope, $http,$routeParams, posters) {
	var isOk = false;

	$scope.submit = function() {

		var time = $scope.intervention.time_display;
		var date = $scope.intervention.date;


		if(time.length == 5) // only if there's 5 digits ('hh:mm')
			time += ":00"; // forge the seconds as it's not relevant but mandatory

		$scope.intervention.time_display = time;


		// checks if time respects pattern hh:mm:ss
		var patt = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/;
		if(time.match(patt)){
			patt = /^\d{4}-\d{1,2}-\d{1,2}$/; // yyyy:mm:dd
			if(date.match(patt))
				posters.addIntervention($scope.intervention, $scope.patient.ID);
			else
				console.log("date pattern doesn't match");
		}else
			console.log("time pattern doesn't match");

	}

	if(exist($routeParams.Idpatient)){
		var Idpatient = $routeParams.Idpatient;
		var IdUnite   = $routeParams.IdUnite;
		isOk = true; // we have all the variables we need
	}

	$scope.patient = {'ID' : '','idUnite' : ''};
	$scope.patient.ID = Idpatient;
	$scope.patient.idUnite = IdUnite;

	if(!isOk)
		window.location="#/unites";
}
