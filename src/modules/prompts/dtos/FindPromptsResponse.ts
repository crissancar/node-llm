import { SimilarityVectorResult } from '../persistence/ElasticsearchPromptRepository';
import { FindPromptResponse } from './FindPromptResponse';

export class FindPromptsResponse {
	readonly data: Array<FindPromptResponse>;

	constructor(data: Array<FindPromptResponse>) {
		this.data = data;
	}

	static create(results: SimilarityVectorResult): FindPromptsResponse {
		const promptsArray = results?.map(([document, score]) =>
			FindPromptResponse.create(document.pageContent, score),
		);

		return new FindPromptsResponse(promptsArray);
	}
}
