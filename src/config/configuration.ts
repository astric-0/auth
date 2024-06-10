export default () => ({
	db: {
		logger: {
			connection: process.env.LOGGER_DB_CONNECTION,
		},
	},
});
