import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Edit = () => {
	// const [getuserdata, setUserdata] = useState([]);
	// console.log(getuserdata);
	const { id } = useParams('');

	const navigate = useNavigate('');

	const [inpval, setINP] = useState({
		model: '',
		manufacturer: '',
		color: '',
		make: '',
		power: '',
		registrationNumber: '',
		desc: '',
	});

	const setdata = (e) => {
		console.log(e.target.value);
		const { name, value } = e.target;
		setINP((preval) => {
			return {
				...preval,
				[name]: value,
			};
		});
	};

	const getCarData = async () => {
		try {
			const url = `http://localhost:8080/api/cars/getCar/${id}`;
			const { data } = await axios.get(url);
			setINP({
				model: data.model,
				manufacturer: data.manufacturer,
				color: data.color,
				make: data.make,
				power: data.power,
				registrationNumber: data.registrationNumber,
				desc: data.desc,
			});
			console.log(data);
		} catch (error) {
			console.log(error.response.data);
			alert(error.response.data);
		}
	};

	const updateCar = async (e) => {
		e.preventDefault();
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
		};
		try {
			const url = `http://localhost:8080/api/cars/updateCar/${id}`;
			const { data: res } = await axios.patch(url, inpval, config);
			navigate('/');
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 300 &&
				error.response.status <= 500
			) {
				alert(error.response.data.message);
			}
		}
	};

	useEffect(() => {
		getCarData();
	}, []);

	return (
		<div className='container'>
			<Navbar />
			<Link to='/'>home</Link>
			<form className='mt-4'>
				<div className='row'>
					<div class='mb-3 col-lg-6 col-md-6 col-12'>
						<label htmlFor='exampleInputEmail1' class='form-label'>
							Model
						</label>
						<input
							type='text'
							value={inpval.model}
							onChange={setdata}
							name='model'
							class='form-control'
							id='exampleInputEmail1'
							aria-describedby='emailHelp'
						/>
					</div>
					<div class='mb-3 col-lg-6 col-md-6 col-12'>
						<label htmlFor='exampleInputPassword1' class='form-label'>
							Manufacturer Name
						</label>
						<input
							type='text'
							value={inpval.manufacturer}
							onChange={setdata}
							name='manufacturer'
							class='form-control'
							id='exampleInputPassword1'
						/>
					</div>
					<div class='mb-3 col-lg-6 col-md-6 col-12'>
						<label htmlFor='exampleInputPassword1' class='form-label'>
							Color
						</label>
						<input
							type='text'
							value={inpval.color}
							onChange={setdata}
							name='color'
							class='form-control'
							id='exampleInputPassword1'
						/>
					</div>
					<div class='mb-3 col-lg-6 col-md-6 col-12'>
						<label htmlFor='exampleInputPassword1' class='form-label'>
							Make
						</label>
						<input
							type='text'
							value={inpval.make}
							onChange={setdata}
							name='make'
							class='form-control'
							id='exampleInputPassword1'
						/>
					</div>
					<div class='mb-3 col-lg-6 col-md-6 col-12'>
						<label htmlFor='exampleInputPassword1' class='form-label'>
							Power
						</label>
						<input
							type='text'
							value={inpval.power}
							onChange={setdata}
							name='power'
							class='form-control'
							id='exampleInputPassword1'
						/>
					</div>
					<div class='mb-3 col-lg-6 col-md-6 col-12'>
						<label htmlFor='exampleInputPassword1' class='form-label'>
							Registration Number
						</label>
						<input
							type='text'
							value={inpval.registrationNumber}
							onChange={setdata}
							name='registrationNumber'
							class='form-control'
							id='exampleInputPassword1'
						/>
					</div>
					<div class='mb-3 col-lg-12 col-md-12 col-12'>
						<label htmlFor='exampleInputPassword1' class='form-label'>
							Description
						</label>
						<textarea
							name='desc'
							value={inpval.desc}
							onChange={setdata}
							className='form-control'
							id=''
							cols='30'
							rows='5'
						></textarea>
					</div>

					<button type='submit' onClick={updateCar} class='btn btn-primary'>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default Edit;
