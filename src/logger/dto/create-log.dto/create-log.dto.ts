import { HttpMethod } from 'src/helpers/types';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export class CreateLogDto {
	url: string;
	timeStamp: Date = new Date();
	method: HttpMethod;
	body: any;
	params: ParamsDictionary;
	query: Query;
	headers: unknown[];
}
