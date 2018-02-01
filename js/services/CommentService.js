app.factory('CommentService', function($resource) {
	//var resourceURL = 'http://functional-aesthetics.rhcloud.com/api/comments/:id';
	var resourceURL = 'http://ec2-13-58-24-227.us-east-2.compute.amazonaws.com/api/comments/:id';
	return $resource(resourceURL,
		{ id: '@_id'},
		{
			'get':    {method:'GET',isArray:true},
			'update' : {method:'PUT'}
		});
});
