import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	Logger as CommonLogger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from 'src/config/jwtconfig';
import { Request } from 'express';
import { configKeys } from 'src/config';
import { getIdentity } from 'src/helpers/indentifier';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		const isPublic = this.reflector.getAllAndOverride<boolean>(
			configKeys.isPublic,
			[context.getHandler(), context.getClass()],
		);

		if (isPublic) return true;

		if (!token) throw new UnauthorizedException('Token not found');

		try {
			const { secret } = this.configService.get<JwtConfig>(
				configKeys.jwt,
			);

			const payload = await this.jwtService.verifyAsync(token, {
				secret,
			});

			request.identity = getIdentity(request.headers, payload);
		} catch (error) {
			CommonLogger.log(error.message, 'AUTH GUARD');
			throw new UnauthorizedException(
				"Couldn't Authenticate: " + error.message,
			);
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type == 'Bearer' ? token : undefined;
	}
}
