import { IsNotEmpty } from 'class-validator';

export class LogInDto {
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	password: string;
}
