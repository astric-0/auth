import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { LogInDto } from './dto/log-in-dto';

import { cns } from 'src/helpers';

import { UserInfo } from 'src/user/entities/user.entity';
import { User, UserDocument } from 'src/user/user.schema';
import { AppAuthService } from 'src/app-auth/app-auth.service';
@Injectable()
export class UserAuthService {
	constructor(
		private readonly jwtService: JwtService,
		@InjectModel(User.name, cns.MAIN)
		private readonly userModel: Model<UserDocument>,
		private readonly appAuthService: AppAuthService,
	) {}

	private async findUserEntityByUserName(
		username: string,
		appCode: string,
	): Promise<UserInfo | null> {
		const userDoc = await this.userModel
			.findOne({ username, appCode })
			.lean()
			.exec();

		if (!userDoc) return null;
		return plainToClass(UserInfo, userDoc);
	}

	private async matchUserpassword(
		user: LogInDto,
		appCode: string,
	): Promise<[boolean, UserInfo | null]> {
		const userInfo = await this.findUserEntityByUserName(
			user.username,
			appCode,
		);

		if (!userInfo) return [false, null];

		return [
			await bcrypt.compare(user.password, userInfo.hashedPassword),
			userInfo,
		];
	}

	async login(
		{ username, password }: LogInDto,
		appCode: string,
	): Promise<{ access_token: string }> {
		const [isMatched, userInfo] = await this.matchUserpassword(
			{
				username,
				password,
			},
			appCode,
		);

		if (!isMatched)
			throw new UnauthorizedException('Incorrect user or password');

		const userInfoObj = instanceToPlain(userInfo, {
			excludeExtraneousValues: true,
		});

		const { userSecret: secret }: { userSecret: string } =
			await this.appAuthService.findSecretByAppCodeOrAppName({
				appCode,
			});

		return {
			access_token: await this.jwtService.signAsync(userInfoObj, {
				secret,
			}),
		};
	}
}
