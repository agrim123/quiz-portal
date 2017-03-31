var database = require('../models/database');

function isAdmin(req,res,next){
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

module.exports = isAdmin;