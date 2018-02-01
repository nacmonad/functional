app.controller('sidebarController', 
	function($scope, $rootScope, $element, $timeout, $location,MobileCheck) {
		
		//$scope.bool= MobileCheck.check();  //isclosed
		$scope.bool = false;
		$scope.toggleOffset = 180;
		$rootScope.keysEnabled = true;

		$scope.toggleMenu = function () {
			$scope.bool = $scope.bool == false ? true: false;
			$scope.toggleOffset = (1-$scope.bool) * 180;
			
			// USE DIRECTIVES TO CHANGE DOM ELEMENTS i.e ng-class ?? 
			$(".toggle").toggleClass("fa-chevron-left");
			$(".toggle").toggleClass("fa-chevron-right");
		}
		
		$scope.keyToggleEvent = function(e) {
			//console.log(e.keyCode);
			if($rootScope.keysEnabled) {
				if ($scope.bool == false && (e.keyCode == 65 || e.keyCode == 37)) { $scope.toggleMenu(); }
				if ($scope.bool == true && (e.keyCode == 68 || e.keyCode == 39)) { $scope.toggleMenu(); }
			}
		}

		$scope.toggleCollapse = function(){
			$timeout(function() {
				$("#submenu1toggle").toggleClass("fa-chevron-down");
				$("#submenu1toggle").toggleClass("fa-chevron-up");
			}, 200);			
		}	

		$scope.scrollTo = function (scrollLocation) {
	        $.smoothScroll({
	          scrollTarget: '#' + scrollLocation	
	        });
		}

	});