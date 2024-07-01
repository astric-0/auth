import { Expose } from 'class-transformer';
export class UserInfoDto {
	@Expose()
	_id: string;

	@Expose()
	username: string;

	@Expose()
	appCode: string;
}
