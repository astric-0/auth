import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { MAIN } from 'src/helpers/connection-names';
import { AppAuthModule } from 'src/app-auth/app-auth.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			MAIN,
		),
		AppAuthModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
