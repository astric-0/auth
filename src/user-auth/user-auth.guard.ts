import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from 'src/config/jwtconfig';
import { Request } from 'express';
import { configKeys } from 'src/config';
import { AppCode, getUserIdentity } from 'src/helpers/indentifier';
import { Reflector } from '@nestjs/core';
import { AppAuthService } from 'src/app-auth/app-auth.service';
import { USER_IDENTITY } from 'src/helpers/keys';

@Injectable()
export class UserAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly reflector: Reflector,
		private readonly appAuthService: AppAuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			configKeys.isPublic,
			[context.getHandler(), context.getClass()],
		);
		if (isPublic) return true;

		const request: Request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		const appCodeValue = request.headers[AppCode];
		const appCode: string = Array.isArray(appCodeValue)
			? appCodeValue[0]
			: appCodeValue;

		if (!token) throw new UnauthorizedException('Token not found');
		if (!appCode)
			throw new UnauthorizedException("Couldn't recognize the app");

		try {
			const { userDefaultSecret } = this.configService.get<JwtConfig>(
				configKeys.jwt,
			);

			const { userSecret: secret = userDefaultSecret } =
				await this.appAuthService.findOneByAppCodeOrAppName({
					appCode,
				});

			const payload = await this.jwtService.verifyAsync(token, {
				secret,
			});

			request[USER_IDENTITY] = getUserIdentity(request.headers, payload);
		} catch (error) {
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
