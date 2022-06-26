import { Client, Collection } from 'eris';
import { promises as fs } from 'fs';
import { ClientConfig } from '../utils/config';
import { BaseManager } from './BaseManager';
import { BaseCommand } from './BaseCommand';
import { Logger } from '../utils/Logger'

interface Game {
  userid: string;
  guildid: string;
}

export class TermoClient extends Client {
  public config: any;
  public commands: Collection<BaseCommand>;
  public games: Array<Game>
  public logger: Logger;
  
  public constructor(token: string, options?: any) {
    super(token, options);
    this.config = ClientConfig;
    this.commands = new Collection(BaseCommand);
    this.games = [];
    this.logger = new Logger({
      showTime: true
    });
  }
  
  public async startManagers(): Promise<any> {
    let managers = await fs.readdir(this.config.SafeEnv.$HOME + '/src/managers');
    let scheduled_managers: Array<BaseManager> = [];
    
    if(managers.length > 0) {
      for(let imanager of managers) {
        let Manager = await import(`${this.config.SafeEnv.$HOME}/src/managers/${imanager}`);
        let manager = new Manager.default(this);
        if(manager.initAfterClientReady) {
          scheduled_managers.push(manager);
        } else {
          this.logger.info(`Initializing ${manager.name}`);
          await manager.init();
          this.logger.success(`${manager.name} initialized`);
        }
      }
      if(scheduled_managers.length > 0) {
        let cb = async () => {
          for(let i = 0; i < scheduled_managers.length; i++) {
            let manager = scheduled_managers[i];
            
            this.logger.info(`Initializing ${manager.name}`);
            await manager.init();
            this.logger.success(`${manager.name} initialized`);
            
            if(i == scheduled_managers.length - 1) {
              this.logger.endTimingTrace();
            }
          }
        }
        super.on('ready', cb);
      } else {
        this.logger.endTimingTrace();
      }
    }
  }
  
  public async init(): Promise<any> {
    this.logger.startTimingTrace();
    this.logger.info(`Initializing client managers...`)
    await this.startManagers();
    return await super.connect();
  }
}