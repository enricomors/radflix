import mongoose from 'mongoose';

import Item from './item';

const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'mongodb://localhost:27017/radixdlt-test'
const connectDb = () => {
  return mongoose.connect( dbUrl );
};

const models = { Item };

export { connectDb };

export default models;