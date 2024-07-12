import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppAuthService } from './app-auth.service';
import { callables, types, identifier, keys } from 'src/helpers';

@Injectable()
export class AppAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly appAuthService: AppAuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		if (!callables.checkAuthType(request, types.AuthType.App)) return true;

		const token: string = this.extractTokenFromHeader(request);
		if (!token) throw new UnauthorizedException('Token not found');

		const appCode = request.headers[identifier.AppCode] as string;
		if (!appCode)
			throw new UnauthorizedException("Couldn't recognize the app");

		const { appSecret: secret } =
			await this.appAuthService.findOneByAppCodeOrAppName({
				appCode,
			});

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret,
			});

			request[keys.APP_IDENTITY] = payload as types.AppIdentity;
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
