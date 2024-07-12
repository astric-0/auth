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
import { Reflector } from '@nestjs/core';
import { AppAuthService } from 'src/app-auth/app-auth.service';
import { identifier, types, keys, callables } from 'src/helpers';
import { reflectors } from 'src/public';

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
			reflectors.Public,
			[context.getHandler(), context.getClass()],
		);

		if (isPublic) return true;
		const request: Request = context.switchToHttp().getRequest();

		if (!callables.checkAuthType(request, types.AuthType.Admin))
			return true;

		const token = this.extractTokenFromHeader(request);
		if (!token) throw new UnauthorizedException('Token not found');

		const appCode = request.headers[identifier.AppCode] as string;
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

			const userIdentity = identifier.getUserIdentity(
				request.headers,
				payload,
			);

			request[keys.USER_IDENTITY] = userIdentity;
		} catch (error) {
			throw new UnauthorizedException(
				"Couldn't Authenticate: " + error.message,
			);
		}

		const userIdentity = request[keys.USER_IDENTITY] as types.UserIdentity;
		const userRole = this.reflector.getAllAndOverride(reflectors.Roles, [
			context.getHandler(),
			context.getClass(),
		]) as types.UserRole[];

		if (userRole && !userRole.includes(userIdentity.user.role))
			throw new UnauthorizedException("Doesn't have access");

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type == 'Bearer' ? token : undefined;
	}
}
