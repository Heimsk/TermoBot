import { BaseManager } from '../structures/BaseManager';
import { TermoClient } from '../structures/Client';
import { promises as fs } from 'fs';

export default class EventManager extends BaseManager {
  public constructor(client: TermoClient) {
    super(client, 'EventManager', false);
  }
  
  public async init(): Promise<boolean> {
    for(let dir of await fs.readdir(`${this.client.config.SafeEnv.$HOME}/src/events`)) {
      for(let file of await fs.readdir(`${this.client.config.SafeEnv.$HOME}/src/events/${dir}`)) {
        let Event = await import(`${this.client.config.SafeEnv.$HOME}/src/events/${dir}/${file}`);
        const event = new Event.default();
        
        if(!event.name) console.log(`Event: \'${file}\' has no name`);
        else this.client.on(event.name, event.execute.bind(null, this.client));
      }
    }
    return true;
  }
}