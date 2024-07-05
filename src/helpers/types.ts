export type HttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PACTH'
	| 'OPTIONS'
	| 'HEAD';

export interface UserIdentity {
	AppCode: string;
	User: {
		Username: string;
	};
}

export interface AppIdentity {
	AppName: string;
	AppCode: string;
	appSecretHashed: string;
	saltRoundsForUsers: number;
	saltRoundsForApp: number;
	userSecret: string;
	userExpireTime: string;
	createdOn: Date;
}
