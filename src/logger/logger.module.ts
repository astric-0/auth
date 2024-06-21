import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './logger.schema';
import * as cns from 'src/helpers/connection-names';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: Log.name, schema: LogSchema }],
			cns.LOG,
		),
	],
	providers: [LoggerService],
	exports: [LoggerService],
})
export class LoggerModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
