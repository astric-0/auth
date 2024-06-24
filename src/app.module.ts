import { Module, OnModuleInit, Logger as CommonLogger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import configuration from './config/configuration';
import DatabaseConfig from './config/databaseconfig';
import * as cns from 'src/helpers/connection-names';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		UserModule,
		LoggerModule,
		ConfigModule.forRoot({
			envFilePath: 'src/.dev.env',
			isGlobal: true,
			load: [configuration],
			cache: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<DatabaseConfig>('db').logger.connection,
			}),
			inject: [ConfigService],
			connectionName: cns.LOG,
		}),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements OnModuleInit {
	constructor(private configService: ConfigService) {}

	onModuleInit() {
		const loggerConnection =
			this.configService.get<DatabaseConfig>('db').logger.connection;
		CommonLogger.log(`LOGGER CONNECTION: ${loggerConnection}`, 'AppModule');
	}
}
