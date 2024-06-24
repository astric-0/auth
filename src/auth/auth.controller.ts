import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in-dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	login(@Body() { username, password }: LogInDto): Record<string, any> {
		return this.authService.login({ username, password });
	}
}
