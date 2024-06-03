import * as http from 'node:http';

import { IncomingMessage, ServerResponse } from 'http';

import { Server } from './server';

export class App {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT || '5001';
		this.server = new Server(port);

		return this.server.listen();
	}

	async stop(): Promise<void> {
		return this.server?.stop();
	}

	get httpServer(): http.Server<typeof IncomingMessage, typeof ServerResponse> {
		return this.server?.getHTTPServer();
	}
}
