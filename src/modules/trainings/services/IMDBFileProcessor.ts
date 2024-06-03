import { createReadStream, createWriteStream, WriteStream } from 'fs';
import { stat } from 'fs/promises';
import { parse, ParseStepResult, unparse } from 'papaparse';

import { DirectoryPathFactory } from '../../shared/services/DirectoryPathFactory';
import { Filesystem } from '../../shared/services/Filesystem';

interface IMDBRow {
	genres: string | Array<string>;
}

export class IMDBFileProcessor {
	private totalFilesSize = 0;

	async run(filePaths: Array<string>): Promise<void> {
		const outputDir = DirectoryPathFactory.create('imdb');
		await Filesystem.createDirectoryAsync(outputDir);

		const newFilePath = `${outputDir}/animation.csv`;
		const writeStream = createWriteStream(newFilePath);

		try {
			await Promise.all(
				filePaths.map((filePath) => {
					return this.processFile(filePath, writeStream);
				}),
			);
			writeStream.end();
			console.log(`Total processed files size: ${(this.totalFilesSize / 1048576).toFixed(2)} MB`);
		} catch (error) {
			await Filesystem.renameFileAsync(newFilePath, `${newFilePath.replace('.csv', '')}-error.csv`);
			writeStream.end();
			throw new Error('Error processing files');
		}
	}

	private async processFile(filePath: string, writeStream: WriteStream): Promise<void> {
		let headersWritten = false;
		const fileSize = (await stat(filePath)).size;
		this.totalFilesSize += fileSize;

		return new Promise((resolve, reject) => {
			const fileStream = createReadStream(filePath);

			parse(fileStream, {
				header: true,
				step(result: ParseStepResult<IMDBRow>) {
					if (!headersWritten) {
						writeStream.write(`${result.meta.fields.join(',')}\n`);
						headersWritten = true;
					}

					if (result.data.genres.includes('Animation')) {
						const row = unparse([result.data], { header: false });
						writeStream.write(`${row}\n`);
					}
				},
				complete() {
					resolve(null);
				},
				error(error) {
					console.error(error.message);
					reject(error);
				},
			});
		});
	}
}
