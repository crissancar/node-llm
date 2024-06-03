/* eslint-disable no-console */
import { App } from './App';

try {
	void new App().start();
} catch (error) {
	console.log(error);
	process.exit(1);
}

process.on('uncaughtException', (error) => {
	console.log('uncaughtException', error);
	process.exit(1);
});
