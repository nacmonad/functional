app.controller('myBlogDetailController',
	function($rootScope, $scope, $compile, $stateParams, $http, CommentService, CommentModel) {
		$scope.data = $stateParams.data;
		$scope.showText = false;
		//switch the ng-style
		$rootScope.homeActive = 0;
		$scope.author = "Anonymous"
		$scope.comment = "";
		$scope.postObject = {};

		//lazy injection of resource... only works on initial load for some reason tho :/
		var domElem = '<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML" async defer></script>';
		angular.element('.content-wrapper').append($compile(domElem)($scope));
		console.log($scope.data._id);

		$scope.showTextArea = function () {
			if($scope.showText) {
				$scope.showText=false;
				angular.element('#textarea-toggler').removeClass('glyphicon-minus').addClass('glyphicon-plus');
			}
			else {
				$scope.showText=true;
				angular.element('#textarea-toggler').removeClass('glyphicon-plus').addClass('glyphicon-minus');
			}


		}
		$scope.focused = function () {
			$rootScope.keysEnabled = false;
		}
		$scope.blurred = function () {
			$rootScope.keysEnabled = true;
		}
		$scope.post = function () {
			$scope.postObject.discussion_id = $scope.data._id;
			$scope.postObject.author = $scope.author;
			$scope.postObject.comment = $scope.comment;
			console.log($scope.postObject);
			$http({
			        //url: 'http://functional-aesthetics.rhcloud.com/api/comments',
			        url: 'http://ec2-18-217-222-38.us-east-2.compute.amazonaws.com/api/comments',
			        method: "POST",
			        data: $scope.postObject,
			        //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			    })
			    .then(function(response) {
			            // success
			            console.log("success!");
			            console.log(response);
			            $scope.getComments();
			            $scope.showTextArea();
			        },
			        function(err) { // optional
			            // failed
			            console.log("err");
			            console.log(err);
			        }
			    );
		}
		$scope.getComments = function () {
			$http({
			        //url: 'http://functional-aesthetics.rhcloud.com/api/blogs/comments/' + $scope.data._id,
			        url: 'http://ec2-18-217-222-38.us-east-2.compute.amazonaws.com/api/blogs/comments/' + $scope.data._id,
			        method: "GET"
			        //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			    })
			    .then(function(response) {
			            // success
			            console.log("success!");
			            console.log(response.data);
			            $scope.comments = response.data;

			        },
			        function(err) { // optional
			            // failed
			            console.log("err");
			            console.log(err);
			        }
			    );
		}
		$scope.getComments();
});
