import { Schema, model } from 'mongoose';
import { Storm } from '../entities/storm.entities.js';

const stormSchema = new Schema<Storm>({
  title: {
    type: String,
    unique: true,
  },
  image: {
    type: {
      id: String,
      width: Number,
      height: Number,
      format: String,
      url: String,
    },
  },
  ubication: {
    type: String,
  },
  description: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

stormSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const StormModel = model('Storm', stormSchema, 'storms');
