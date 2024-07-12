import { Request } from 'express';
import { identifier, types } from '.';

export function checkAuthType(req: Request, authType: types.AuthType): boolean {
	const requestAuthType = req.headers[identifier.AuthType] as types.AuthType;
	return requestAuthType == authType;
}
