import { Cohere, CohereEmbeddings } from '@langchain/cohere';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Request, Response } from 'express';
import { sync } from 'glob';
import httpStatus from 'http-status';
import { loadSummarizationChain } from 'langchain/chains';
import { TextLoader } from 'langchain/document_loaders/fs/text';

import { Files } from '../../shared/enums/Files';
import { EmbeddingShema } from '../../shared/persistence/EmdeddingSchema';

export class ArticleGetController {
	async ufcSummary(req: Request, res: Response): Promise<void> {
		try {
			const cohere = new Cohere({ apiKey: process.env.COHERE_API_KEY });
			const loader = new TextLoader(sync(`**/${Files.UFC}`)[0]);
			const documents = await loader.load();
			const article = documents[0].pageContent;

			const tokens = await cohere.getNumTokens(article);
			console.log('Number of tokens:', tokens);

			const textSplitter = new RecursiveCharacterTextSplitter({
				keepSeparator: true,
				separators: ['\n\n', '\n'],
				chunkSize: 5000,
				chunkOverlap: 350,
			});
			const articleChunks = await textSplitter.createDocuments([article]);
			console.log('Number of chunks:', articleChunks.length);

			console.log('Generating summary...');
			const chain = loadSummarizationChain(cohere, {
				type: 'stuff',
			});
			const result = await chain.invoke({ input_documents: articleChunks });

			res.status(httpStatus.OK).send(result);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}

	async socialNetworkSwarch(req: Request, res: Response): Promise<void> {
		try {
			const search = req.query.search as string;

			const embeddings = new CohereEmbeddings({
				apiKey: process.env.COHERE_API_KEY,
			});
			const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
				collection: EmbeddingShema.collection,
				indexName: 'vector_index',
			});

			const results = await vectorStore.similaritySearchWithScore(search, 3);
			const modelResults = results.map((result) => {
				const { metadata, ...rest } = result[0];

				return { ...rest, score: result[1] };
			});

			res.status(httpStatus.OK).json(modelResults);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
