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

export const configKeys = Object.freeze({ jwt: 'jwt', db: 'db' });

export const configPath = Object.freeze('src/.dev.env');
