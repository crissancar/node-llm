import { createReadStream, createWriteStream } from 'fs';
import { parse, unparse } from 'papaparse';

import { DirectoryPathFactory } from '../../shared/services/DirectoryPathFactory';
import { Filesystem } from '../../shared/services/Filesystem';

export class PapaparseMultipleProcessor {
	async run(filePaths: Array<string>): Promise<void> {
		const outputDir = DirectoryPathFactory.create('imdb');
		Filesystem.createDirectorySync(outputDir);

		const writeStream = createWriteStream(`${outputDir}/animation.csv`);

		let headersWritten = false;

		await Promise.all(
			filePaths.map((filePath) => {
				return new Promise((resolve, reject) => {
					const fileStream = createReadStream(filePath);

					parse(fileStream, {
						header: true,
						step(result: any) {
							if (!headersWritten) {
								writeStream.write(`${result.meta.fields.join(',')}\n`);
								headersWritten = true;
							}

							const row = unparse([result.data], { header: false });
							writeStream.write(`${row}\n`);
						},
						complete() {
							resolve(null);
						},
						error(err) {
							reject(err);
						},
					});
				});
			}),
		);
		writeStream.end();
	}
}
