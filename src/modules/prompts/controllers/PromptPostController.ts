import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CreatePromptRequest } from '../dtos/CreatePromptRequest';
import { PromptCreator } from '../services/PromptCreator';

export class PromptPostController {
	constructor(private readonly promptCreator: PromptCreator) {}

	async run(req: Request, res: Response): Promise<void> {
		const body = req.body as CreatePromptRequest;
		const { prompt } = body;

		try {
			const response = await this.promptCreator.run(prompt);

			res.status(httpStatus.OK).send(response);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
