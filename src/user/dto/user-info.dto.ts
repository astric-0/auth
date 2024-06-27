import { Expose } from 'class-transformer';
export class UserInfoDto {
	@Expose()
	username: string;

	@Expose()
	appCode: string;
}
