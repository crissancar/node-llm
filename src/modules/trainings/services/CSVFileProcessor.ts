import { sync } from 'glob';

import { Files } from '../../shared/enums/Files';
import { MemoryUsageTracker } from '../../shared/services/MemoryUsageTracker';
import { PapaparseMultipleProcessor } from './PapaparseMultipleProcessor';
import { StreamCSVSplitter } from './StreamCSVSplitter';

export class CSVFileProcessor {
	constructor(
		private readonly streamCSVSplitter: StreamCSVSplitter,
		private readonly papaparseMultipleProcessor: PapaparseMultipleProcessor,
	) {}

	async run(fileName: Files): Promise<void> {
		const filePath = sync(`**/${fileName}`)[0];
		const chunkSize = 100000;

		console.time('Splitting CSV');
		MemoryUsageTracker.track('before splitting');
		const splittedFilePaths = await this.streamCSVSplitter.run(filePath, chunkSize);
		console.timeEnd('Splitting CSV');

		MemoryUsageTracker.track('before processing files');
		console.time('Processing files asynchronusly');
		await this.papaparseMultipleProcessor.run(splittedFilePaths);
		console.timeEnd('Processing files asynchronusly');
		MemoryUsageTracker.track('after processing files');
	}
}
