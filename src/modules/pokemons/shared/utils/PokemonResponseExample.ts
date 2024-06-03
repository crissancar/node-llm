export class PokemonResponseExample {
	static create(name: string): string {
		return `
		Hola, soy Ash Ketchum y te voy a enseñar a crear el mejor equipo pokémon.
		
		El pokémon capitán del equipo es ${name}.
		
		Para completar el equipo, he elegido estos 3 pokémons:
		
		1- (Indica el tipo y las fortalezas de este pokémon).
		2- (Indica el tipo y las fortalezas de este pokémon).
		3- (Indica el tipo y las fortalezas de este pokémon).\n
		`;
	}
}
