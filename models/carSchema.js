const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
	model: {
		type: String,
		required: true,
	},
	manufacturer: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
	make: {
		type: String,
		required: true,
	},
	power: {
		type: String,
		required: true,
	},
	registrationNumber: {
		type: String,
		unique: true,
		required: true,
	},
	desc: {
		type: String,
	},
});

const users = new mongoose.model('cars', carSchema);

module.exports = users;
