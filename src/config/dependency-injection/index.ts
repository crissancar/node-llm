import { asClass, asFunction, createContainer, InjectionMode } from 'awilix';

import { ArticleGetController } from '../../modules/articles/controllers/ArticleGetController';
import { ArticlePostController } from '../../modules/articles/controllers/ArticlePostController';
import { PromptGetController } from '../../modules/prompts/controllers/PromptGetController';
import { PromptPostController } from '../../modules/prompts/controllers/PromptPostController';
import { ElasticsearchPromptRepository } from '../../modules/prompts/persistence/ElasticsearchPromptRepository';
import { PromptCreator } from '../../modules/prompts/services/PromptCreator';
import { PromptsFinder } from '../../modules/prompts/services/PromptsFinder';
import { CohereFacade } from '../../modules/shared/cohere/CohereFacade';
import { ElasticsearchClientFactory } from '../../modules/shared/persistence/ElasticsearchClientFactory';
import { MongooseClientFactory } from '../../modules/shared/persistence/MongooseClientFactory';
import { TrainingGetController } from '../../modules/trainings/controllers/TrainingGetController';
import { TrainingPostController } from '../../modules/trainings/controllers/TrainingPostController';
import { CSVFileProcessor } from '../../modules/trainings/services/CSVFileProcessor';
import { IMDBFileProcessor } from '../../modules/trainings/services/IMDBFileProcessor';
import { PapaparseMultipleProcessor } from '../../modules/trainings/services/PapaparseMultipleProcessor';
import { StreamCSVSplitter } from '../../modules/trainings/services/StreamCSVSplitter';

const container = createContainer({ injectionMode: InjectionMode.CLASSIC, strict: true });

container.register({
	// Prompts
	promptPostController: asClass(PromptPostController),
	promptGetController: asClass(PromptGetController),
	promptRepository: asClass(ElasticsearchPromptRepository),
	promptCreator: asClass(PromptCreator),
	promptsFinder: asClass(PromptsFinder),

	// Articles
	articleGetController: asClass(ArticleGetController),
	articlePostController: asClass(ArticlePostController),

	// Training
	trainingGetController: asClass(TrainingGetController),
	trainingPostController: asClass(TrainingPostController),
	imdbFileProcessor: asClass(IMDBFileProcessor),

	// Global
	papaparseConcurrentProcessor: asClass(CSVFileProcessor),
	papaparseMultipleProcessor: asClass(PapaparseMultipleProcessor),
	modelFacade: asClass(CohereFacade),
	streamCSVSplitter: asClass(StreamCSVSplitter),

	// Infrastructure
	mongooseClient: asFunction(() => MongooseClientFactory.createClient()).singleton(),
	elasticsearchClient: asFunction(() => ElasticsearchClientFactory.createClient()).singleton(),
});

for (const registration of Object.keys(container.registrations)) {
	try {
		container.resolve(registration);
		console.log(`Dependency <${registration}> was resolved successfully`);
	} catch (error) {
		console.error(`Error resolving the dependency <${registration}>`, error);
	}
}

export default container;
