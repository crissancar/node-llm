import { Client } from '@elastic/elasticsearch';

import { ElasticsearchClientFactory } from '../../modules/shared/persistence/ElasticsearchClientFactory';

export class ConfigureElasticSearchCommand {
	static async run(): Promise<void> {
		const client = ElasticsearchClientFactory.createClient();

		await this.createTTLPolicy(client);

		await this.createPromptsIndex(client);
	}

	private static async createTTLPolicy(client: Client): Promise<void> {
		await client.transport.request({
			method: 'PUT',
			path: `/_ilm/policy/prompts_ttl_policy`,
			body: {
				policy: {
					phases: {
						delete: {
							min_age: '1d',
							actions: {
								delete: {},
							},
						},
					},
				},
			},
		});
	}

	private static async createPromptsIndex(client: Client): Promise<void> {
		await client.transport.request({
			method: 'PUT',
			path: '/prompts',
			body: {
				settings: {
					index: {
						number_of_shards: 3,
						number_of_replicas: 2,
						lifecycle: {
							name: 'prompts_ttl_policy',
							rollover_alias: 'prompts',
						},
					},
				},
				mappings: {
					dynamic_templates: [
						{
							metadata_except_loc: {
								match: 'metadata.*',
								unmatch: 'metadata.loc',
								match_mapping_type: '*',
								mapping: {
									type: 'keyword',
								},
							},
						},
					],
					properties: {
						embedding: {
							type: 'dense_vector',
							dims: 1024,
							index: true,
							similarity: 'l2_norm',
							index_options: {
								type: 'hnsw',
								m: 16,
								ef_construction: 100,
							},
						},
						metadata: {
							properties: {
								createdAt: {
									type: 'date',
								},
								loc: {
									type: 'object',
								},
								response: {
									type: 'text',
									fields: {
										keyword: {
											type: 'keyword',
											ignore_above: 256,
										},
									},
								},
							},
						},
						text: {
							type: 'text',
						},
					},
				},
			},
		});
	}
}
