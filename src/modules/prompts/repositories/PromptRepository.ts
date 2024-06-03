import { Embeddings } from '@langchain/core/embeddings';

import { SimilarityVectorResult } from '../persistence/ElasticsearchPromptRepository';

export interface PromptRepository {
	save(embeddings: Embeddings, prompt: string, response: string): Promise<void>;
	findSimilarByVector(
		embeddings: Embeddings,
		vector: Array<number>,
		k: number,
	): Promise<SimilarityVectorResult>;
}
