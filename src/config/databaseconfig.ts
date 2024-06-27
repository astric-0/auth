interface DatabaseConfig {
	logger: Db;
	main: Db;
}

interface Db {
	connection: string;
}

export default DatabaseConfig;
