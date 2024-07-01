import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Transform((params) => params.obj._id)
	_id: ObjectId;

	@Prop({ required: true, type: String })
	appCode: string;

	@Prop({ required: true, type: String })
	username: string;

	@Prop({ type: String })
	hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ appCode: 1, username: 1 }, { unique: true });
