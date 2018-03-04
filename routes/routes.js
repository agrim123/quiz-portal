var express = require('express');
var router = express.Router();
var pg = require('pg');
var dotenv = require('dotenv');


var index = require('../app/controllers/index_controller');
var users = require('../app/controllers/users_controller');
var admin = require('../app/controllers/admin_controller');
var sessions = require('../app/controllers/sessions_controller');
var isAdmin  = require('../app/middleware/admin_middleware')

dotenv.load();

// var cloudinary = require('cloudinary');
// var multer  = require('multer')

// cloudinary.config({ 
// 	cloud_name: process.env.CLOUD_NAME, 
// 	api_key: process.env.API_KEY, 
// 	api_secret: process.env.API_SECRET 
// });

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
/*
router.get('/',index.temp);*/
/*router.get('/',index.home);*/
router.get('/quiz' ,index.quiz);
// router.get('/sangram_iitr_admin_panel_2017_yo',admin.home);
router.get('/',index.home);
router.get('/login',sessions.login);
router.get('/image/:name', index.serve_file)
router.post('/check', index.check);
router.get('/oth', index.oth);
router.post('/login',sessions.login_user);
router.get('/quiz' ,index.quiz);
// router.get('/sangram_iitr_admin_panel_2017_yo',admin.home);
router.get('/logout',sessions.logout);
router.get('/leaderboard',index.leaderboard);


/*router.post('/admin', upload.single('image'),admin.create_post);*/

// TODO: Add isAdmin middleware
router.get('/admin/dashboard', isAdmin, admin.home);
router.post('/admin/dashboard', isAdmin, upload.single('image'),admin.create_post);
router.post('/start_quiz', isAdmin, admin.quiz_status)
router.post('/end_quiz', isAdmin, admin.quiz_status)


/*router.post('/admin',admin.create_post);*/
module.exports = router;