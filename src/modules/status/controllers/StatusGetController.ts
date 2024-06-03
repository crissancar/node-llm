import { Request, Response } from 'express';
import httpStatus from 'http-status';

export class StatusGetController {
	run(req: Request, res: Response): void {
		console.log(req.headers);
		res.status(httpStatus.OK).send();
	}
}
