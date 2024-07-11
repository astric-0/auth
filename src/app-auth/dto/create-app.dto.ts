import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export default class CreateAppDto {
	@Expose()
	@IsNotEmpty()
	appCode: string;

	@Expose()
	@IsNotEmpty()
	appName: string;

	@Exclude()
	@IsNotEmpty()
	appSecret: string;

	@Expose()
	@IsOptional()
	saltRoundsForUsers: number;

	@Expose()
	@IsOptional()
	saltRoundsForApp: number;

	@Expose()
	@IsOptional()
	userSecret: string;

	@Expose()
	@IsOptional()
	userExpireTime: string;

	@Exclude()
	@IsNotEmpty()
	password: string;
}
