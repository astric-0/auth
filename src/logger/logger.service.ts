import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './logger.schema';
import { CreateLogDto } from './dto/create-log.dto/create-log.dto';
import * as cns from 'src/helpers/connection-names';

@Injectable()
export class LoggerService {
	constructor(
		@InjectModel(Log.name, cns.LOG)
		private loggerModel: Model<LogDocument>,
	) {}

	async insertOne(logDto: CreateLogDto): Promise<Log> {
		const createdLog = new this.loggerModel(logDto);
		return createdLog.save();
	}
}
