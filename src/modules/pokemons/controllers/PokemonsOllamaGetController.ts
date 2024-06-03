import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { PokemonResponseExample } from '../shared/utils/PokemonResponseExample';

export class PokemonsOllamaGetController {
	async run(req: Request, res: Response): Promise<void> {
		try {
			const { searchParams } = new URL(req.url, 'http://localhost:5000');
			const captain = searchParams.get('captain') ?? '';

			const chain = RunnableSequence.from([
				PromptTemplate.fromTemplate('{captain}'),
				SystemMessagePromptTemplate.fromTemplate(
					`
					* Forma el equipo ideal para ganar la liga pokémon.
					* IMPORTANTE: el equipo debe tener 4 pokémons.
					* IMPORTANTE: el capitán del equipo es ${captain} y debe ser el primero que recomiendes, indicando que es el capitán.
					* Responde en castellano
					* Responde en máximo 100 palabras.
					* IMPORTANTE: mantén el nombre original de los pokémons.
					* IMPORTANTE: mantén el tipo y fortalezas original de los pokémons.
					* IMPORTANTE: usa esta plantilla para escribir la respuesta: "${PokemonResponseExample.create(captain)}"
					`,
				),
				new Ollama({ model: 'gemma:2b' }),
			]);

			const response = await chain.invoke({ captain });

			res.status(httpStatus.OK).send(response);
		} catch (error) {
			console.error(error);
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
		}
	}
}
