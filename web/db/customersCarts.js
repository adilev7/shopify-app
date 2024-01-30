import pool from './connect.js';
const TABLE_NAME = 'customers_carts';

const createCustomerCart = async (customer_id, variants) => {
	const [result] = await pool.query(
		`REPLACE INTO ${TABLE_NAME} (customer_id, variants) VALUES (?, ?)`,
		[customer_id, variants]
	);
	return result;
};

const getCustomerCart = async (customer_id) => {
	const [rows] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE customer_id = ?`, [
		customer_id,
	]);
	return rows[0];
};

const deleteCustomerCart = async (customer_id) => {
	const [result] = await pool.query(`DELETE FROM ${TABLE_NAME} WHERE customer_id = ?`, [
		customer_id,
	]);

	return result;
};

export default {
	createCustomerCart,
	getCustomerCart,
	deleteCustomerCart,
};
