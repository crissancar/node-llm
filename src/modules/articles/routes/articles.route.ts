/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';

import container from '../../../config/dependency-injection';
import { QueryValidationMiddleware } from '../../shared/middlewares/QueryValidationMiddleware';
import { ArticleGetController } from '../controllers/ArticleGetController';
import { ArticlePostController } from '../controllers/ArticlePostController';
import { SearchInArticleRequest } from '../dtos/SearchInArticleRequest';

export function register(router: Router): void {
	const articleGetController = container.resolve<ArticleGetController>('articleGetController');
	const articlePostController = container.resolve<ArticlePostController>('articlePostController');

	router.get('/articles/summary', (req, res) => articleGetController.ufcSummary(req, res));

	router.get('/articles', QueryValidationMiddleware(SearchInArticleRequest), (req, res) =>
		articleGetController.socialNetworkSwarch(req, res),
	);

	router.post('/articles/train', (req, res) => articlePostController.trainWithArticle(req, res));
}
