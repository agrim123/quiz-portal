var express = require('express');
var router = express.Router();
var database = require('../app//models/database');
var index = require('../app/controllers/index_controller');
var users = require('../app/controllers/users_controller');
var admin = require('../app/controllers/admin_controller');
var sessions = require('../app/controllers/sessions_controller');
var pg = require('pg');

var dotenv = require('dotenv');
dotenv.load();

var multer  = require('multer')
var upload = multer({ dest: 'app/uploads/' });

function isloggedin(req,res,next){
	if(req.session.user)
		return next();
	res.redirect('/login');
}

function isadmin(req,res,next){
	if(req.session.user){
		database.select_one('select role from users where id=${id}',{id: req.session.user},function(result){
			if(result.role == 'admin'){
				return next();
			}else{
				res.redirect('/login');
			}
		});
	}else{
		res.redirect('/login');
	}
}

router.get('/', index.home);
router.get('/admin', isadmin, admin.home);
router.post('/admin', isadmin, upload.any('image'),admin.create_post);
router.post('/check', isloggedin, index.check);
router.get('/leaderboard', index.leaderboard);
router.get('/image/:name', index.serve_file);

router.get('/login', sessions.login);
router.post('/login', sessions.login_user);
router.get('/logout', sessions.logout);
router.get('/signup', sessions.signup);
router.post('/signup', users.create);

router.post('/start_quiz', isadmin, admin.quiz_status);
router.post('/end_quiz', isadmin, admin.quiz_status);

module.exports = router;