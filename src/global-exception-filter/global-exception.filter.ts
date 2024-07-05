import {
	ArgumentsHost,
	Catch,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GlobalExceptionFilterService } from './global-exception-filter.service';
import { ConfigService } from '@nestjs/config';
import { configKeys } from 'src/config';
import { keys } from 'src/helpers';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
	private readonly statusCodesToLog: string[];
	constructor(
		private readonly exceptionLogService: GlobalExceptionFilterService,
		private readonly configService: ConfigService,
	) {
		super();
		this.statusCodesToLog = this.configService
			.get<string>(configKeys.errorStatusCodesToLog)
			.split(',');
	}

	async catch(exception: unknown, host: ArgumentsHost) {
		super.catch(exception, host);
		const [statusCode, cause] =
			exception instanceof HttpException
				? [exception.getStatus(), exception.getResponse()]
				: [HttpStatus.INTERNAL_SERVER_ERROR, exception];

		if (this.statusCodesToLog.includes(String(statusCode))) {
			const requestLogId: string = host.switchToHttp().getRequest()[
				keys.LOG_RECORD_ID
			];
			await this.exceptionLogService.insertOne(
				requestLogId,
				cause,
				statusCode,
			);
		}
	}
}
