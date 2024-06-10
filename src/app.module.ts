import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import configuration from './config/configuration';
import DatabaseConfig from './config/databaseconfig';

@Module({
	imports: [
		UserModule,
		ConfigModule.forRoot({
			envFilePath: '.dev.env',
			isGlobal: true,
			load: [configuration],
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<DatabaseConfig>('db').logger.connection,
			}),
			inject: [ConfigService],
		}),
		LoggerModule,
	],
	controllers: [AppController],
	providers: [AppService, LoggerModule],
})
export class AppModule {}
