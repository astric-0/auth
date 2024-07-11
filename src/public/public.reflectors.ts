import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/helpers/types';

export const Roles = Reflector.createDecorator<UserRole[]>();

export const Public = (val: boolean = true) =>
	Reflector.createDecorator<boolean>()(val);
