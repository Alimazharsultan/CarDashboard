const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;
	// check jwt exists and is verified
	if (token) {
		jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/');
			} else {
				req.user = decodedToken;
				next();
			}
		});
	} else {
		res.redirect('/');
	}
};

module.exports = { requireAuth };
