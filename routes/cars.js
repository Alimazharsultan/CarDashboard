const express = require('express');
const router = express.Router();
const cars = require('../models/carSchema');
const { requireAuth } = require('../middleware/authMiddleware');

// add a car to databasse
router.post('/register', requireAuth, async (req, res) => {
	const { model, manufacturer, color, make, power, registrationNumber, desc } =
		req.body;

	if (
		!model ||
		!manufacturer ||
		!color ||
		!make ||
		!power ||
		!registrationNumber
	) {
		res.status(400).send({ message: 'Please fill all data' });
		return;
	}

	try {
		const preuser = await cars.findOne({
			registrationNumber: registrationNumber,
		});

		if (preuser) {
			res
				.status(400)
				.send({ message: 'Car for this Registration Number already Exists.' });
		} else {
			const addCar = new cars({
				model,
				manufacturer,
				color,
				make,
				power,
				registrationNumber,
				desc,
			});

			await addCar.save();
			res.status(200).json(addCar);
		}
	} catch (error) {
		res.status(422).send({ message: error.message });
	}
});

// get all cars data

router.get('/', async (req, res) => {
	try {
		const carsData = await cars.find();
		res.status(200).json(carsData);
	} catch (error) {
		res.status(422).send({ message: error.message });
	}
});

// get individual user

router.get('/getCar/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const car = await cars.findById({ _id: id });
		res.status(200).json(car);
	} catch (error) {
		res.status(422).send({ message: error.message });
	}
});

// update car data

router.patch('/updateCar/:id', requireAuth, async (req, res) => {
	const { model, manufacturer, color, make, power, registrationNumber, desc } =
		req.body;

	if (
		!model ||
		!manufacturer ||
		!color ||
		!make ||
		!power ||
		!registrationNumber
	) {
		res.status(400).send({ message: 'Please fill all data' });
		return;
	}
	try {
		const { id } = req.params;

		const updatedCar = await cars.findByIdAndUpdate(
			id,
			{
				model,
				manufacturer,
				color,
				make,
				power,
				registrationNumber,
				desc,
			},
			{
				new: true,
			}
		);

		res.status(200).json(updatedCar);
	} catch (error) {
		res.status(422).send({ message: error.message });
	}
});

// delete Car
router.delete('/deleteCar/:id', requireAuth, async (req, res) => {
	try {
		const { id } = req.params;

		const deleteCar = await cars.findByIdAndDelete({ _id: id });
		res.status(200).json(deleteCar);
	} catch (error) {
		res.status(422).send({ message: error.message });
	}
});

module.exports = router;
