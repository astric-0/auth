import {
	CanActivate,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { keys, types, identifier } from 'src/helpers';
import { AllowedAuthType, Roles } from './public.reflectors';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Observable<boolean> {
		const userRole = this.reflector.getAllAndOverride(Roles, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!userRole)
			throw new UnauthorizedException(
				'Controller or Action should have a role',
			);

		const request: Request = context.switchToHttp().getRequest();
		const userIdentity: types.UserIdentity = request[keys.USER_IDENTITY];
		if (!userRole.includes(userIdentity.user.role))
			throw new UnauthorizedException("Doesn't have access");
		return true;
	}
}

@Injectable()
export class AuthTypeGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const allowedAuthTypes: types.AuthType[] =
			this.reflector.getAllAndOverride(AllowedAuthType, [
				context.getHandler(),
				context.getClass(),
			]);

		if (!allowedAuthTypes || !allowedAuthTypes.length)
			throw new InternalServerErrorException('Authtype is not defined');

		const request: Request = context.switchToHttp().getRequest();
		const authType = request.headers[identifier.AuthType] as types.AuthType;

		if (!allowedAuthTypes.includes(authType))
			throw new UnauthorizedException('Auth type is not allowed');

		request[identifier.AuthType] = authType;

		return true;
	}
}
