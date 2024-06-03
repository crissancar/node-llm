export class FindPromptResponse {
	readonly pageContent: string;

	readonly score: number;

	constructor(pageContent: string, score: number) {
		this.pageContent = pageContent;
		this.score = score;
	}

	static create(pageContent: string, score: number): FindPromptResponse {
		return new FindPromptResponse(pageContent, score);
	}
}
