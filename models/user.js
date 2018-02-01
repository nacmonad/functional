var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
	id: ObjectId,
	date: {
		type: Date,
		default: Date.now
	},
	firstName: {
		type:String,
		unique:false,
		require:true
	},
	lastName: {
		type:String,
		unique:false,
		require:true
	},
	email: {
		type:String,
		unique:true,
		required:true
	},
	password: {
		type:String,
		required:true
	},
	type: {
		type: Number,
		required:false
	}
});

module.exports = mongoose.model('User', UserSchema);