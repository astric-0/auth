import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppCode } from 'src/helpers/indentifier';
import { AppAuthService } from './app-auth.service';
import { APP_IDENTITY } from 'src/helpers/keys';
import { AppIdentity } from 'src/helpers/types';

@Injectable()
export class AppAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly appAuthService: AppAuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const token: string = this.extractTokenFromHeader(request);
		if (!token) throw new UnauthorizedException('Token not found');

		const appCodeValue = request.headers[AppCode];
		const appCode: string = Array.isArray(appCodeValue)
			? appCodeValue[0]
			: appCodeValue;

		if (!appCode)
			throw new UnauthorizedException("Couldn't recognize the app");

		try {
			const { appSecret: secret } =
				await this.appAuthService.findOneByAppCodeOrAppName({
					appCode,
				});

			const payload = await this.jwtService.verifyAsync(token, {
				secret,
			});

			request[APP_IDENTITY] = payload as AppIdentity;
		} catch (error) {
			throw new UnauthorizedException(
				"Couldn't Authenticate: " + error.message,
			);
		}

		return true;
	}

	private extractTokenFromHeader(req: Request): string {
		const [type, token] = req.headers.authorization?.split(' ') ?? [];
		return type == 'bearer' ? token : undefined;
	}
}
