const router = require('express').Router();
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const maxAge = 6 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWTPRIVATEKEY, {
		expiresIn: maxAge,
	});
};

router.post('/', async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: 'Invalid Email or Password' });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: 'Invalid Email or Password' });

		const token = createToken(user._id);
		res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
		
		res.status(200).send({ message: 'logged in successfully', token });
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error' });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label('Email'),
		password: Joi.string().required().label('Password'),
	});
	return schema.validate(data);
};

module.exports = router;
