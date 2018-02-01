app.controller('myHomeController', 
	function($rootScope,$scope, MobileCheck) {
		//switch ng-style
		$rootScope.homeActive = 1;
		//console.log("home controller says mobile: " + MobileCheck.check());
});