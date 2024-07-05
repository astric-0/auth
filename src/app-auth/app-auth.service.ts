import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { App, AppDocument } from './app.schema';
import { cns, converter } from 'src/helpers';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { configKeys } from 'src/config';
import { CreateAppDto } from './dto/create-app.dto';
import { AppInfoDto } from './dto/app-info.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppAuthService {
	private readonly appDefaultSaltRounds: number;
	private readonly userDeafultSaltRounds: number;
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
	}

	async createApp({
		appCode,
		appName,
		appSecret,
		saltRoundsForUsers = this.userDeafultSaltRounds,
		saltRoundsForApp = this.appDefaultSaltRounds,
	}: CreateAppDto): Promise<AppInfoDto | null> {
		const salt = await bcrypt.genSalt(saltRoundsForApp);
		const appSecretHashed = await bcrypt.hash(appSecret, salt);

		const appInfoDto: AppInfoDto | null =
			await this.findOneByAppCodeOrAppName({ appName, appCode });

		if (appInfoDto) return null;

		const appDoc = new this.appModel({
			appCode,
			appName,
			appSecretHashed,
			saltRoundsForUsers,
			saltRoundsForApp,
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
