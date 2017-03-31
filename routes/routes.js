var express = require('express');
var router = express.Router();
var database = require('../app//models/database');
var index = require('../app/controllers/index_controller');
var users = require('../app/controllers/users_controller');
var admin = require('../app/controllers/admin_controller');
var sessions = require('../app/controllers/sessions_controller');
var isLoggedIn = require('../app/middlewares/login_middleware');
var isAdmin = require('../app/middlewares/admin_middleware');
var pg = require('pg');

var dotenv = require('dotenv');
dotenv.load();

var multer  = require('multer')
var upload = multer({ dest: 'app/uploads/' });

router.get('/', index.home);
router.get('/admin', isAdmin, admin.home);
router.get('/answers', isAdmin, admin.answers);
router.post('/admin', isAdmin, upload.any('image'),admin.create_post);
router.post('/check', isLoggedIn, index.check);
router.get('/leaderboard', index.leaderboard);
router.get('/image/:name', index.serve_file);

router.get('/login', sessions.login);
router.post('/login', sessions.login_user);
router.get('/logout', sessions.logout);
router.get('/signup', sessions.signup);
router.post('/signup', users.create);

router.get('/rules', index.rules);

router.post('/start_quiz', isAdmin, admin.quiz_status);
router.post('/end_quiz', isAdmin, admin.quiz_status);

module.exports = router;