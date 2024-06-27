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

	return {
		...data,
		[AppCode]: appCode ?? data[AppCode],
		user: {
			username,
			appCode,
		},
	};
}

export const AppCode = 'AppCode';
export const ApplicableHeaders: string[] = [AppCode] as const;
