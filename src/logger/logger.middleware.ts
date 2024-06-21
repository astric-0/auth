import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { HttpMethod } from 'src/helpers/types';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private loggerService: LoggerService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		await this.loggerService.insertOne({
			url: req.url,
			method: req.method as HttpMethod,
			body: req.body,
			params: req.params,
			query: req.query,
			timeStamp: new Date(),
		});

		next();
	}
}
