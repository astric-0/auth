import { Request, Response, NextFunction } from 'express';
//import { sources, appendJSONFile } from 'src/helpers';
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

// export default async function logger(
// 	req: Request,
// 	res: Response,
// 	next: NextFunction,
// ) {
// 	const { body, url, query, method, params } = req;
// 	await appendJSONFile<any>(sources.requestLogDB, {
// 		id: Date.now(),
// 		'time-stamp': new Date().toLocaleString(),
// 		body,
// 		url,
// 		method,
// 		params,
// 		query,
// 	});

// 	next();
// }
