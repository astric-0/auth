import { User } from 'src/user/user.schema';
import { UserIdentity } from './types';

export function getUserIdentity(
	headers: unknown,
	{ username, appCode, role }: User,
): UserIdentity {
	const data = ApplicableHeaders.reduce((acc, curr) => {
		acc[curr] = headers[curr];
		return acc;
	}, {});

	return Object.freeze({
		...data,
		appCode: appCode ?? data[AppCode],
		user: Object.freeze({
			username,
			appCode,
			role,
		}),
	});
}

export const AppCode = 'appcode';
export const ApplicableHeaders: string[] = [AppCode] as const;
