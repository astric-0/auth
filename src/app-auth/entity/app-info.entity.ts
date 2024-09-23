import { PartialType } from '@nestjs/mapped-types';
import { Expose, Transform } from 'class-transformer';
import { CreateAppDto } from '../dto';

export default class AppInfo extends PartialType(CreateAppDto) {
	@Expose()
	@Transform((params) => params.obj._id.toString())
	_id: string;

	@Expose()
	hashedAppPassword: string;
}
