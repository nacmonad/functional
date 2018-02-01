//$timeout patch fixes the scrollable attribute when applied to angular rendered elements such as my blog posts
app.directive('mySplashScroll', function() {
	return {
		restrict: 'E',
		scope: '&',
		templateUrl: '/js/directives/myScrollable.html',
		controller: ['$rootScope','$scope','$document','$window','$timeout', function ($rootScope, $scope, $document, $window, $timeout) {
			
			$scope.rows = [];
			$timeout(function() {
				$scope.rowElems = angular.element($("[my-scrollable]"));
				// these three lines are weak, is there a better way to do this?
				for(var i = 0; i < $scope.rowElems.length;i++) {
					$scope.rows.push($scope.rowElems[i].id);
				}

				$scope.activeRow = $scope.rowElems[0].id;

				$scope.$on('row-active', function (event, args) {
						$scope.activeRow = args.row_id;
					});


				//$window.scrollY doesn't exist for IE, use pageYOffset
				angular.element($window).bind("scroll", function() {
					$rootScope.$broadcast('scroll-event', { scrollY:$window.pageYOffset });
				});
			
			}, 500);		
		}],
		link: function(scope,element,attrs) {
			scope.up = function () {
				if ( (scope.rows.indexOf(scope.activeRow)-1) < 0 ) { 
					scope.scrollToTop();
				}
				else { 
						scope.scrollTo(scope.rows[(scope.rows.indexOf(scope.activeRow)-1)]);
					}
			};
			scope.down = function () {
				if ((scope.rows.indexOf(scope.activeRow)+1) > scope.rows.length-1 ) { console.log ("I canna go down any further!");}
				else 
					{
				 		scope.scrollTo(scope.rows[(scope.rows.indexOf(scope.activeRow)+1)]);
					}
			};
			scope.scrollTo = function (scrollLocation) {
		        $.smoothScroll({
		          scrollTarget: '#' + scrollLocation,   
		          offset: 1	
		        });
			};
			scope.scrollToTop = function () {
				$.smoothScroll({
					scrollTarget: $('html, body').firstScrollable()
				});
			};
		}
	}
})

.directive('myScrollable', function($window, $timeout) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope,element,attrs) {
			$timeout(function () {
			scope.top = element[0].getBoundingClientRect().top;  
			scope.bottom = element[0].getBoundingClientRect().bottom;
				scope.$on('scroll-event', function (event, args) {		
					if( args.scrollY < (scope.bottom ) && args.scrollY > scope.top ) {
						scope.$emit('row-active', { row_id : element[0].id});
					}				
	 			});
			},500);
		
		
		}
	}
});