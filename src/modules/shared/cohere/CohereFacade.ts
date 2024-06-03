import { Cohere, CohereEmbeddings } from '@langchain/cohere';

import { ModelFacade } from '../interfaces/ModelFacade';

export class CohereFacade implements ModelFacade {
	async invoke(prompt: string): Promise<string> {
		return this.createInstace().invoke(prompt);
	}

	async createVector(text: string): Promise<Array<number>> {
		return this.createEmbeddings().embedQuery(text);
	}

	createInstace(): Cohere {
		return new Cohere({
			apiKey: process.env.COHERE_API_KEY,
		});
	}

	createEmbeddings(): CohereEmbeddings {
		return new CohereEmbeddings({
			apiKey: process.env.COHERE_API_KEY,
		});
	}
}
