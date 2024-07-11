import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { keys, types } from 'src/helpers/';

export const Identity = createParamDecorator(
	(
		{ key, type }: { key?: string; type: string },
		ctx: ExecutionContext,
	): types.UserIdentity | types.AppIdentity | unknown => {
		if (![keys.USER_IDENTITY, keys.APP_IDENTITY].some((x) => x == type))
			return null;

		const identity: types.UserIdentity = ctx.switchToHttp().getRequest()[
			type
		];
		return key ? identity?.[key] : identity;
	},
);
