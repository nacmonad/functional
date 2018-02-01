app.service('CommentModel', function(CommentService) {
	this.comments = [];
	this.getComments = function() {
		this.comments = CommentService.query();
	}
});