var express = require('express');
var router = express.Router();
var index = require('../app/controllers/index_controller');
var users = require('../app/controllers/users_controller');
var admin = require('../app/controllers/admin_controller');
var sessions = require('../app/controllers/sessions_controller');
var pg = require('pg');
var dotenv = require('dotenv');
dotenv.load();
var cloudinary = require('cloudinary');
var multer  = require('multer')
var upload = multer({ dest: 'app/uploads/' });
cloudinary.config({ 
	cloud_name: process.env.CLOUD_NAME, 
	api_key: process.env.API_KEY, 
	api_secret: process.env.API_SECRET 
});
router.get('/',index.home);
router.get('/quiz',index.quiz);
router.get('/admin',admin.home);
/*router.get('/login',sessions.login);*/
router.post('/login',sessions.login_user);
router.get('/logout',sessions.logout);
router.post('/check',index.check);
router.get('/leaderboard',index.leaderboard);
//enable if and only if forgot password otherwise it is a potential backdoor in the site
/*router.get('/signup',sessions.signup);
router.post('/signup',users.create);*/

router.post('/admin', upload.single('image'),admin.create_post);


/*router.post('/admin',admin.create_post);*/
module.exports = router;