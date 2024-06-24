export default () => ({
	db: {
		logger: {
			connection: process.env.LOGGER_DB_CONNECTION,
		},
	},
	jwt: {
		secret: process.env.JWT_SECRET,
	},
});
