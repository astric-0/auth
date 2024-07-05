import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaType } from 'mongoose';
import { cns } from 'src/helpers';
import { Log } from 'src/logger/logger.schema';

export type ExceptionLogDocument = HydratedDocument<ExceptionLog>;

@Schema()
export class ExceptionLog {
	@Prop({ type: SchemaType.Types.ObjectId, ref: cns.LOG })
	requestLog: Log;

	@Prop({ required: true, type: Object })
	cause: unknown;

	@Prop({ default: Date.now })
	timeStamp: Date;

	@Prop({ type: Number })
	statusCode: number;
}

export const ExceptionLogSchema = SchemaFactory.createForClass(ExceptionLog);
