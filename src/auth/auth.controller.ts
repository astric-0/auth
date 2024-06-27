import {
	Controller,
	Post,
	Body,
	Headers,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in-dto';
import { AppCode } from 'src/helpers/indentifier';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	login(
		@Body() { username, password }: LogInDto,
		@Headers(AppCode) appCode: string,
	): Record<string, any> {
		if (!username || !password)
			throw new UnauthorizedException('Invalid or empty inputs');

		return this.authService.login({ username, password }, appCode);
	}
}
