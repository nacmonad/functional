app.controller('myTestController', 
	function($scope, $rootScope) {
		//set conditional style
		$rootScope.homeActive = 0;
		console.log("test controller loaded -- i was  set by the $routeProvider and control the overall view");

		
		//local scope, this data could come from a service say
		$scope.friends = [
		{firstName:"Herb" ,lastName: "Derp", tweets: 2},
		{firstName:"Foo" ,lastName: "Bar", tweets:3},
		{firstName:"Silly" ,lastName: "Pants", tweets:1},
		{firstName:"Phil" ,lastName: "McKraken", tweets:0}];

		//

	});

