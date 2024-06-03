import { ModelFacade } from '../../shared/interfaces/ModelFacade';
import { FindPromptsResponse } from '../dtos/FindPromptsResponse';
import { PromptRepository } from '../repositories/PromptRepository';

export class PromptsFinder {
	constructor(
		private readonly modelFacade: ModelFacade,
		private readonly promptRepository: PromptRepository,
	) {}

	async run(prompt: string): Promise<FindPromptsResponse> {
		const embeddings = this.modelFacade.createEmbeddings();
		const vector = await this.modelFacade.createVector(prompt);

		const results = await this.promptRepository.findSimilarByVector(embeddings, vector, 2);

		return FindPromptsResponse.create(results);
	}
}
