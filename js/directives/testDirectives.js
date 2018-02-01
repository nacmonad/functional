
var testDirectives = angular.module('TestDirectives', ['ngAnimate'])
testDirectives.directive('contactCard', function() {
	//the return object is the directive!
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		templateUrl: "/partials/directives/contactCard.html",
		link: function(scope, element, attrs) {
				//element.click(function() {
				//	element.css('background', 'pink');
				//	console.log(element);
				//})
			}, 
		controller: ['$scope','$element','$attrs', function ($scope, $element, $attrs) {
			$scope.isVisible=false;
			$scope.buttonMsg='Show';
			console.log("contact directive controller loaded");
			console.log($scope.data);

			$scope.toggleVisible= function() {
				if ($scope.isVisible) {
					$scope.isVisible = false;
					$scope.buttonMsg = 'Show';
				}
				else {
					$scope.isVisible = true;
					$scope.buttonMsg = "Hide";
				}
					
			
			}

		}]
	};
})

.directive('selectAllOnFocus', function() {
	return {
		restrict: 'A',
		link: function(scope,element) {
			element.mouseup(function (event) {
				event.preventDefault();
			});
			element.focus(function() {
				
				element.select();
			});
		}
	}
})
.directive('myHiLite', function() {
	return {
		restrict: 'A',
		link: function(scope,element) {
			scope.bool = false;
			element.mouseup(function (event) {
				event.preventDefault();
				scope.bool ? scope.bool = false : scope.bool = true;
				scope.bool ? element.css('background','pink') : element.css('background','white');
			});
			
		}
	}
})
.directive('mySocialButtons', function() {
	return {
		restrict: 'E',
		templateUrl: '/partials/directives/socialButtons.html'
			
		}
})
