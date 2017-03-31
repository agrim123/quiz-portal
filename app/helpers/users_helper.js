var crypto = require('crypto');
module.exports = {
	hashpassword: function(password) {
		return crypto.createHash('sha256').update(password).digest('base64').toString();
	}
}