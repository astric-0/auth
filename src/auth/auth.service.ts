import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from './dto/log-in-dto';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async login({
		username,
		password,
	}: LogInDto): Promise<{ access_token: string }> {
		const payload = { username, sub: password };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
