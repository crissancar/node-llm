import { CohereEmbeddings } from '@langchain/cohere';

export class CohereVectorGenerator {
	static async fromText(text: string): Promise<Array<number>> {
		const embeddings = new CohereEmbeddings({
			apiKey: process.env.COHERE_API_KEY,
		});

		return embeddings.embedQuery(text);
	}
}
