import {
	Controller,
	Post,
	Body,
	BadRequestException,
	UseGuards,
} from '@nestjs/common';
import { AppAuthService } from './app-auth.service';
import { CreateAppDto, AppInfoDto } from './dto/';
import { UserAuthGuard } from 'src/user-auth/user-auth.guard';
import { guards, reflectors } from 'src/public/';
import { UserRole } from 'src/helpers/types';

@Controller('app-auth')
@UseGuards(UserAuthGuard, guards.RolesGuard)
@reflectors.Roles([UserRole.SuperAdmin])
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
