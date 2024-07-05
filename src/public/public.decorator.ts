import {
	SetMetadata,
	ExecutionContext,
	createParamDecorator,
} from '@nestjs/common';
import { configKeys } from 'src/config';
import { AppIdentity, UserIdentity } from 'src/helpers/types';
import { USER_IDENTITY, APP_IDENTITY } from 'src/helpers/keys';

export const Public = (...args: string[]) => {
	const publicKey = configKeys.isPublic;
	return SetMetadata(publicKey, args);
};

export const Identity = createParamDecorator(
	(
		{ key, type }: { key?: string; type: string },
		ctx: ExecutionContext,
	): UserIdentity | AppIdentity | unknown => {
		if (![USER_IDENTITY, APP_IDENTITY].some((x) => x == type)) return null;

		const identity: UserIdentity = ctx.switchToHttp().getRequest()[type];
		return key ? identity?.[key] : identity;
	},
);
