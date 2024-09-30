import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { App, AppDocument } from './app.schema';
import { configKeys, JwtConfig } from 'src/config';
import { cns, converter } from 'src/helpers';

import { CreateAppDto, AppInfoDto } from './dto/';
import { AppInfo } from './entity/';

@Injectable()
export class AppAuthService {
	private readonly appDefaultSaltRounds: number;
	private readonly userDeafultSaltRounds: number;
	private readonly userDefaultSecret: string;
	private readonly userDefaultExpiresIn: string;
	private readonly appDefaultSecret: string;
	private readonly appDefaultExpiresIn: string;

	constructor(
		@InjectModel(App.name, cns.MAIN)
		private readonly appModel: Model<AppDocument>,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {
		this.appDefaultSaltRounds = Number(
			this.configService.get<number>(configKeys.appDefaultSaltRounds),
		);

		this.userDeafultSaltRounds = Number(
			this.configService.get<number>(configKeys.userDefaultSaltRounds),
		);

		const {
			userDefaultSecret,
			userDefaultExpiresIn,
			appDefaultSecret,
			appDefaultExpiresIn,
		} = this.configService.get<JwtConfig>(configKeys.jwt);

		this.userDefaultSecret = userDefaultSecret;
		this.userDefaultExpiresIn = userDefaultExpiresIn;
		this.appDefaultSecret = appDefaultSecret;
		this.appDefaultExpiresIn = appDefaultExpiresIn;
	}

	async createApp({
		appCode,
		appName,
		appPassword,
		appSecret = this.appDefaultSecret,
		saltRoundsForUsers = this.userDeafultSaltRounds,
		saltRoundsForApp = this.appDefaultSaltRounds,
		userSecret = this.userDefaultSecret,
		userTokenExpireTime = this.userDefaultExpiresIn,
		appTokenExpireTime = this.appDefaultExpiresIn,
	}: CreateAppDto): Promise<AppInfoDto | null> {
		const salt = await bcrypt.genSalt(saltRoundsForApp);
		const hashedAppPassword = await bcrypt.hash(appPassword, salt);

		const appInfoDto: AppInfoDto | null =
			await this.findOneByAppCodeOrAppNameDto({ appName, appCode });

		if (appInfoDto) return null;

		const appDoc = new this.appModel({
			appCode,
			appName,
			appSecret,
			saltRoundsForUsers,
			saltRoundsForApp,
			userSecret,
			userTokenExpireTime,
			appTokenExpireTime,
			hashedAppPassword,
		});

		const appObj = (await appDoc.save()).toObject();
		return converter.toInstanceAndExcludeExtras(appObj, AppInfoDto);
	}

	async findOneByAppCodeOrAppNameDto({
		appName,
		appCode,
	}: {
		appName?: string;
		appCode?: string;
	}): Promise<AppInfoDto | null> {
		const appInfo = await this.findOneByAppCodeOrAppName({
			appName,
			appCode,
		});

		if (!appInfo) return null;
		return converter.toInstanceAndExcludeExtras(appInfo, AppInfoDto);
	}

	public async findSecretByAppCodeOrAppName({
		appName,
		appCode,
	}: {
		appName?: string;
		appCode?: string;
	}): Promise<{ userSecret: string; appSecret: string } | null> {
		const appInfo: AppInfo = await this.findOneByAppCodeOrAppName({
			appName,
			appCode,
		});

		if (!appInfo) return null;

		const { appSecret, userSecret } = appInfo;
		return { appSecret, userSecret };
	}

	private async findOneByAppCodeOrAppName({
		appName,
		appCode,
	}: {
		appName?: string;
		appCode?: string;
	}): Promise<AppInfo | null> {
		if (!appName && !appCode)
			throw new BadRequestException('Invalid AppName or AppCode');

		const conditions = [];
		if (appCode)
			conditions.push({
				appCode: { $regex: new RegExp(`^${appCode}`, 'i') },
			});
		if (appName)
			conditions.push({
				appName: { $regex: new RegExp(`^${appName}`, 'i') },
			});

		const appInfoObj = await this.appModel
			.findOne({ $or: conditions })
			.lean()
			.exec();
		if (!appInfoObj) return null;
		return converter.toInstanceAndIncludeExtras(appInfoObj, AppInfo);
	}

	async login(
		appCode: string,
		appPassword: string,
	): Promise<{ access_token: string }> {
		const appInfo: AppInfo = await this.findOneByAppCodeOrAppName({
			appCode,
		});

		if (
			!appInfo ||
			!(await bcrypt.compare(appPassword, appInfo.hashedAppPassword))
		)
			throw new BadRequestException('Incorrect AppCode or Password');

		const appInfoDto = converter.toInstanceAndExcludeExtras(
			appInfo,
			AppInfoDto,
		);

		return {
			access_token: await this.jwtService.signAsync(appInfoDto, {
				secret: appInfo.appSecret,
			}),
		};
	}
}
