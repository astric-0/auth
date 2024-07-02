import { Injectable } from '@nestjs/common';
import { ExceptionLog, ExceptionLogDocument } from './exception-log.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { cns, converter } from 'src/helpers';
import { ExceptionLogDto } from './dto/exception-log-dto/exception-log-dto';
import { CreateExceptionLog } from './dto/create-exception-log/create-exception-log';

@Injectable()
export class GlobalExceptionFilterService {
	constructor(
		@InjectModel(ExceptionLog.name, cns.LOG)
		private readonly exceptionLogModel: Model<ExceptionLogDocument>,
	) {}

	async insertOne(
		requestLog: string,
		cause: unknown,
		statusCode: number,
	): Promise<ExceptionLogDto> {
		const exceptionLogDto: CreateExceptionLog = {
			cause,
			statusCode,
			requestLog,
			timeStamp: new Date(),
		};

		const exceptionLogDoc = new this.exceptionLogModel(exceptionLogDto);

		const exceptionLogObj = (await exceptionLogDoc.save()).toObject();

		return converter.toInstanceAndExcludeExtras(
			exceptionLogObj,
			ExceptionLogDto,
		);
	}
}
