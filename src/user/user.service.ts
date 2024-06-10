import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { readFile, sources, appendJSONFile } from 'src/helpers';

@Injectable()
export class UserService {
	async findAll(): Promise<User[]> {
		return await readFile<User[]>(sources.db);
	}

	async findOne(id: number): Promise<User | null> {
		const users: User[] = await readFile<User[]>(sources.db);
		return users.find((user: User) => user.id == id);
	}

	async create(name: string, type: number): Promise<void> {
		const allIds: number[] = (await readFile<User[]>(sources.db))?.map(
			({ id }: User) => id,
		);

		const id: number = Math.max(...(allIds.length ? allIds : [0])) + 1;

		await appendJSONFile<User>(sources.db, {
			id,
			name,
			type,
		});
	}
}
