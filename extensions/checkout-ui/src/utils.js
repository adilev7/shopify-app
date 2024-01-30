export const gidToId = (id) => id.split('/').pop();

export const addErrorListeners = () => {
	// For unhandled promise rejections
	self.addEventListener('unhandledrejection', (error) => {
		console.warn('event unhandledrejection', error);
	});

	// For other exceptions
	self.addEventListener('error', (error) => {
		console.warn('event error', error);
	});
};
