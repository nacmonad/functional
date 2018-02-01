app.controller('myBlogController',
	function($rootScope, $scope, $http, $compile, BlogService, BlogModel, CommentService, CommentModel) {
		var domElem = '<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML" async defer></script>';
			angular.element('.content-wrapper').append($compile(domElem)($scope));

		//switch the ng-style
		$rootScope.homeActive = 0;
		$scope.regex = /(<([^>]+)>)/ig;  //strips < > tags
		CommentModel.getComments();

		$scope.getBlogs = function(callback) {
			$http.get('api/blogs')
			    .then(function(data, status, headers, config) {
			      $scope.blogs = data.data;
			      console.log(data)
			      //strip html tags and create previews
					Array.from($scope.blogs).forEach((e,i)=>{
						$scope.blogs[i].preview = e.content.replace($scope.regex, " ").replace(/\s\s+/g, ' ');
					});
					callback();
			    })
		 	    .catch(function(err) {
			      console.log(err);
			    });

			};

	  	$scope.getThumbnails = function () {
	  		var img_regex = /<img[^>]+src="([^">]+)"/;
	  		var matches = [];

			if($scope.blogs) {
				Array.from($scope.blogs).forEach((e,i)=> {
					matches = e.content.match(img_regex);
					if(matches) { $scope.blogs[i].thumbnailUrl = matches[1];}
				});
			}

			};

		$scope.getBlogs(function(){$scope.getThumbnails()});

		$scope.getCommentCount = function(id, index) {
			var count = 0;
			Array.from(CommentModel.comments).forEach((e,i) => {
				if (e.discussion_id == id) {
					count++;
				}
			console.log($scope)
			console.log("Index : " + index);
			$scope.blogs.data[index].commentCount = count;
			});

		}

		$scope.scrollUp = function () {
			$scope.scrollLevel >= 1 ? ( $scope.scrollLevel--, $scope.scrollTo($scope.rows[$scope.scrollLevel]) ) : console.log("can't scroll up no mo");

		}
		$scope.scrollDown = function () {
			$scope.scrollLevel <= $scope.rows.length-2 ? ($scope.scrollLevel++, $scope.scrollTo($scope.rows[$scope.scrollLevel]) ) : console.log("can't scroll down yo");

		}

		$scope.scrollTo = function (scrollLocation) {
			//$location.hash(scrollLocation);
			//$anchorScroll(scrollLocation);
	        $.smoothScroll({
	          scrollTarget: '#' + scrollLocation
	        });
		}

		$scope.findThumbNails = function (scollLocation) {

		}
});
