import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  BASE_URL: process.env.BASE_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS,
  CLIENT_ROOT_URL: process.env.CLIENT_ROOT_URL,
  SSL_STORE_ID: process.env.SSL_STORE_ID,
  SSL_STORE_API_KEY: process.env.SSL_STORE_API_KEY,
  SSL_API_URL: process.env.SSL_API_URL,
};
