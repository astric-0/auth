import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as SchemaType } from 'mongoose';
import { UserRole } from 'src/helpers/types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop({ type: SchemaType.Types.ObjectId, ref: 'app' })
	appId: ObjectId;

	@Prop({ type: String, ref: 'app' })
	appCode: string;

	@Prop({ required: true, type: String })
	username: string;

	@Prop({ type: String })
	hashedPassword: string;

	@Prop({ type: String, enum: UserRole, required: true })
	role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ appCode: 1, username: 1 }, { unique: true });
