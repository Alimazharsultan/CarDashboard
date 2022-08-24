import React from 'react';
import styles from './styles.module.css';

function index() {
	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.reload();
	};
	return (
		<nav className={styles.navbar}>
			<h1>Car Directory</h1>
			<button className={styles.white_btn} onClick={handleLogout}>
				Logout
			</button>
		</nav>
	);
}

export default index;
