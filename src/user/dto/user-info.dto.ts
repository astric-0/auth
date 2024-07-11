import { PartialType } from '@nestjs/mapped-types';
import { Expose, Transform } from 'class-transformer';
import CreateUserDto from './create-user.dto';

export default class UserInfoDto extends PartialType(CreateUserDto) {
	@Expose()
	@Transform((params) => params.obj._id.toString())
	_id: string;

	@Expose()
	@Transform((params) => params.obj.appId.toString())
	appId: string;
}
