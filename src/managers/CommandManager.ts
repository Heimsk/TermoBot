import { TermoClient } from '../structures/Client';
import { BaseManager } from '../structures/BaseManager';
import { APICommandParser, APICommand } from '../structures/APICommandParser';
import { promises as fs } from 'fs';
import colors from 'colors/safe';

export default class CommandManager extends BaseManager {
  public constructor(client: TermoClient) {
    super(client, 'CommandManager', true);
  }
  
  public async registerCommand(command: APICommand): Promise<any> {
    try {
      //@ts-ignore
      await this.client.requestHandler.request('POST', `/applications/${this.client.user.id}/${this.client.config.SafeEnv.$DEVMODE ? `guilds/${this.client.config.SafeEnv.$BASE_GUILD_ID}/commands` : `commands`}`, true, command);
    } catch(_: any) {
      throw Error(_);
    }
    
    return true;
  }
  
  public async unregisterCommand(id: string): Promise<any> {
    try {
      await this.client.requestHandler.request('DELETE', `/applications/${this.client.user.id}/${this.client.config.SafeEnv.$DEVMODE ? `guilds/${this.client.config.SafeEnv.$BASE_GUILD_ID}/commands` : `commands`}/${id}`, true);
    } catch(_: any) {
      throw Error(_);
    }
    
    return true;
  }
  
  public async init(): Promise<boolean> {
    let commands = await this.client.requestHandler.request('GET', `/applications/${this.client.user.id}/${this.client.config.SafeEnv.$DEVMODE ? `guilds/${this.client.config.SafeEnv.$BASE_GUILD_ID}/commands` : `commands`}`, true) as Array<APICommand>
    for(let dir of await fs.readdir(`${this.client.config.SafeEnv.$HOME}/src/commands`)) {
      for(let file of await fs.readdir(`${this.client.config.SafeEnv.$HOME}/src/commands/${dir}`)) {
        let Command = await import(`${this.client.config.SafeEnv.$HOME}/src/commands/${dir}/${file}`);
        let command = new Command.default(this.client);
        
        if(command) {
          if(!command.infos) {
            this.client.logger.warn('The', colors.green(file), 'command did not have a specified name')
          } else {
            this.client.commands.set(command.infos.name, command);
          }
        }
        
        let register: boolean = true;
        let parsed = APICommandParser(command);
        if(commands && commands.length > 0) {
          let apiCmd = commands.find((n: APICommand) => n.name === parsed.name);
          if(apiCmd) {
            register = isDifferent(parsed, apiCmd);
          } else {
            register = true;
          }
        }
        
        if(register) {
          try {
            await this.registerCommand(parsed);
            this.client.logger.debug('the', colors.green(parsed.name), 'command has been registered')
          } catch(_) {
            this.client.logger.error('There was an error registering the', colors.green(parsed.name || file), 'command', colors.red(`${_}`));
          }
        }
      }
    }
    
    for(let cmd of commands) {
      if(!this.client.commands.get(cmd.name)) {
        try {
          if(cmd.id) {
            await this.unregisterCommand(String(cmd.id));
          }
          this.client.logger.warn(`Command ${cmd.name} has been removed.`);
        } catch(_) {
          this.client.logger.error('There was an error removing the', colors.green(cmd.name), 'command', colors.red(`${_}`));
        }
      }
    }
    
    return true;
  }
}

function isDifferent(obj1: any, obj2: any): boolean {
  let entries1 = Object.entries(obj1);
  let entries2 = Object.entries(obj2);
  
  let len = 0;
  if(entries2.find((n: any) => n[0] === 'id' || n[0] === 'guild_id' || n[0] === 'application_id' || n[0] === 'version' || n[0] === 'default_permission')) {
    for(let entrie of entries2) {
      if(entrie[0] !== 'id' && entrie[0] !== 'guild_id' && entrie[0] !== 'application_id' && entrie[0] !== 'version' && entrie[0] !== 'default_permission') {
        len++;
      }
    }
  } else {
    len = entries2.length;
  }
  
  if(entries1.length !=  len) {
    return true;
  }
  
  for(let entrie of entries1) {
    let find = entries2.find((n: any) => n[0] === entrie[0]);
    
    if(find) {
      if(Array.isArray(entrie[1]) && Array.isArray(find[1])) {
        if(entrie[1].length != find[1].length) return true;
        
        for(let i = 0; i < entrie[1].length; i++) {
          if(isDifferent(entrie[1][i], find[1][i])) return true;
        }
      } else {
        if(find[1] !== entrie[1]) {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  
  return false;
}