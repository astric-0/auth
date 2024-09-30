import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/helpers/types';
import { IsNotEmpty } from 'class-validator';

export default class CreateUserDto {
	@Expose()
	appCode: string;

	@IsNotEmpty()
	@Exclude()
	password: string;

	@IsNotEmpty()
	@Expose()
	username: string;

	@IsNotEmpty()
	@Expose()
	role: UserRole;
}
