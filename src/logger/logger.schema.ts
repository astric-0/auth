import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { HttpMethod } from 'src/helpers/types';
import { ParamsDictionary } from 'express-serve-static-core';
import { Transform } from 'class-transformer';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
	@Transform((params) => params.value._id)
	_id: string;

	@Prop({ required: true })
	url: string;

	@Prop({ default: Date.now })
	timeStamp: Date;

	@Prop({ required: true })
	method: HttpMethod;

	@Prop({ type: Object })
	body: any;

	@Prop({ type: Object })
	params: ParamsDictionary;

	@Prop({ type: Object })
	query: any;

	@Prop({ type: [Object] })
	headers: unknown[];
}

export const LogSchema = SchemaFactory.createForClass(Log);
