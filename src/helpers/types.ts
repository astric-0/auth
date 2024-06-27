export type HttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'DELETE'
	| 'PACTH'
	| 'OPTIONS'
	| 'HEAD';

export type Identity = {
	AppCode: string;
	User: {
		Username: string;
	};
};
