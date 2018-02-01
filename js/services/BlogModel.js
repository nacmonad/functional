app.service('BlogModel', function(BlogService) {
	this.blogs = BlogService.query();
});