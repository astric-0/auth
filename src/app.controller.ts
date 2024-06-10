import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { All } from './all.dto';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Post('all')
	getAll(@Body() x: All): string {
		console.log(x);
		return 'hey there';
	}
}
