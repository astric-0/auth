import { Transform } from 'class-transformer';
import { CreateExceptionLog } from '../create-exception-log/create-exception-log';

export class ExceptionLogDto extends CreateExceptionLog {
	@Transform((params) => params.obj._id.toString())
	_id: string;
}
