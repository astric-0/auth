import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/helpers/types';

export default class CreateUserDto {
	@Exclude()
	password: string;

	@Expose()
	appCode: string;

	@Expose()
	username: string;

	@Expose()
	role: UserRole;
}
