/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';

import container from '../../../config/dependency-injection';
import { TrainingGetController } from '../controllers/TrainingGetController';
import { TrainingPostController } from '../controllers/TrainingPostController';

export function register(router: Router): void {
	const getController = container.resolve<TrainingGetController>('trainingGetController');
	const postController = container.resolve<TrainingPostController>('trainingPostController');

	router.get('/trainings', (req: Request, res: Response) => getController.run(req, res));
	router.post('/trainings', (req: Request, res: Response) => postController.run(req, res));
}
