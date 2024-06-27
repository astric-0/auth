import { Exclude, Expose } from 'class-transformer';

export class UserInfo {
	@Expose()
	username: string;

	@Expose()
	appCode: string;

	@Exclude({ toPlainOnly: true })
	hashedPassword: string;
}
