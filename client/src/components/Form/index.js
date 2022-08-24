import styles from './styles.module.css';
import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Makes, availableCars } from '../../utils/availableCars';
import axios from 'axios';

const Main = ({ closeModal, carData, modalType }) => {
	// preloaded data for form
	const [formData, setFormData] = useState({
		model: carData?.model || 'Camry',
		manufacturer: carData?.manufacturer || 'Toyota',
		color: carData?.color || 'White',
		make: carData?.make || '2000',
		power: carData?.power || '',
		registrationNumber: carData?.registrationNumber || '',
		desc: carData?.desc || '',
	});

	// error to show
	const [error, setError] = useState('');

	// change color and model on changing the manufacturer
	const setManufacturer = (e) => {
		debugger;
		const model = Object.keys(availableCars[e.target.value].Modals)[0];
		const color = availableCars[e.target.value].Modals[model].Colors[0];
		setFormData((preval) => {
			return {
				...preval,
				['manufacturer']: e.target.value,
				['model']: model,
				['color']: color,
			};
		});
	};

	// load clors for each model
	const setModal = (e) => {
		const color =
			availableCars[formData.manufacturer].Modals[e.target.value].Colors;
		setFormData((preval) => {
			return {
				...preval,
				['model']: e.target.value,
				['color']: color,
			};
		});
	};

	const setPower = (e) => {
		const value = e.target.value;
		if (value === '') {
			// prevent NaN value
			setFormData((preval) => {
				return {
					...preval,
					['power']: 0,
				};
			});
		} else if (!isNaN(value)) {
			if (value.length < 10) {
				// prevent invfinty value
				setFormData((preval) => {
					return {
						...preval,
						['power']: parseFloat(value),
					};
				});
			}
		}
	};

	// set all other other categories
	const setdata = (e) => {
		const { name, value } = e.target;
		// limit the length
		if (value.length > 0 && value.length < 20) {
			setFormData((preval) => {
				return {
					...preval,
					[name]: value,
				};
			});
		} else {
			setFormData((preval) => {
				return {
					...preval,
					[name]: '',
				};
			});
		}
	};

	const addCar = async (e) => {
		e.preventDefault();
		if (
			!formData.model ||
			!formData.manufacturer ||
			!formData.color ||
			!formData.make ||
			!formData.power ||
			!formData.registrationNumber
		) {
			setError('Fill all Fields');
			return;
		}
		if (
			!(parseFloat(formData.power) > 699 && parseFloat(formData.power) < 10001)
		) {
			setError('Power value is not right');
			return;
		}
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
		};

		try {
			const url = 'http://localhost:8080/api/cars/register';
			const res = await axios.post(url, formData, config);
			closeModal();
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 300 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	// edit car request
	const editCar = async (e) => {
		e.preventDefault();
		if (
			!formData.model ||
			!formData.manufacturer ||
			!formData.color ||
			!formData.make ||
			!formData.power ||
			!formData.registrationNumber
		) {
			setError('fill all fields');
			return;
		}
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
		};
		try {
			const url = `http://localhost:8080/api/cars/updateCar/${carData._id}`;
			const res = await axios.patch(url, formData, config);
			closeModal();
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 300 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	// form is same for adding and editing
	return (
		<div className={styles.modal_container}>
			<div
				className={styles.title}
				onClick={() => {
					closeModal();
				}}
			>
				<AiOutlineCloseCircle size={30} />
			</div>
			<h1 className={styles.title}>
				{modalType === 'add' ? 'Add Car' : 'Edit Car'}
			</h1>

			<div className={styles.login_container}>
				<div className={styles.login_form_container}>
					<form className={styles.form_container}>
						<div className={styles.form_item}>
							<label htmlFor='exampleInputPassword1'>
								Registration Number:{' '}
							</label>
							<input
								className={styles.input}
								type='text'
								value={formData.registrationNumber}
								onChange={setdata}
								name='registrationNumber'
								id='exampleInputPassword1'
							/>
						</div>
						<div className={styles.form_item}>
							<label className='title'>Manufacturer Name: </label>
							<label>
								<select
									value={formData.manufacturer}
									onChange={(e) => setManufacturer(e)}
									className={styles.input}
									name='manufacturer'
								>
									{Object.keys(availableCars).map((m, index) => {
										return (
											<option key={index} value={m}>
												{m}
											</option>
										);
									})}
								</select>
							</label>
						</div>
						<div className={styles.form_item}>
							<label className='title'>Modal: </label>
							<label>
								<select
									value={formData.model}
									onChange={(e) => setModal(e)}
									className={styles.input}
									name='model'
								>
									{Object.keys(availableCars[formData.manufacturer].Modals).map(
										(m, index) => {
											return (
												<option key={index} value={m}>
													{m}
												</option>
											);
										}
									)}
								</select>
							</label>
						</div>

						<div className={styles.form_item}>
							<label className='title'>Color: </label>
							<label>
								<select
									value={formData.color}
									onChange={(e) => setdata(e)}
									className={styles.input}
									name='color'
								>
									{availableCars[formData.manufacturer].Modals[
										formData.model
									].Colors.map((m, index) => {
										return (
											<option key={index} value={m}>
												{m}
											</option>
										);
									})}
								</select>
							</label>
						</div>
						<div className={styles.form_item}>
							<label className='title'>Make: </label>
							<label>
								<select
									value={formData.make}
									onChange={(e) => setdata(e)}
									className={styles.input}
									name='make'
									placeholder='Choose Category'
								>
									{Makes.map((m, index) => {
										return (
											<option key={index} value={m}>
												{m}
											</option>
										);
									})}
								</select>
							</label>
						</div>
						<div className={styles.form_item}>
							<label htmlFor='exampleInputPassword1'>
								Power cc (700 - 10000):{' '}
							</label>
							<input
								className={styles.input}
								type='text'
								value={formData.power}
								onChange={setPower}
								name='power'
								id='exampleInputPassword1'
							/>
						</div>

						<div className={styles.form_item}>
							<label htmlFor='exampleInputPassword1'>Description: </label>
							<textarea
								name='desc'
								value={formData.desc}
								onChange={setdata}
								className={styles.input}
								id=''
								cols='30'
								rows='5'
							></textarea>
						</div>
					</form>
				</div>
			</div>
			{error && <div className={styles.error_msg}>{error}</div>}
			<button
				type='submit'
				onClick={modalType === 'add' ? addCar : editCar}
				className={styles.button_modal}
			>
				Submit
			</button>
		</div>
	);
};

export default Main;
