function isLoggedIn(req,res,next){
	if(req.user.authenticated)
		return next()
	res.redirect('/login')
}

module.exports = isLoggedIn