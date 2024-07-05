import { App } from './app.schema';

describe('AppAuth', () => {
	it('should be defined', () => {
		expect(new App()).toBeDefined();
	});
});
