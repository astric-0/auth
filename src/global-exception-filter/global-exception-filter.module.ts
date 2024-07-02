import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExceptionLog, ExceptionLogSchema } from './exception-log.schema';
import { cns } from 'src/helpers';
import { GlobalExceptionFilterService } from './global-exception-filter.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: ExceptionLog.name, schema: ExceptionLogSchema }],
			cns.LOG,
		),
	],
	providers: [
		{ provide: APP_FILTER, useClass: GlobalExceptionFilter },
		GlobalExceptionFilterService,
	],
})
export class GlobalExceptionFilterModule {}
