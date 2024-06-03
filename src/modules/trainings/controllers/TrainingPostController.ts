import { Request, Response } from 'express';
import { sync } from 'glob';
import httpStatus from 'http-status';

import { Files } from '../../shared/enums/Files';
import { MemoryUsageTracker } from '../../shared/services/MemoryUsageTracker';
import { IMDBFileProcessor } from '../services/IMDBFileProcessor';
import { StreamCSVSplitter } from '../services/StreamCSVSplitter';

export class TrainingPostController {
	constructor(
		private readonly streamCSVSplitter: StreamCSVSplitter,
		private readonly imdbFileProcessor: IMDBFileProcessor,
	) {}

	async run(req: Request, res: Response): Promise<void> {
		try {
			console.time('TOTAL TIME');
			MemoryUsageTracker.track('START');
			console.log('Processing CSV file...');

			const filePath = sync(`**/${Files.IMDB_MIN}`)[0];
			const chunkSize = 100000;

			console.time('Splitting CSV');
			MemoryUsageTracker.track('before splitting');
			const splittedFilePaths = await this.streamCSVSplitter.run(filePath, chunkSize);
			console.timeEnd('Splitting CSV');

			MemoryUsageTracker.track('before processing files');
			console.time('Processing splitted files and creating new CSV');
			await this.imdbFileProcessor.run(splittedFilePaths);
			console.timeEnd('Processing splitted files and creating new CSV');
			MemoryUsageTracker.track('after processing files');

			MemoryUsageTracker.track('END');
			console.timeEnd('TOTAL TIME');

			res.status(httpStatus.OK).send();
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
