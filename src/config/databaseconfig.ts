interface DatabaseConfig {
	logger: Db;
}

interface Db {
	connection: string;
}

export default DatabaseConfig;
