var app = angular.module('myApp', [
	'ngAnimate', 
	'ui.router',
	'uiRouterStyles',
	'ngSanitize',
	'TestDirectives',
	'ngResource']);

//front end routing configurations
app.config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider,$stateProvider){
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home', 
				templateUrl: 'partials/home2.html',  //serves to ng-view
				controller: 'myHomeController',
				data: {
					css: 'css/home.css'
				}
			})
			.state('blog', { 	
				url: '/blog',
				templateUrl: 'partials/blog.html',
				controller: 'myBlogController',
				data: {
					css: 'css/blog.css'
				}
			})
			.state('blog-detail', { 	
				url: '/blog/detail',
				templateUrl: 'partials/blog-detail.html',
				controller: 'myBlogDetailController',
				params: { data : null	},
				data: {
					css: 'css/blog.css'
				}
			})
			.state('test', { 	
				url: '/test',
				templateUrl: 'partials/test.html',
				controller: 'myTestController',
				data: {
					css: 'css/test.css'
				}
			})
			
	}]);




