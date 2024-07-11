import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { keys, types } from 'src/helpers';
import { Roles } from './public.reflectors';

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
