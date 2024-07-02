import {
	Controller,
	Post,
	Body,
	Headers,
	UnauthorizedException,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { LogInDto } from './dto/log-in-dto';
import { AppCode } from 'src/helpers/indentifier';

@Controller('user-auth')
export class UserAuthController {
	constructor(private userAuthService: UserAuthService) {}

	@Post('login')
	login(
		@Body() { username, password }: LogInDto,
		@Headers(AppCode) appCode: string,
	): Record<string, any> {
		if (!username || !password)
			throw new UnauthorizedException('Invalid or empty inputs');

		return this.userAuthService.login({ username, password }, appCode);
	}
}
