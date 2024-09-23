import { IsNotEmpty } from 'class-validator';

export default class LoginAppDto {
	@IsNotEmpty()
	appCode: string;

	@IsNotEmpty()
	appPassword: string;
}
