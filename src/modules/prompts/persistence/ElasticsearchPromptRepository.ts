import { ElasticVectorSearch } from '@langchain/community/vectorstores/elasticsearch';
import { Document } from '@langchain/core/documents';
import { Embeddings } from '@langchain/core/embeddings';

import { ElasticsearchClientFactory } from '../../shared/persistence/ElasticsearchClientFactory';
import { PromptRepository } from '../repositories/PromptRepository';

export type SimilarityVectorResult = Array<[Document, number]>;

export class ElasticsearchPromptRepository implements PromptRepository {
	async save(embeddings: Embeddings, prompt: string, response: string): Promise<void> {
		const vectorStore = this.createVectorStore(embeddings, 'prompts');

		const document = new Document({
			pageContent: prompt,
			metadata: { response, createdAt: new Date().toISOString() },
		});

		await vectorStore.addDocuments([document]);
	}

	async findSimilarByVector(
		embeddings: Embeddings,
		vector: number[],
		k: number,
	): Promise<SimilarityVectorResult> {
		const vectorStore = this.createVectorStore(embeddings, 'prompts');

		const result = await vectorStore.similaritySearchVectorWithScore(vector, k);

		return result.length ? result : null;
	}

	private createVectorStore(embeddings: Embeddings, indexName: string): ElasticVectorSearch {
		return new ElasticVectorSearch(embeddings, {
			client: ElasticsearchClientFactory.getClient(),
			indexName,
		});
	}
}
