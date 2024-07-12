import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './app.schema';
import { cns } from 'src/helpers';
import { AppAuthService } from './app-auth.service';
import { AppAuthController } from './app-auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfig, configKeys } from 'src/config';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			global: true,
			useFactory: async (configService: ConfigService) => {
				const {
					userDefaultSecret: secret,
					userDefaultExpiresIn: expiresIn,
				} = configService.get<JwtConfig>(configKeys.jwt);

				return {
					secret,
					signOptions: { expiresIn },
				};
			},
			inject: [ConfigService],
		}),
		MongooseModule.forFeature(
			[{ name: App.name, schema: AppSchema }],
			cns.MAIN,
		),
	],
	providers: [AppAuthService],
	controllers: [AppAuthController],
	exports: [AppAuthService],
})
export class AppAuthModule {}
