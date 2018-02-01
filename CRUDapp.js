var app = angular.module('CRUDApp',['ngResource','ui.bootstrap','ngSanitize','textAngular']);

//TODO $rootScope.blogs, then do away with the refreshes!
//instead of refresh(), push the new blog to the $rootScope
//limit the amount of server calls

app.controller('mainController', 
	function($rootScope, $scope, $http, BlogService, CommentService, MobileCheck, $uibModal, $log) {
		$scope.regex = /(<([^>]+)>)/ig;
		$scope.user;
		console.log(MobileCheck.check());
		$rootScope.refresh = function() {
			console.log("i am refreshing derp");
			$scope.blogs = BlogService.query();
			$scope.comments = CommentService.query();
			};
		$rootScope.refresh();

		//instead of performing an entire query, just refresh single element  after edit
		$rootScope.refreshBlog = function(index) {
			console.log("i am refreshing blog " + index);
			$scope.blogs[index] = BlogService.get({id: $scope.blogs[index]._id} , 
			function (data) {} ,
			function (e) {
				//err
				console.log(e);
			});

			};
		
		$scope.deleteBlog = function (index) {
			BlogService.delete({id:$scope.blogs[index]._id}, 
				function (successResult){
					console.log("blog " + index + " successfully deleted");
					//$rootScope.refresh();  //do this or splice the existing array w/o a call?  
					$scope.blogs.splice(index,1);
				}, function (errorResult) {
					console.log(errorResult);
				});
			
		}

		$scope.edit =  function (index) {

			//how to call refresh on a single blog?  $scope.blogs[index] ?
		    var modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: '/partials/editBlogForm.html',
		      controller: 'BlogEditInstance',
		      resolve: {
		      	param: function () {
		      		return {'blog' : BlogService.get({id: $scope.blogs[index]._id}),
		      				'index' : index};
		      			} 
		      		}
		      });

		  };

		$scope.editComment = function (index) {
			console.log($scope.comments[index]);

			var modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: '/partials/editCommentForm.html',
		      controller: 'CommentEditInstance',
		      resolve: {
		      	param: function () {
		      		return {'comment' : $scope.comments[index],
		      				'index' : index};
		      			} 
		      		}
		      });
		}
		$scope.deleteComment = function(index) {
			CommentService.delete({id:$scope.comments[index]._id}, 
				function (successResult){
					console.log("comment " + index + " successfully deleted");
					//$rootScope.refresh();  //do this or splice the existing array w/o a call?  
					$scope.comments.splice(index,1);
				}, function (errorResult) {
					console.log(errorResult);
				});
		}
		 $scope.createBlog =  function () {
		    var modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: '/partials/addBlogForm.html',
		      controller: 'BlogAddInstance'
		      });
		  };



	$scope.toggleAnimation = function () {
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		  };
	$rootScope.refresh();

	$scope.userTypeCheck = function (type) {
		//console.log(type)
		return type == 420 ? true : false;
	}
});
	

	app.controller('BlogEditInstance', function ($rootScope, $scope, $uibModalInstance,param, BlogService) {
	
	$scope.blog = param.blog;
	//this is because of MongoError v2.4: Mod on _id not allowed 
	// $scope.blog = {
	// 	title: param.blog.title,
	// 	author: param.blog.author,
	// 	content: param.blog.content,
	// 	quote: param.blog.quote,
	// 	keywords: param.blog.keywords,
	// 	category: param.blog.category
	// };
	$scope.newKeyword;

	$scope.ok = function () {
	    $uibModalInstance.close(
		    BlogService.update( {id:$scope.blog._id}, $scope.blog, 
		    	function(successResult) {
				    //$rootScope.refreshComment(param.index);
				    $rootScope.refresh();
				    console.log("comment successfully edited");
				    }, 
				function(errorResult) {
				    console.log(errorResult);
				 }));
	}

	$scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };

	});

	app.controller('CommentEditInstance', function ($rootScope, $scope, $uibModalInstance,param, CommentService) {
	
	$scope.comment = param.comment;
	//this is because of MongoError v2.4: Mod on _id not allowed 
	// $scope.blog = {
	// 	title: param.blog.title,
	// 	author: param.blog.author,
	// 	content: param.blog.content,
	// 	quote: param.blog.quote,
	// 	keywords: param.blog.keywords,
	// 	category: param.blog.category
	// };
	console.log($scope.comment)

	$scope.ok = function () {
	    $uibModalInstance.close(
		    CommentService.update( {id:$scope.comment._id}, $scope.comment, 
		    	function(successResult) {
				    $rootScope.refreshBlog(param.index);
				    console.log("comment successfully edited");
				    }, 
				function(errorResult) {
				    console.log(errorResult);
				 }));
	}

	$scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };



	});
	app.controller('BlogAddInstance', function ($rootScope, $scope, $uibModalInstance, BlogService) {
	
	$scope.newKeyword;
	$scope.blog = {
		title:'',
		author:'',
		content:'',
		quote:'',
		keywords: [],
		category: ''
	};
	$scope.ok = function () {
	    $uibModalInstance.close(
	    	BlogService.save($scope.blog, 
    		function (successResult) {
    			console.log(successResult);
    			console.log("blog successfully added");
    			$rootScope.refresh();  
    			//expensive call, is neccessary ?  
    			//how to simply push onto local array of blogs?
    			//make a $rootScope.blogs???
    		}, 
    		function (errorResult){
    			console.log(errorResult);
	    		console.log("Blogs must have a title, author and content.");
	    	}));
	  };

	$scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };

	$scope.pushKeyword = function() {
	  	$scope.blog.keywords.push($scope.newKeyword);
	  }
	$scope.removeKeyword =function(index) {
	  	$scope.blog.keywords.splice(index,1);
	  }


	});
