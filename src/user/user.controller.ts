import {
	Controller,
	Get,
	Post,
	NotFoundException,
	Param,
	Body,
	BadRequestException,
	HttpCode,
	HttpStatus,
	UseGuards,
	Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthGuard } from 'src/user-auth/user-auth.guard';
import { AppCode } from 'src/helpers/indentifier';
import { Identity, Public } from 'src/public/public.decorator';
import { UserInfoDto } from './dto/user-info.dto';
import { UserIdentity } from 'src/helpers/types';
import { USER_IDENTITY } from 'src/helpers/keys';

@UseGuards(UserAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('findOne/:id')
	async findOne(
		@Param('id') id: string,
		@Headers(AppCode) appCode: string,
	): Promise<UserInfoDto> {
		if (!id) throw new BadRequestException('Please provide user id');
		const user: UserInfoDto | null = await this.userService.findOne(
			id,
			appCode,
		);

		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@Get('findOneByUsername/:username')
	async findOneByUsername(
		@Param('username') username: string,
		@Headers(AppCode) appCode: string,
	): Promise<UserInfoDto> {
		if (!username) throw new BadRequestException('Please provide username');

		const user: UserInfoDto | null =
			await this.userService.findOneByUsername(username, appCode);

		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@Get('findAll')
	async findAll(
		@Identity({ type: USER_IDENTITY }) userIdentity: UserIdentity,
	) {
		const usersInfoDto: UserInfoDto[] | null =
			await this.userService.findAll(userIdentity.AppCode);
		if (!usersInfoDto)
			throw new NotFoundException("Couldn't find users for the app");
		return usersInfoDto;
	}

	@Public()
	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() user: CreateUserDto,
		@Headers(AppCode) appCode: string,
	): Promise<unknown> {
		user.appCode ??= appCode;

		if (!user.username || !user.password)
			throw new BadRequestException('Data is incomplete');
		if (!user.appCode)
			throw new BadRequestException('AppCode is not defined');

		const userInfoDto: UserInfoDto = await this.userService.create(user);

		return { user: userInfoDto, message: 'Account registered' };
	}
}
