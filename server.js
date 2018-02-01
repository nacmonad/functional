#!/bin/env node

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	request = require('request'),
	nunjucks = require('nunjucks'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    csrf = require('csurf'),
    sessions = require('client-sessions'),
    cookieParser = require('cookie-parser'),
    //mongodb = require('mongodb'),
    User = require('./models/user'),
    Blog = require('./models/blogs'),
    Comment = require('./models/comment'),
    assert = require('assert'),
    moment = require('moment-timezone');

//environment vars

app.set('port', 3000);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.set('view engine', 'html');

/*  Configure nunjucks to work with express */
var env = nunjucks.configure(__dirname, {
    autoescape: true,
    express: app,
    tags: {
    blockStart: '{%',
    blockEnd: '%}',
    variableStart: '{$',
    variableEnd: '$}',
    commentStart: '{#',
    commentEnd: '#}'
  }
});

var nunjucksDate = require('nunjucks-date');
nunjucksDate.setDefaultFormat('MMMM Do YYYY, h:mm:ss a');
env.addFilter("date", nunjucksDate);

// Set Nunjucks as rendering engine for pages with .html suffix
app.engine( 'html', nunjucks.render ) ;
app.set( 'view engine', 'html' ) ;
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session middleware
app.use(sessions({ //hide this doc in a different file!
	cookieName: 'session',
	secret: '1h2k3la9dfk9djskjdf90bne22jk',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true, // don't let browser js access cookies
	secure: true, // only use cookies over https
	ephemeral:true, // dlete cookie when browser is closed
}));

app.use(cookieParser('secret'));

//CORS enabled
// app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
// });

app.use(function(req,res,next){
	if( req.session && req.session.user) {
		User.findOne({email:req.session.user.email}, function(err,user){
			if(user){
				req.user = user;
				delete req.user.password;  //delete pw in memory as soon as used
				req.session.user = user;
				res.locals.user = user;
			}
			next();
		})
	} else {
		next();
	}
});

app.use(csrf());
app.use(function (req, res, next) {
    res.cookie("XSRF-TOKEN",req.csrfToken());
    next();
});

function requireLogin(req,res,next) {
	if(!req.user){
		res.redirect('/auth/login');
	} else {
		next();
	}
}

function requireLoginAPI(req,res,next) {
	if(!req.user){
		res.send('Login required for this API access. ');
	} else {
		next();
	}
}
//connect to db

var connectionUrl = "mongodb://nacmonad:Herb_Derp_420@cluster0-shard-00-00-zupkx.mongodb.net:27017,cluster0-shard-00-01-zupkx.mongodb.net:27017,cluster0-shard-00-02-zupkx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
mongoose.connect(connectionUrl);

//API Express Setup
var apiRoutes = express.Router();   // this doesn't work in openshift
app.use('/api', apiRoutes);

//AUTH Express Setup
var authRoutes = express.Router();
app.use('/auth', authRoutes);

//AUTH Routes
authRoutes.get('/', function (req,res) {
		res.render(__dirname+'/partials/crudindex.html');
	});

authRoutes.get('/register', function (req,res) {
		res.render(__dirname+'/partials/crudregister.html', { csrfToken: req.csrfToken()});
	});

authRoutes.get('/login', function (req,res) {
		res.render(__dirname+'/partials/crudlogin.html', { csrfToken: req.csrfToken()});
	});
authRoutes.get('/dashboard', requireLogin, function (req,res) {
		res.render(__dirname+'/partials/cruddashboard.html', { csrfToken: req.csrfToken()});
	});

authRoutes.post('/login', function(req,res){
		console.log(req.body);
	User.findOne({ email:req.body.email }, function(err,user) {
		if (!user) {
			res.render(__dirname+'/partials/crudlogin.html', {error:"Invalid email or password.", csrfToken: req.csrfToken()});
		} else
		{
			if (bcrypt.compareSync(req.body.password, user.password)) {
				req.session.user = user;  // set-cookie
				res.redirect('/auth/dashboard');
			} else
			{
				res.render(__dirname+'/partials/crudlogin.html', {error:"Invalid email or password.", csrfToken: req.csrfToken()});
			}
		}
	})

});

authRoutes.post('/register', function(req,res){
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	//res.json(req.body);

	var newUser = new User({
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		email : req.body.email,
		password : hash
	});

	newUser.save(function (err,user){
		if (err) {
			var err= "herb derp something bad happened, try again";
			if (err.code === 11000){
				err = "sorry that email is already taken";
			}
			res.render(__dirname+'/partials/crudregister.html', { error: err, csrfToken: req.csrfToken()} );
		}
		else {
				res.redirect('/auth/dashboard');
			}
	});
});

authRoutes.get('/logout', function(req,res){
		req.session.reset();
		res.redirect('/auth/');
	});



//API CRUD ROUTES
//BLOGS ENDPOINTS
apiRoutes.get("/blogs", function (req,res) {
		Blog
			.find({})
			//.skip(req.headers.skip ? parseInt(req.headers.skip) :  0)
			//.limit(req.headers.limit ? parseInt(req.headers.limit) : 5)
			.sort({ date:-1 })
			.exec(function (err,blogs) {
				if (err) throw err;
				if (!blogs) {
					return res.status(403).send({success:false, msg:'No blog found.'});
				}
				else {
					res.json(blogs);
					}
				});
	});

apiRoutes.post("/blogs", requireLoginAPI, function (req,res) {
		var newpost = new Blog(req.body);
		console.log(newpost);
		newpost.save(function (err,blog) {
			if (err) console.log(err);
			if (!blog) {
				res.status(403).send({success:false, msg:'There was an error posting the blog'});
			}
			else {
				res.json(blog);
			}
		});
	});

apiRoutes.put("/blogs/:id", requireLoginAPI, function (req,res) {
		Blog.findOneAndUpdate({_id:req.params.id}, req.body, function (err, blog) {
		  if (err) {console.log(err);}
		  if (!blog) {
		  	return res.status(403).send({success:false, msg:'Couldn\'t edit blog with id'})
		  }
		  else {
		  		res.json(blog);
		  }

		});

	});

apiRoutes.delete("/blogs/:id", requireLoginAPI, function (req,res) {
		Blog
			.remove({"_id": req.params.id})
			.exec(function (err,blog) {
				if (err) {console.log(err)};
				if (!blog) {
					return res.status(403).send({success:false, msg:'No blog found with ID'});
				}
				else {
					res.json(blog);
					}
				});
	});

apiRoutes.get("/blogs/:id", function (req,res) {
		Blog
			.findOne({"_id": req.params.id})
			.exec(function (err,blogs) {
				if (err) {console.log(err)};
				if (!blogs) {
					return res.status(403).send({success:false, msg:'No blog found with ID'});
				}
				else {
					res.json(blogs);
					}
				});
	});
//get blog by author
apiRoutes.get("/blogs/authors/:name", function (req,res) {
		Blog
			.find({"author": req.params.name})
			.exec(function (err,blogs) {
				if (err) {console.log(err)};
				if (!blogs) {
					return res.status(403).send({success:false, msg:'No blogs found by author.'});
				}
				else {
					res.json(blogs);
					}
				});
	});

//COMMENTS END POINTS

apiRoutes.get("/comments", function (req,res) {
		Comment
			.find({})
			//.skip(req.headers.skip ? parseInt(req.headers.skip) :  0)
			//.limit(req.headers.limit ? parseInt(req.headers.limit) : 5)
			.sort({ date:-1 })
			.exec(function (err,comments) {
				if (err) throw err;
				if (!comments) {
					return res.status(403).send({success:false, msg:'No comments found.'});
				}
				else {
					res.json(comments);
					}
				});
	});
apiRoutes.get("/comments/:id", function (req,res) {
		Comment
			.find({"_id":req.params.id})
			//.skip(req.headers.skip ? parseInt(req.headers.skip) :  0)
			//.limit(req.headers.limit ? parseInt(req.headers.limit) : 5)
			.sort({ date:-1 })
			.exec(function (err,comments) {
				if (err) throw err;
				if (!comments) {
					return res.status(403).send({success:false, msg:'No comment found by that id.'});
				}
				else {
					res.json(comments);
					}
				});
	});
apiRoutes.get("/blogs/comments/:id", function (req,res) {
		Comment
			.find({"discussion_id":req.params.id})
			.sort({ date:-1 })
			.exec(function (err,comments) {
				if (err) throw err;
				if (!comments) {
					return res.status(403).send({success:false, msg:'Problem retrieving comments for that discussion.'});
				}
				else {
					res.json(comments);
					}
				});
		});
apiRoutes.delete("/comments/:id", requireLoginAPI, function (req,res) {
		Comment
			.remove({"_id": req.params.id})
			.exec(function (err,comment) {
				if (err) {console.log(err)};
				if (!comment) {
					return res.status(403).send({success:false, msg:'No comment found with ID'});
				}
				else {
					res.json(comment);
					}
				});
	});

apiRoutes.post("/comments", function (req,res) {
		var newpost = new Comment(req.body);
		console.log(newpost);
		newpost.save(function (err,comment) {
			if (err) console.log(err);
			if (!comment) {
				res.status(403).send({success:false, msg:'There was an error posting the comment'});
			}
			else {
				res.json(comment);
			}
		});
	});

//my google
apiRoutes.get("/scripts/:id", function(req,res) {
	res.send(
	'document.getElementsByClassName("tv-dialog__overlay")[0].style.zIndex ="-111";' +
	'document.getElementsByClassName("tv-dialog__modal-wrap")[0].style.zIndex ="-111"'
	);
});

//moment.timezone fun
apiRoutes.get('/time', function (req,res) {
	res.json(moment().tz("Europe/London").format('HH:mm:ss'));
});

app.get('/barsrgb', function(req, res) {
	res.sendFile(__dirname+'/barsrgb.html');
})


//LISTEN
app.listen(app.get('port'),  function() {
	console.log('Server instantiated at ' + Date.now());
    console.log('Listening on port '+ app.get('port'));
});
