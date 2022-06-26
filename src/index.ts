import env from 'dotenv';
import { TermoClient } from './structures/Client';

env.config();
(async () => {
  let client = new TermoClient(process.env.TOKEN || '');
  await client.init();
})();