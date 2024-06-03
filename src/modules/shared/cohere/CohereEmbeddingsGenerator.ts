import { CohereEmbeddings } from '@langchain/cohere';

export class CohereEmbeddingsGenerator {
	static run(): CohereEmbeddings {
		return new CohereEmbeddings({
			apiKey: process.env.COHERE_API_KEY,
		});
	}
}
