import mongoose from 'mongoose';

export const dbConnect = () => {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const uri = `mongodb+srv://${user}:${password}@cluster0.sevovxc.mongodb.net/storm?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
