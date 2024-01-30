import customersCartsDB from '../db/customersCarts.js';

const createCustomerCart = async (customer_id, variants) => {
	try {
		return await customersCartsDB.createCustomerCart(customer_id, variants);
	} catch (err) {
		console.log(err);
	}
};

const getCustomerCart = async (customer_id) => {
	try {
		const customerCart = await customersCartsDB.getCustomerCart(customer_id);
		return customerCart ? JSON.parse(customerCart.variants) : [];
	} catch (err) {
		console.log(err);
	}
};

const deleteCustomerCart = async (customer_id) => {
	try {
		return await customersCartsDB.deleteCustomerCart(customer_id);
	} catch (err) {
		console.log(err);
	}
};

export default {
	createCustomerCart,
	getCustomerCart,
	deleteCustomerCart,
};
