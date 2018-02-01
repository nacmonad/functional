var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
	discussion_id: {
		type:ObjectId,
		require:true
	},
	author: { type:String, default: "anonymous" },
	posted : {
		type:Date,
		default: Date.now
	},
	comment: {
		type:String,
		required:true
	},
	slug: {
		type:String
	}
});

module.exports = mongoose.model('Comment', CommentSchema);