import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AppAuthService } from './app-auth.service';
import { CreateAppDto } from './dto/create-app.dto';
import { AppInfoDto } from './dto/app-info.dto';

@Controller('app-auth')
export class AppAuthController {
	constructor(private readonly appAuthService: AppAuthService) {}

	@Post('create-app')
	async createApp(@Body() createAppDto: CreateAppDto) {
		const appInfoDto: AppInfoDto =
			await this.appAuthService.createApp(createAppDto);

		if (!appInfoDto)
			throw new BadRequestException('App name is already taken');

		return appInfoDto;
	}

	//@Post('')
}
