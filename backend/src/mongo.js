import dotenv from 'dotenv-defaults';
import mongoose from 'mongoose';

export default { 
  connect: () => {
    dotenv.config();
    if (!process.env.MONGO_URL) {
      console.error("Missing MONGO_URL in .env");
      process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log("MongoDB Connection Created.")
    });

    mongoose.connection.on('error', console.error.bind(console, '[MongoDB Connection Error]'));
  }
};   