import { Client } from '@elastic/elasticsearch';

export class ElasticsearchClientFactory {
	private static client: Client;

	public static createClient(): Client {
		this.client = new Client({ node: process.env.ELASTICSEARCH_URL });
		console.log('Elasticsearch client connected successfully');

		return this.client;
	}

	public static getClient(): Client {
		if (!this.client) {
			throw new Error('Elasticsearch client not connected');
		}

		return this.client;
	}
}
