app.factory('BlogService', function($resource) {
	//var resourceURL = 'http://functional-aesthetics.rhcloud.com/api/blogs/:id';
	var resourceURL = 'http://ec2-13-58-24-227.us-east-2.compute.amazonaws.com/api/blogs/:id';
	return $resource(resourceURL,
		{ id: '@_id'},
		{
			'update' : {method:'PUT'}
		});
});
