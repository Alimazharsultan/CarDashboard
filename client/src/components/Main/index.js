import React, { useState, useEffect } from 'react';
import { MdEdit, MdAddCircleOutline, MdDelete } from 'react-icons/md';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Navbar from '../Navbar';
import Form from '../Form';
import styles from './styles.module.css';
import Modal from 'react-modal';


// styles for modal 
const customStyles = {
	content: {
		top: '45%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

const Home = () => {
	const [carsData, setCarsData] = useState([]);
	const [addModal, setAddModal] = useState(false);
	const [carToEdit, setCarToEdit] = useState();

	// Load car data 
	const getdata = async () => {
		try {
			const url = `http://localhost:8080/api/cars/`;
			const { data } = await axios.get(url);
			setCarsData(data);
		} catch (error) {
			console.log(error.response.data);
			alert(error.response.data);
		}
	};

	// close add modal 
	const closeAddModal = () => {
		setAddModal(false);
	};

	// close edit modal 
	const closeEditModal = () => {
		setCarToEdit();
	};

	useEffect(() => {
		// re load data after adding or editing a car
		getdata(); 
	}, [addModal, carToEdit]);

	// delete request 
	const deleteCar = async (id) => {
		const config = {
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true,
		};
		try {
			const url = `http://localhost:8080/api/cars/deleteCar/${id}`;
			await axios.delete(url, config);
			getdata();
		} catch (error) {
			console.log(error);
			alert(error.response.data.message);
		}
	};

	// columns for datatable 

	const columns = [
		{
			name: 'Registration Number',
			selector: (row) => row.registrationNumber,
			sortable: true,
		},
		{
			name: 'Model',
			selector: (row) => row.model,
			sortable: true,
		},
		{
			name: 'Manufacturer',
			selector: (row) => row.manufacturer,
			sortable: true,
		},
		{
			name: 'Color',
			selector: (row) => row.color,
			sortable: true,
		},
		{
			name: 'Make',
			selector: (row) => row.make,
			sortable: true,
		},
		{
			name: 'Power',
			selector: (row) => row.power,
			sortable: true,
		},
		{
			// edit button 
			name: 'Edit',
			cell: (row) => (
				<button
					onClick={() => {
						setCarToEdit(row);
					}}
				>
					<MdEdit />
				</button>
			),

			button: true,
		},
		{
			// delete button 
			name: 'Delete',
			cell: (row) => (
				<button
					className={styles.delete_btn}
					onClick={() => deleteCar(row._id)}
				>
					<MdDelete />
				</button>
			),

			button: true,
		},
	];

	return (
		<div className={styles.main_container}>
			<Navbar />

			<div className={styles.data_container}>
				<div className={styles.add_btn}>
					{/* <Link to='/Form'> */}
					<MdAddCircleOutline
						size={40}
						color='black'
						onClick={() => {
							setAddModal(true);
						}}
					/>
					{/* </Link> */}
				</div>
				<div className={styles.data_table}>
					<DataTable
						pagination
						columns={columns}
						data={[...carsData].reverse()}
					/>
				</div>
			</div>
			<Modal
				isOpen={addModal}
				onRequestClose={closeAddModal}
				style={customStyles}
				contentLabel='Add Car Modal'
			>
				<Form closeModal={closeAddModal} modalType='add' />
			</Modal>
			<Modal
				isOpen={carToEdit}
				onRequestClose={closeEditModal}
				style={customStyles}
				contentLabel='Edit Car Modal'
			>
				<Form
					closeModal={closeEditModal}
					carData={carToEdit}
					modalType='edit'
				/>
			</Modal>
		</div>
	);
};

export default Home;
