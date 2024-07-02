import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilterService } from './global-exception-filter.service';

describe('GlobalExceptionFilterService', () => {
	let service: GlobalExceptionFilterService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GlobalExceptionFilterService],
		}).compile();

		service = module.get<GlobalExceptionFilterService>(
			GlobalExceptionFilterService,
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
