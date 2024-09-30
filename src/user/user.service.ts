import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { configKeys } from 'src/config';
import { AppAuthService } from 'src/app-auth/app-auth.service';
import { cns, converter, callables } from 'src/helpers';
import { Model } from 'mongoose';

import { UserDocument, User as UserModel } from './user.schema';
import { CreateUserDto, UserInfoDto, UserQueryDto } from './dto';
import { PageQueryDto } from 'src/global-dtos';
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

	async findAll(
		appCode: string,
		pageQueryDto: PageQueryDto,
		userQueryDto: UserQueryDto,
	): Promise<UserInfoDto[]> {
		const userDocs: UserDocument[] | null = await this.userModel
			.find(
				{ appCode, ...userQueryDto },
				callables.getPagination(pageQueryDto),
			)
			.lean()
			.exec();

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
