import { Router } from 'express';
import { glob } from 'glob';
import path from 'path';

export function registerRoutes(router: Router): void {
	const routes = glob.sync(path.join(__dirname, '../../**/**/*.route.*'));
	routes.map((route) => register(route, router));
}

function register(routePath: string, router: Router): void {
	// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
	const route = require(routePath);
	route.register(router);
}
