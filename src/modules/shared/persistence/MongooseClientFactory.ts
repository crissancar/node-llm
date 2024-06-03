import mongoose from 'mongoose';

import { MongooseClient } from './types/MongooseClient';

export class MongooseClientFactory {
	public static async createClient(): Promise<MongooseClient> {
		const mongooseClient = await mongoose.connect(process.env.MONGO_URL);
		console.log('Mongoose client connected successfully');

		return mongooseClient.connection;
	}
}
