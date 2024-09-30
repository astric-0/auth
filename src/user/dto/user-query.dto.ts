import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export default class UserQueryDto {
	@Expose()
	@IsOptional()
	@IsString()
	username?: string;

	@Expose()
	@IsOptional()
	@IsString()
	id?: string;
}
