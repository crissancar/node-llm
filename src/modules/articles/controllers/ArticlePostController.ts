import { CohereEmbeddings } from '@langchain/cohere';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Request, Response } from 'express';
import { sync } from 'glob';
import httpStatus from 'http-status';
import { TextLoader } from 'langchain/document_loaders/fs/text';

import { Files } from '../../shared/enums/Files';
import { EmbeddingShema } from '../../shared/persistence/EmdeddingSchema';

export class ArticlePostController {
	async trainWithArticle(req: Request, res: Response): Promise<void> {
		try {
			const filePath = sync(`**/${Files.SOCIAL_NETWORKS}`)[0];
			const textLoader = new TextLoader(filePath);
			const loadedFile = await textLoader.load();

			const textSplitter = new RecursiveCharacterTextSplitter({
				chunkSize: 100,
				chunkOverlap: 20,
			});
			const chunks = await textSplitter.splitDocuments(loadedFile);
			console.log(`Chunks: ${chunks.length}`);

			console.log('Persisting embeddings...');
			const embeddings = new CohereEmbeddings({
				verbose: true,
				apiKey: process.env.COHERE_API_KEY,
			});
			const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
				collection: EmbeddingShema.collection,
				indexName: 'vector_index',
			});
			const documentsToStore = chunks.map((chunk) => {
				return {
					pageContent: chunk.pageContent,
					metadata: {
						...chunk.metadata,
						file: Files.SOCIAL_NETWORKS,
						createdAt: new Date().toISOString(),
					},
				};
			});
			await vectorStore.addDocuments(documentsToStore);
			console.log('Embeddings persisted successfully');

			res.status(httpStatus.OK).send();
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
