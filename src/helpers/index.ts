import * as fs from 'fs';
import sources from './sources';

function readFile<T>(
	filename: string,
	shouldParse: boolean = true,
): Promise<T> {
	if (!filename) return;
	return new Promise((resolve, reject) => {
		fs.readFile(
			filename,
			'utf8',
			(error: NodeJS.ErrnoException | null, data: string) => {
				if (error) return reject(error);
				try {
					if (!data) return resolve(null as T);
					if (shouldParse) return resolve(JSON.parse(data) as T);
					return resolve(data as T);
				} catch (error) {
					return reject(error);
				}
			},
		);
	});
}

function writeFile(filename: string, data: any): Promise<null> {
	if (!filename || !data) return;
	return new Promise((resolve, reject) => {
		fs.writeFile(
			filename,
			JSON.stringify(data),
			'utf8',
			(error: NodeJS.ErrnoException | null) => {
				if (error) return reject(error);
				return resolve(null);
			},
		);
	});
}

async function appendJSONFile<T>(filename: string, data: any): Promise<null> {
	if (!filename || !data) return;
	const fileData: T[] = (await readFile<T[]>(filename, true)) || [];
	fileData.push(data);
	return await writeFile(filename, fileData);
}

export { sources, readFile, writeFile, appendJSONFile };
