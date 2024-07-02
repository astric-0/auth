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

	insertOne(logDto: CreateLogDto): Promise<LogDocument> {
		const createdLog = new this.loggerModel(logDto);
		return createdLog.save();
	}
}
