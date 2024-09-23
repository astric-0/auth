import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common';
import { UserDocument, User as UserModel } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { cns, converter } from 'src/helpers';
import { Model } from 'mongoose';
import { CreateUserDto, UserInfoDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { configKeys } from 'src/config';
import * as bcrypt from 'bcrypt';
import { AppAuthService } from 'src/app-auth/app-auth.service';
import { AppInfoDto } from 'src/app-auth/dto/';

@Injectable()
export class UserService {
	private readonly userDefaultSaltRounds: number;
	constructor(
		@InjectModel(UserModel.name, cns.MAIN)
		private readonly userModel: Model<UserDocument>,
		private readonly configService: ConfigService,
		private readonly appAuthService: AppAuthService,
	) {
		this.userDefaultSaltRounds = Number(
			this.configService.get<number>(configKeys.userDefaultSaltRounds),
		);
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
			.exec();

		if (!userDoc) return null;
		return converter.toInstanceAndExcludeExtras(
			userDoc.toObject(),
			UserInfoDto,
		);
	}

	async findAll(appCode: string): Promise<UserInfoDto[] | null> {
		const userDocs: UserDocument[] | null = await this.userModel
			.find({ appCode })
			.lean()
			.exec();

		if (userDocs?.length == 0) return null;
		return converter.toInstanceArrayAndExcludeExtras(userDocs, UserInfoDto);
	}

	async findOne(id: string, appCode: string): Promise<UserInfoDto | null> {
		const userDoc: UserDocument | null = await this.userModel
			.findOne({ id, appCode })
			.lean()
			.exec();

		if (!userDoc) return null;
		return converter.toInstanceAndExcludeExtras(userDoc, UserInfoDto);
	}

	async create({
		username,
		password,
		appCode,
	}: CreateUserDto): Promise<UserInfoDto> {
		const appInfoDto: AppInfoDto =
			await this.appAuthService.findOneByAppCodeOrAppNameDto({
				appCode,
				appName: null,
			});

		if (!appInfoDto) throw new BadRequestException("App doesn't exist");

		const userInfoDto: UserInfoDto = await this.findOneByUsername(
			username,
			appCode,
		);

		if (userInfoDto) throw new ConflictException('Username already exists');

		const salt = await bcrypt.genSalt(this.userDefaultSaltRounds);
		const hashedPassword = await bcrypt.hash(password, salt);
		const userModel = new this.userModel({
			appCode,
			appId: appInfoDto._id,
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
