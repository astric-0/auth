import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppDocument = HydratedDocument<App>;

@Schema()
export class App {
	@Prop({ type: String, required: true, unique: true })
	appCode: string;

	@Prop({ type: String, required: true, unique: true })
	appName: string;

	@Prop({ type: String, required: true })
	appSecret: string;

	@Prop({ type: String, required: true })
	appPasswordHashed: string;

	@Prop({ type: Number })
	saltRoundsForUsers: number;

	@Prop({ type: Number })
	saltRoundsForApp: number;

	@Prop({ type: Date, default: new Date() })
	createdOn: Date;

	@Prop({ type: String, required: true })
	userSecret: string;

	@Prop({ type: String, required: true })
	userTokenExpireTime: string;

	@Prop({ type: String, required: true })
	appTokenExpireTime: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
