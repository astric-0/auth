import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configKeys, JwtConfig } from 'src/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { MAIN } from 'src/helpers/connection-names';
import { AppAuthModule } from 'src/app-auth/app-auth.module';

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
			[{ name: User.name, schema: UserSchema }],
			MAIN,
		),
		AppAuthModule,
	],
	providers: [JwtStrategy, UserAuthService],
	exports: [JwtModule, PassportModule],
	controllers: [UserAuthController],
})
export class UserAuthModule {}
