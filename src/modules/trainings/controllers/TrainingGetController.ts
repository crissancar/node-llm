import { Cohere } from '@langchain/cohere';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { Request, Response } from 'express';
import { sync } from 'glob';
import httpStatus from 'http-status';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';

import { Files } from '../../shared/enums/Files';
import { ModelFacade } from '../../shared/interfaces/ModelFacade';
import { TrainingEmbeddingShema } from '../persistence/TrainingEmdeddingSchema';

export class TrainingGetController {
	constructor(private readonly modelFacade: ModelFacade) {}
	async run(req: Request, res: Response): Promise<void> {
		try {
			const filePath = sync(`**/${Files.IMDB_ANIMATION_MIN}`)[0];

			const cohere = new Cohere({
				apiKey: process.env.COHERE_API_KEY,
			});

			const loader = new CSVLoader(filePath);
			const documents = await loader.load();

			// const splitter = new RecursiveCharacterTextSplitter({
			// 	chunkSize: 1000,
			// 	chunkOverlap: 200,
			// });
			// const splittedDocs = await splitter.splitDocuments(documents);
			const embeddings = this.modelFacade.createEmbeddings();

			const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(documents, embeddings, {
				collection: TrainingEmbeddingShema.collection,
				indexName: 'training_index',
			});
			// const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

			const prompt = ChatPromptTemplate.fromTemplate(
				`Answer the user's question only with the context data: {input}. Context: {context}`,
			);

			const combineDocsChain = await createStuffDocumentsChain({ llm: cohere, prompt });

			const retriever = vectorStore.asRetriever();

			const retrievalChain = await createRetrievalChain({ combineDocsChain, retriever });

			const response = await retrievalChain.invoke({
				input: 'What is the originalTitle from The Electric Hotel?',
				context: [documents],
			});
			console.log(response.context);

			res.status(httpStatus.OK).send(response.answer);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
