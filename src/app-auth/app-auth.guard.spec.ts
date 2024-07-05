import { AppAuthGuard } from './app-auth.guard';

describe('AppAuthGuard', () => {
	it('should be defined', () => {
		expect(new AppAuthGuard()).toBeDefined();
	});
});
