/* eslint-disable no-console */
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import httpStatus from 'http-status';

import { registerRoutes } from '../config/router';

export class Server {
	private readonly express: express.Express;
	private httpServer?: http.Server;
	private readonly port: string;

	constructor(port: string) {
		this.port = port;
		this.express = express();
		this.express.use(express.json());
		const router = Router();
		this.express.use(router);

		registerRoutes(router);

		router.use((err: Error, req: Request, res: Response, next: Function) => {
			console.error(err);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
		});
	}

	async listen(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.httpServer = this.express.listen(this.port, () => {
				console.log(
					`Node.js LLM app is running at http://localhost:${this.port} in ${this.express.get('env')} mode`,
				);
				console.log('  Press CTRL-C to stop\n');
				resolve();
			});
		});
	}

	async stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (this.httpServer) {
				this.httpServer.close((error) => {
					reject(error);
				});

				resolve();

				return;
			}

			resolve();
		});
	}

	getHTTPServer(): http.Server<typeof IncomingMessage, typeof ServerResponse> {
		return this.httpServer;
	}
}
