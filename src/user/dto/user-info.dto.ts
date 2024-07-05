import { Expose, Transform } from 'class-transformer';

export class UserInfoDto {
	@Expose()
	@Transform((params) => params.obj._id.toString())
	_id: string;

	@Expose()
	@Transform((params) => params.obj.appId.toString())
	appId: string;

	@Expose()
	appCode: string;

	@Expose()
	username: string;
}
