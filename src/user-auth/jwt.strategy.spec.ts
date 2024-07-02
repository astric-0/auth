import { JwtStrategy } from './jwt.strategy';
describe('JwtStrategyTs', () => {
	it('should be defined', () => {
		expect(new JwtStrategy()).toBeDefined();
	});
});
