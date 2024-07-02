import { Module, OnModuleInit, Logger as CommonLogger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import {
	config as configuration,
	DatabaseConfig,
	configKeys,
	configPath,
} from './config/';
import * as cns from 'src/helpers/connection-names';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './user-auth/user-auth.module';
import { GlobalExceptionFilterModule } from './global-exception-filter/global-exception-filter.module';

@Module({
	imports: [
		UserModule,
		LoggerModule,
		ConfigModule.forRoot({
			envFilePath: configPath,
			isGlobal: true,
			load: [configuration],
			cache: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<DatabaseConfig>(configKeys.db).logger
					.connection,
			}),
			inject: [ConfigService],
			connectionName: cns.LOG,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<DatabaseConfig>(configKeys.db).main
					.connection,
			}),
			connectionName: cns.USER,
		}),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		AuthModule,
		GlobalExceptionFilterModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements OnModuleInit {
	constructor(private configService: ConfigService) {}

	onModuleInit() {
		const loggerConnection = this.configService.get<DatabaseConfig>(
			configKeys.db,
		).logger.connection;
		CommonLogger.log(`LOGGER CONNECTION: ${loggerConnection}`, 'AppModule');
	}
}
