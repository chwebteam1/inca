
// ---------
// FACTORIES
// ---------

hug.factory('deletters',function($http){
	var factory = {};

	factory.deleteIntervention = function(idIntervention){
		console.log(idIntervention);
		var url = '/api/intervention?idAct=' + idIntervention;
		return $http.delete(url);
	};

	return factory;
});

hug.factory('posters',function($http){
	var factory = {};

	factory.addIntervention = function(Intervention,idPatient){
		var url = '/api/intervention/add/';
		var data = {'act' : Intervention,'idPatient' : idPatient};
		return $http.post(url,data);
	};

	factory.moveToHistoric = function(Intervention){
		var url = '/api/intervention/historic';
		var data = {'Intervention' : Intervention};
		return $http.post(url,data);
	};

	return factory;
});

hug.factory('getters',function($http){

	var factory = {};

	// -----------------------------------
	// password is currently not encrypted
	// -----------------------------------

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
		var url = '/api/beds?idBed1='+idBed1+'&&idBed2='+idBed2;
		return $http.get(url); // asynchronus request to server

	};
	factory.getPatient = function(idPatient){
		var url = '/api/patient?idPatient='+idPatient;
		return $http.get(url); // asynchronus request to server
	}
	factory.getPatients = function(idPatient1,idPatient2){
		// load patients
		var patients = {};

		var url = '/api/patients?idPatient1='+idPatient1+'&&idPatient2='+idPatient2;
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

	factory.getHistoric = function(){
		var url = '/api/intervention/historic';
		return $http.get(url);
	}

	return factory;
});