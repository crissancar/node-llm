import { Embeddings } from '@langchain/core/embeddings';

export interface ModelFacade {
	invoke(prompt: string, options?: any): Promise<string>;
	createVector(text: string): Promise<Array<number>>;
	createEmbeddings(): Embeddings;
}
