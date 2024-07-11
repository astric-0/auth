import { Transform } from 'class-transformer';
import CreateExceptionLog from '../create-exception-log/create-exception-log';
import { PartialType } from '@nestjs/mapped-types';
export default class ExceptionLogDto extends PartialType(CreateExceptionLog) {
	@Transform((params) => params.obj._id.toString())
	_id: string;
}
