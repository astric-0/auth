export default () => ({
	isPublic: process.env.IS_PUBLIC_KEY,
	errorStatusCodesToLog: process.env.ERROR_STATUS_CODES_TO_LOG,
	userDefaultSaltRounds: process.env.USER_DEFAULT_SALT_ROUNDS,
	appDefaultSaltRounds: process.env.APP_DEFAULT_SALT_ROUNDS,
	db: {
		logger: {
			connection: process.env.LOGGER_DB_CONNECTION,
		},
		main: {
			connection: process.env.MAIN_DB_CONNECTION,
		},
	},
	jwt: {
		appDefaultSecret: process.env.APP_DEFAULT_JWT_SECRET,
		appDefaultExpiresIn: process.env.APP_DEFAULT_JWT_EXPIRE_TIME,
		userDefaultSecret: process.env.USER_DEFAULT_JWT_SECRET,
		userDefaultExpiresIn: process.env.USER_DEFAULT_JWT_EXPIRE_TIME,
	},
});

export const configKeys = Object.freeze({
	jwt: 'jwt',
	db: 'db',
	userDefaultSaltRounds: 'userDefaultSaltRounds',
	errorStatusCodesToLog: 'errorStatusCodesToLog',
	appDefaultSaltRounds: 'appDefaultSaltRounds',
});

export const configPath = 'src/.dev.env';
