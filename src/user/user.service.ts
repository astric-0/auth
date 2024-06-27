import { Injectable } from '@nestjs/common';
import { UserInfo } from './entities/user.entity';
import { UserDocument, User as UserModel } from './user.schema';
import { readFile, sources } from 'src/helpers';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from 'src/helpers/connection-names';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { configKeys } from 'src/config';
import * as bcrypt from 'bcrypt';
import { UserInfoDto } from './dto/user-info.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
	private saltRounds: number;
	constructor(
		@InjectModel(UserModel.name, USER)
		private userModel: Model<UserDocument>,
		private configService: ConfigService,
	) {
		this.saltRounds = this.configService.get<number>(configKeys.saltRounds);
	}

	async findOneByUsername(
		username: string,
		appCode: string,
	): Promise<UserInfoDto | null> {
		const userDoc = await this.userModel
			.findOne({
				username: { $regex: new RegExp(`^${username}`, 'i') },
				appCode,
			})
			.lean()
			.exec();

		if (!userDoc) return null;
		return plainToClass(UserInfoDto, userDoc);
	}

	async findAll(): Promise<UserInfo[]> {
		return await readFile<UserInfo[]>(sources.db);
	}

	async findOne(id: number): Promise<UserInfoDto | null> {
		const userDoc = await this.userModel
			.findOne((user: UserDocument) => user.id == id)
			.lean()
			.exec();

		if (!userDoc) return null;
		return plainToClass(UserInfoDto, userDoc);
	}

	async create(
		{ username, password }: CreateUserDto,
		appCode: string,
	): Promise<UserInfoDto | null> {
		const exists = await this.findOneByUsername(username, appCode);

		if (exists) return null;

		const salt = await bcrypt.genSalt(Number(this.saltRounds));
		const hashedPassword = await bcrypt.hash(password, salt);
		const userModel = new this.userModel({
			appCode,
			username,
			hashedPassword,
		});
		const userDoc: UserDocument = await userModel.save();
		return plainToClass(UserInfoDto, userDoc.toObject());
	}
}
