export type HttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PATCH'
	| 'OPTIONS'
	| 'HEAD';

export interface UserIdentity {
	appCode: string;
	user: {
		username: string;
		role: UserRole;
	};
}

export interface AppIdentity {
	appName: string;
	appCode: string;
	appSecretHashed: string;
	saltRoundsForUsers: number;
	saltRoundsForApp: number;
	userSecret: string;
	userTokenExpireTime: string;
	createdOn: Date;
}

export enum UserRole {
	SuperAdmin = 'super-admin',
	Admin = 'admin',
	Client = 'client',
}
