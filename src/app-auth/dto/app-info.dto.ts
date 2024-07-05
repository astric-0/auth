import { Expose, Transform } from 'class-transformer';
import { CreateAppDto } from './create-app.dto';
import { PartialType } from '@nestjs/mapped-types';

export class AppInfoDto extends PartialType(CreateAppDto) {
	@Expose()
	@Transform((params) => params.obj._id.toString())
	_id: string;
}
