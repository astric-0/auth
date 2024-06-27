import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ required: true, type: String })
	appCode: string;

	@Prop({ required: true, type: String })
	username: string;

	@Prop({ type: String })
	hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ appCode: 1, username: 1 }, { unique: true });
