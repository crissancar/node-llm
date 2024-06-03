import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export const QueryValidationMiddleware = <T>(schema: yup.ObjectSchema<T>) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			await schema.validate(req.query, { strict: true });
			next();
		} catch (error) {
			res.status(400).json({ statusCode: 400, details: error.errors });
		}
	};
};
