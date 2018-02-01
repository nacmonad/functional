app.directive('lazyScript', function($compile) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope,element,attrs) {
			scope.inFunc = function(){
				console.log("bang inFunc!");
				MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});

			  };

			//var domElem = '<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML" async defer></script>';

			//$(element).append($compile(domElem)(scope));


		
		
		},
	}
});