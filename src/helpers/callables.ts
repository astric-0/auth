import { Request } from 'express';
import { identifier, types } from '.';
import { PageQueryDto } from 'src/global-dtos';

export function checkAuthType(req: Request, authType: types.AuthType): boolean {
	const requestAuthType = req.headers[identifier.AuthType] as types.AuthType;
	return requestAuthType == authType;
}

export function getPagination({ page, limit }: PageQueryDto): {
	limit: number;
	skip: number;
} {
	return {
		skip: (page - 1) * limit,
		limit,
	};
}
