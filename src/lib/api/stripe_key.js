const stripe_key =
	process.env.NODE_ENV === 'production'
		? process.env.API_URL
		: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export default stripe_key;
