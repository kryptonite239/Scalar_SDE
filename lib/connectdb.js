import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection.readyState >= 1) {
      return Promise.resolve(true);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
export default connectMongo;
