import config from '../../config';

export const sslConfig = {
  store_id: config.SSL_STORE_ID,
  store_passwd: config.SSL_STORE_API_KEY,
  isSandboxMode: true,
  //   is_live: false, // set to true for production mode
  //   API_URL: config.SSL_API_URL,
};
