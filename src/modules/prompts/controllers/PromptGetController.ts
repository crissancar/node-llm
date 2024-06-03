import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PromptsFinder } from '../services/PromptsFinder';

export class PromptGetController {
	constructor(private readonly promptsFinder: PromptsFinder) {}

	async run(req: Request, res: Response): Promise<void> {
		try {
			const prompt = req.query.prompt as string;

			const result = await this.promptsFinder.run(prompt);

			res.status(httpStatus.OK).send(result);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
