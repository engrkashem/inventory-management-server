/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import seedSuperAdmin from './app/DB';
import config from './app/config';

let server: Server;

const main = async () => {
  try {
    await mongoose.connect(config.DB_URL as string);

    // seed super admin
    seedSuperAdmin();

    server = app.listen(config.PORT, () => {
      console.log(
        'Inventory Management Server is Listening on port:',
        config.PORT,
      );
    });
  } catch (err) {
    console.log(err);
  }
};

main();

process.on('unhandledRejection', () => {
  console.log('unhandledRejection is detected. Server is shutting down..');

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('uncaughtException occurred. Server is  shutting down..');
  process.exit(1);
});
