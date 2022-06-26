import { BaseManager } from '../structures/BaseManager';
import { TermoClient } from '../structures/Client';
import Express from 'express';

export default class ServerManager extends BaseManager {
  public constructor(client: TermoClient) {
    super(client, 'ServerManager', false);
  }
  
  public async init(): Promise<boolean> {
    let server = Express();
    
    server.get('/', (req: any, res: any) => {
      res.send('Hello World!');
    })
    
    server.listen(8080);
    return true;
  }
}