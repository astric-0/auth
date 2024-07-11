import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/helpers/types';

export class UserInfo {
	@Expose()
	username: string;

	@Expose()
	appCode: string;

	@Exclude({ toPlainOnly: true })
	hashedPassword: string;

	@Expose()
	role: UserRole;
}
