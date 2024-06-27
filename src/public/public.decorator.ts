import {
	SetMetadata,
	ExecutionContext,
	createParamDecorator,
} from '@nestjs/common';
import { configKeys } from 'src/config';
import { Identity as IdentityType } from 'src/helpers/types';

export const Public = (...args: string[]) => {
	const publicKey = configKeys.isPublic;
	return SetMetadata(publicKey, args);
};

export const Identity = createParamDecorator(
	(key: string, ctx: ExecutionContext): IdentityType | unknown => {
		const identity: IdentityType = ctx.switchToHttp().getRequest().identity;
		return key ? identity?.[key] : identity;
	},
);
