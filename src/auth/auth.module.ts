import { Module, OnModuleInit, Logger as CommonLogger } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configKeys, JwtConfig } from 'src/config';

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
		UserModule,
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
