const router = require('express').Router();
const { User, validate } = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: 'User with given email already Exist!' });

		const password = Math.random() // Generate random number, eg: 0.123456
			.toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
			.slice(-8);

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(password, salt);
		user = await new User({ ...req.body, password: hashPassword }).save();

		await sendEmail(user.email, "Password for mail" , `Your password: ${password}`);

		res.status(201).send({ message: 'Password Sent to Mail' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Internal Server Error' });
	}
});


module.exports = router;
