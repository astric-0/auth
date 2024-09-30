import { Reflector } from '@nestjs/core';
import { AuthType, UserRole } from 'src/helpers/types';

const Roles = Reflector.createDecorator<UserRole[]>();

const Public = Reflector.createDecorator<boolean>();

const AllowedAuthType = Reflector.createDecorator<AuthType[]>();

export { Roles, Public, AllowedAuthType };
