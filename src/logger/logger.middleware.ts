import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { types, keys } from 'src/helpers';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private loggerService: LoggerService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const logDoc = await this.loggerService.insertOne({
			url: req.originalUrl,
			method: req.method as types.HttpMethod,
			body: req.body,
			params: req.params,
			query: req.query,
			timeStamp: new Date(),
		});

		req[keys.LogRecordId] = logDoc.id;
		next();
	}
}
