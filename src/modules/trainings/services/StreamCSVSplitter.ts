import { createReadStream, createWriteStream, WriteStream } from 'fs';
import * as Readline from 'readline';

import { DirectoryPathFactory } from '../../shared/services/DirectoryPathFactory';
import { Filesystem } from '../../shared/services/Filesystem';

export class StreamCSVSplitter {
	public async run(filePath: string, chunkSize: number): Promise<string[]> {
		const outputDir = DirectoryPathFactory.create();
		await Filesystem.createDirectoryAsync(outputDir);

		return new Promise((resolve, reject) => {
			const readStream = createReadStream(filePath);
			const readLine = Readline.createInterface({ input: readStream });
			let fileIndex = 0;
			let lineCount = 0;
			let writeStream: WriteStream;
			let headers: string | null = null;
			const filesPaths: Array<string> = [];

			readLine.on('line', (line) => {
				if (headers === null) {
					headers = line;
				}

				if (lineCount % chunkSize === 0) {
					if (writeStream) {
						writeStream.end();
					}
					const newFilePath = `${outputDir}/output-${fileIndex}.csv`;
					filesPaths.push(newFilePath);
					writeStream = createWriteStream(newFilePath);
					writeStream.write(`${headers}\n`);
					fileIndex++;
				}

				writeStream.write(`${line}\n`);
				lineCount++;
			});

			readLine.on('close', () => {
				if (writeStream) {
					writeStream.end();
				}
				resolve(filesPaths);
			});

			readLine.on('error', (err) => {
				reject(err);
			});
		});
	}
}
