import { Module, OnModuleInit, Logger as CommonLogger } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configKeys, JwtConfig } from 'src/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { USER } from 'src/helpers/connection-names';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			global: true,
			useFactory: async (configService: ConfigService) => {
				const { secret, expiresIn } = configService.get<JwtConfig>(
					configKeys.jwt,
				);
				return {
					secret,
					signOptions: { expiresIn },
				};
			},
			inject: [ConfigService],
		}),
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			USER,
		),
	],
	providers: [JwtStrategy, AuthService],
	exports: [JwtModule, PassportModule],
	controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
	constructor(private configService: ConfigService) {}

	onModuleInit() {
		const key = this.configService.get<JwtConfig>(configKeys.jwt).secret;
		CommonLogger.log('SECRET KEY: ' + key, 'AUTH MODULE');
	}
}
