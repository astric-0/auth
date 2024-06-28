import { Expose } from 'class-transformer';
export class UserInfoDto {
	@Expose()
	id: string;

	@Expose()
	username: string;

	@Expose()
	appCode: string;
}
