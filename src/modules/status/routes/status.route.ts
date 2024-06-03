import { Request, Response, Router } from 'express';

import { StatusGetController } from '../controllers/StatusGetController';

export function register(router: Router): void {
	const statusGetController = new StatusGetController();

	router.get('/status', (req: Request, res: Response) => statusGetController.run(req, res));
}
