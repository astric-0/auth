import { Request, Response, NextFunction } from 'express';
//import { sources, appendJSONFile } from 'src/helpers';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private configService: ConfigService) {}

	use(req: Request, res: Response, next: NextFunction) {
		console.log('Request');
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
