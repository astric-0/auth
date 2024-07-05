import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as SchemaType } from 'mongoose';
import { Transform, Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Transform((params) => params.obj._id.toString())
	@Type(() => String)
	_id: ObjectId;

	@Prop({ type: SchemaType.Types.ObjectId, ref: 'app' })
	appId: ObjectId;

	@Prop({ type: String, ref: 'app' })
	appCode: string;

	@Prop({ required: true, type: String })
	username: string;

	@Prop({ type: String })
	hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ appCode: 1, username: 1 }, { unique: true });
