import * as fs from 'fs';

import { DirectoryPathFactory } from '../../shared/services/DirectoryPathFactory';
import { Filesystem } from '../../shared/services/Filesystem';

export class SyncCSVSplitter {
	private readonly filePath: string;
	private readonly chunkSize: number;

	constructor(filePath: string, chunkSize: number) {
		this.filePath = filePath;
		this.chunkSize = chunkSize;
	}

	public async splitFile(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			const outputDir = DirectoryPathFactory.create();
			Filesystem.createDirectorySync(outputDir);

			const file = fs.openSync(this.filePath, 'r');
			let fileIndex = 0;
			let position = 0;
			const buffer = Buffer.alloc(this.chunkSize);
			let bytesRead = 0;
			const filePaths: Array<string> = [];
			let headers: string | null = null;

			while ((bytesRead = fs.readSync(file, buffer, 0, this.chunkSize, position)) > 0) {
				let end = bytesRead;
				while (end > 0 && buffer[end - 1] !== '\n'.charCodeAt(0)) {
					end--;
				}

				let chunk = buffer.subarray(0, end).toString();
				if (headers === null) {
					const newlineIndex = chunk.indexOf('\n');
					headers = chunk.slice(0, newlineIndex);
					chunk = chunk.slice(newlineIndex + 1);
					position += newlineIndex + 1;
				}

				fs.writeFileSync(`${outputDir}/output-${fileIndex}.csv`, `${headers}\n${chunk}`);
				filePaths.push(`${outputDir}/output-${fileIndex}.csv`);

				position += end;
				fileIndex++;
			}

			fs.closeSync(file);
			resolve(filePaths);
		});
	}
}
