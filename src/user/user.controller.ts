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
	InternalServerErrorException,
	UseGuards,
	Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthGuard } from 'src/user-auth/user-auth.guard';
import { AppCode } from 'src/helpers/indentifier';
import { Identity, Public } from 'src/public/public.decorator';
import { UserInfoDto } from './dto/user-info.dto';
import { Identity as IdentityType } from 'src/helpers/types';

@UseGuards(UserAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('findOne/:id')
	async findOne(@Param('id') id: string): Promise<UserInfoDto> {
		const user: UserInfoDto | null = await this.userService.findOne(+id);
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@Get('findOneByUsername/:username')
	async findOneByUsername(
		@Param('username') username: string,
		@Headers(AppCode) appCode: string,
	): Promise<UserInfoDto> {
		const user: UserInfoDto | null =
			await this.userService.findOneByUsername(username, appCode);
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@Get('findAll')
	async findAll(@Identity() identity: IdentityType) {
		const usersInfoDto: UserInfoDto[] | null =
			await this.userService.findAll(identity.AppCode);
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
		if (!user.username || !user.password)
			throw new BadRequestException('data is incomplete');
		let userData: UserInfoDto;
		try {
			userData = await this.userService.create(user, appCode);
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}

		if (!userData) throw new BadRequestException('User already exists');
		return { user: userData, message: 'Account registered' };
	}
}
