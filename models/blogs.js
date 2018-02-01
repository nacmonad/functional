var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	title: {
		type:String,
		require:true
	},
	author: {
		type:String,
		require:true
	},
	date : {
		type:Date,
		default: Date.now
	},
	content: {
		type:String,
		required:true
	},
	quote: {
		type:String,
		required:false
	},
	keywords: {
		type: Array,
		required:false
	},
	category: {
		type: String,
		required:false
	}
});

module.exports = mongoose.model('Blog', BlogSchema);