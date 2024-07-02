import { Injectable } from '@nestjs/common';
import { UserDocument, User as UserModel } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { cns, converter } from 'src/helpers';
import { Model } from 'mongoose';
import { CreateUserDto, UserInfoDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { configKeys } from 'src/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	private readonly saltRounds: number;
	constructor(
		@InjectModel(UserModel.name, cns.MAIN)
		private readonly userModel: Model<UserDocument>,
		private readonly configService: ConfigService,
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
		return converter.toInstanceAndExcludeExtras(userDoc, UserInfoDto);
	}

	async findAll(appCode: string): Promise<UserInfoDto[] | null> {
		const userDocs: UserDocument[] | null = await this.userModel
			.find({ appCode })
			.lean()
			.exec();

		if (userDocs?.length == 0) return null;
		return converter.toInstanceArrayAndExcludeExtras(userDocs, UserInfoDto);
	}

	async findOne(id: number): Promise<UserInfoDto | null> {
		const userDoc: UserDocument | null = await this.userModel
			.findOne({ id })
			.lean()
			.exec();

		if (!userDoc) return null;
		return converter.toInstanceAndExcludeExtras(userDoc, UserInfoDto);
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
		return converter.toInstanceAndExcludeExtras(
			userDoc.toObject(),
			UserInfoDto,
		);
	}
}
