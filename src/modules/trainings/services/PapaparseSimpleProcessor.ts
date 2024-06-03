import { createReadStream } from 'fs';
import { sync } from 'glob';
import { parse } from 'papaparse';

export class PapaparseSimpleProcessor {
	async run(filePathCSV?: string): Promise<Array<unknown>> {
		return new Promise((resolve, reject) => {
			const results = [];
			const filePath = filePathCSV || sync('**/titles.csv')[0];

			const fileStream = createReadStream(filePath);

			parse(fileStream, {
				header: true,
				step(result: { data: { genres: string } }) {
					if (result.data.genres.includes('Animation')) {
						results.push(result.data);
					}
				},
				complete() {
					resolve(results);
				},
				error(err) {
					reject(err);
				},
			});
		});
	}
}
