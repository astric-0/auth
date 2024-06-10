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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async findAll(): Promise<User[]> {
		const users: User[] = await this.userService.findAll();
		return users;
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User> {
		const user: User | null = await this.userService.findOne(+id);
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() { name, type }: CreateUserDto): Promise<void> {
		if (!name || !type) throw new BadRequestException('data is incomplete');
		try {
			await this.userService.create(name, type);
			return;
		} catch (error) {
			throw new InternalServerErrorException(error.message);
		}
	}
}
