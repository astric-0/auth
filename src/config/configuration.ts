export default () => ({
	isPublic: process.env.IS_PUBLIC_KEY,
	statusCodesToLog: process.env.STATUS_CODES_TO_LOG,
	saltRounds: process.env.SALT_ROUNDS,
	db: {
		logger: {
			connection: process.env.LOGGER_DB_CONNECTION,
		},
		main: {
			connection: process.env.MAIN_DB_CONNECTION,
		},
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRE_TIME,
	},
});

export const configKeys = Object.freeze({
	jwt: 'jwt',
	db: 'db',
	saltRounds: 'saltRounds',
	isPublic: 'isPublic',
	statusCodesToLog: 'statusCodesToLog',
});

export const configPath = 'src/.dev.env';
