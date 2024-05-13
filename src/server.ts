/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';

const port = process.env.PORT || 5000;

let server: Server;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvrai.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });

const main = async () => {
  try {
    // await client.connect();
    // export const toolCollection = client.db('sks-inc').collection('tools');
    // export const userCollection = client.db('sks-inc').collection('users');
    // export const orderCollection = client.db('sks-inc').collection('orders');
    // export const paymentCollection = client
    //   .db('sks-inc')
    //   .collection('payments');
    // export const reviewCollection = client.db('sks-inc').collection('reviews');

    server = app.listen(port, () => {
      console.log('Inventory Management Server is Listening on port:', port);
    });
  } catch (err) {
    console.log(err);
  }
};

main();

process.on('unhandledRejection', () => {
  console.log(
    'unhandledRejection is detected. Server is being shutting down..',
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('uncaughtException occurred. Server is being shutting down..');
  process.exit(1);
});

/**
 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
 */
