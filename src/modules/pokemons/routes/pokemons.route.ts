/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';

import { PokemonsCohereGetController } from '../controllers/PokemonsCohereGetController';
import { PokemonsOllamaGetController } from '../controllers/PokemonsOllamaGetController';

export function register(router: Router): void {
	const ollamaGetController = new PokemonsOllamaGetController();
	router.get('/pokemons/ollama', (req, res) => ollamaGetController.run(req, res));

	const cohereGetController = new PokemonsCohereGetController();
	router.get('/pokemons/cohere', (req: Request, res: Response) =>
		cohereGetController.run(req, res),
	);
}
