import { model, Schema } from 'mongoose';

const schema = new Schema({
	_id: { type: String, default: undefined },
	text: { type: String, required: true },
	embedding: { type: [Number], required: true },
	file: { type: String, required: true },
	source: { type: String, required: true },
	line: { type: Number, required: false },
	createdAt: { type: Date },
});

export const TrainingEmbeddingShema = model('TrainingEmbedding', schema);
