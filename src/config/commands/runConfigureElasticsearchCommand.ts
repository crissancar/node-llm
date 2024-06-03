import { ConfigureElasticSearchCommand } from './ConfigureElasticsearchCommand';

ConfigureElasticSearchCommand.run()
	.then(() => {
		console.log('Elasticsearch configuration success');
		process.exit(0);
	})
	.catch((error) => {
		console.log('Elasticsearch configuration fail', error);
		process.exit(1);
	});
