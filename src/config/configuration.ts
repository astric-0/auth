export default () => ({
	db: {
		logger: {
			connection: process.env.LOGGER_DB_CONNECTION,
		},
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRE_TIME,
	},
});

export const configKeys = Object.freeze({ jwt: 'jwt', db: 'db' });

export const configPath = 'src/.dev.env';
