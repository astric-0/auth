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
import { CreateUserDto, UserInfoDto } from './dto/';
import { UserAuthGuard } from 'src/user-auth/user-auth.guard';
import { reflectors, decorators } from 'src/public/';
import { types, keys, identifier } from 'src/helpers/';

@UseGuards(UserAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('findOne/:id')
	async findOne(
		@Param('id') id: string,
		@Headers(identifier.AppCode) appCode: string,
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
		@Headers(identifier.AppCode) appCode: string,
	): Promise<UserInfoDto> {
		if (!username) throw new BadRequestException('Please provide username');

		const user: UserInfoDto | null =
			await this.userService.findOneByUsername(username, appCode);

		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@Get('findAll')
	async findAll(
		@decorators.Identity({ type: keys.USER_IDENTITY })
		userIdentity: types.UserIdentity,
	) {
		const usersInfoDto: UserInfoDto[] | null =
			await this.userService.findAll(userIdentity.appCode);
		if (!usersInfoDto)
			throw new NotFoundException("Couldn't find users for the app");
		return usersInfoDto;
	}

	@reflectors.Public(true)
	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() user: CreateUserDto,
		@Headers(identifier.AppCode) appCode: string,
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
