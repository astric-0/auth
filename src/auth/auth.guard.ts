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

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) throw new UnauthorizedException('Token not found');

		try {
			const { secret } = this.configService.get<JwtConfig>(
				configKeys.jwt,
			);

			const payload = await this.jwtService.verifyAsync(token, {
				secret,
			});

			request['user'] = payload;
		} catch (error) {
			CommonLogger.log(error.message, 'AUTH GUARD');
			throw new UnauthorizedException("Couldn't Authenticate");
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type == 'Bearer' ? token : undefined;
	}
}
