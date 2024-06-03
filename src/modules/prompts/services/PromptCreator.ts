import { Embeddings } from '@langchain/core/embeddings';

import { ModelFacade } from '../../shared/interfaces/ModelFacade';
import { PromptRepository } from '../repositories/PromptRepository';

export class PromptCreator {
	constructor(
		private readonly modelFacade: ModelFacade,
		private readonly promptRepository: PromptRepository,
	) {}

	async run(prompt: string): Promise<string> {
		const embeddings = this.modelFacade.createEmbeddings();
		const vector = await this.modelFacade.createVector(prompt);

		const cachedResponse = await this.checkCachedResponse(embeddings, vector);
		if (cachedResponse) {
			return cachedResponse;
		}

		const modelResponse = await this.modelFacade.invoke(prompt);

		await this.promptRepository.save(embeddings, prompt, modelResponse);

		return modelResponse;
	}

	private async checkCachedResponse(
		embeddings: Embeddings,
		vector: Array<number>,
	): Promise<string | null> {
		const similarPrompt = await this.promptRepository.findSimilarByVector(embeddings, vector, 1);
		if (!similarPrompt) {
			return null;
		}

		const [[document, score]] = similarPrompt;
		if (score > 0.009) {
			return document.metadata.response as string;
		}
	}
}
