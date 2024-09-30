import { IsOptional, IsInt, Min } from 'class-validator';
import { Expose } from 'class-transformer';

export default class PageQueryDto {
	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number;

	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	limit?: number;
}
