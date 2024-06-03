import { Cohere } from '@langchain/cohere';
import { PromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PokemonResponseExample } from '../shared/utils/PokemonResponseExample';

export class PokemonsCohereGetController {
	async run(req: Request, res: Response): Promise<void> {
		try {
			const { searchParams } = new URL(req.url, 'http://localhost:5000');
			const captain = searchParams.get('captain') ?? '';

			const chain = RunnableSequence.from([
				PromptTemplate.fromTemplate('{captain}'),
				SystemMessagePromptTemplate.fromTemplate(
					`
					* Eres un entrenador pokémon.
					* Forma un equipo de 4 pokémons.
					* El pokémon capitán del equipo es ${captain} y debe ser el primero que recomiendes, indicando que es el capitán.
					* Responde en castellano.
					* Responde en máximo 100 palabras.
					* IMPORTANTE: mantén el nombre original de los pokémons.
					* IMPORTANTE: mantén el tipo y fortalezas original de los pokémons.
					* IMPORTANTE: usa esta plantilla para escribir la respuesta: "${PokemonResponseExample.create(captain)}"
					* IMPORTANTE: no añadas ninguna pregunta ni ningún comentario más al final de la respuesta.
					`,
				),
				new Cohere({ apiKey: process.env.COHERE_API_KEY, model: 'command', maxTokens: 1000 }),
			]);

			const response = await chain.invoke({ captain });

			res.status(httpStatus.OK).send(response);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
