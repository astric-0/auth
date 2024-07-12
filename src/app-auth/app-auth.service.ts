import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { App, AppDocument } from './app.schema';
import { cns, converter } from 'src/helpers';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { configKeys, JwtConfig } from 'src/config';
import { CreateAppDto, AppInfoDto } from './dto/';
import * as bcrypt from 'bcrypt';

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
		const appPasswordHashed = await bcrypt.hash(appPassword, salt);

		const appInfoDto: AppInfoDto | null =
			await this.findOneByAppCodeOrAppName({ appName, appCode });

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
			appPasswordHashed,
		});

		const appObj = (await appDoc.save()).toObject();
		return converter.toInstanceAndExcludeExtras(appObj, AppInfoDto);
	}

	async findOneByAppCodeOrAppName({
		appName,
		appCode,
	}: {
		appName?: string | null | undefined;
		appCode?: string | null | undefined;
	}): Promise<AppInfoDto | null> {
		if (!appName && !appCode) return null;

		const conditions = [];
		if (appCode)
			conditions.push({
				appCode: { $regex: new RegExp(`^${appCode}`, 'i') },
			});
		if (appName)
			conditions.push({
				appName: { $regex: new RegExp(`${appName}`, 'i') },
			});

		const appInfoObj = await this.appModel
			.findOne({
				$or: conditions,
			})
			.lean()
			.exec();

		if (!appInfoObj) return null;
		return converter.toInstanceAndExcludeExtras(appInfoObj, AppInfoDto);
	}
}
