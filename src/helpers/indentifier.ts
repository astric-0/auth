import { User } from 'src/user/user.schema';
import { Identity } from './types';

export function getIdentity(
	headers: unknown,
	{ username, appCode }: User,
): Identity {
	const data = ApplicableHeaders.reduce(
		(acc, curr) => (acc[curr] = headers[curr]),
		{},
	);

	return Object.freeze({
		...data,
		[AppCode]: appCode ?? data[AppCode],
		user: Object.freeze({
			username,
			appCode,
		}),
	});
}

export const AppCode = 'AppCode';
export const ApplicableHeaders: string[] = [AppCode] as const;
