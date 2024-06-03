import { model, Schema } from 'mongoose';

const schema = new Schema({
	_id: { type: String, default: undefined },
	text: { type: String, required: true },
	embedding: { type: [Number], required: true },
	file: { type: String, required: true },
	source: { type: String, required: true },
	// loc: { type: Object, required: true },
});

export const EmbeddingShema = model('Embedding', schema);
