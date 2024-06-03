/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

import container from '../../../config/dependency-injection';
import { BodyValidationMiddleware } from '../../shared/middlewares/BodyValidationMiddleware';
import { QueryValidationMiddleware } from '../../shared/middlewares/QueryValidationMiddleware';
import { PromptGetController } from '../controllers/PromptGetController';
import { PromptPostController } from '../controllers/PromptPostController';
import { CreatePromptRequestSchema } from '../dtos/CreatePromptRequest';
import { FindPromptRequestSchema } from '../dtos/FindPromptRequest';

export function register(router: Router): void {
	const promptGetController = container.resolve<PromptGetController>('promptGetController');
	const promptPostController = container.resolve<PromptPostController>('promptPostController');

	router.get('/prompts', QueryValidationMiddleware(FindPromptRequestSchema), (req, res) =>
		promptGetController.run(req, res),
	);

	router.post('/prompts', BodyValidationMiddleware(CreatePromptRequestSchema), (req, res) =>
		promptPostController.run(req, res),
	);
}
