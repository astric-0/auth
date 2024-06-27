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
import { AuthGuard } from 'src/auth/auth.guard';
import { AppCode } from 'src/helpers/indentifier';
import { Public } from 'src/public/public.decorator';
import { UserInfoDto } from './dto/user-info.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// @Get()
	// async findAll(): Promise<UserInfo[]> {
	// 	const users: UserInfo[] = await this.userService.findAll();
	// 	return users;
	// }

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<UserInfoDto> {
		const user: UserInfoDto | null = await this.userService.findOne(+id);
		if (!user) throw new NotFoundException('User not found');
		return user;
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
