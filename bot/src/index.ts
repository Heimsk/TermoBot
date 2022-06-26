import 'dotenv/config';
import { TermoClient } from './structures/Client';

(async () => {
  let client = new TermoClient(process.env.TOKEN || '');
  await client.init();
})();