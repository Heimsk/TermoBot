import { BaseEvent } from '../../structures/BaseEvent';
import { TermoClient } from '../../structures/Client';
import { CTXParser } from '../../structures/CTXParser';
import colors from 'colors/safe';

export default class InteractionEvent extends BaseEvent {
  public constructor() {
    super('rawWS')
  }
  
  public async execute(client: TermoClient, int: any): Promise<boolean> {
    if(int && int.t === 'INTERACTION_CREATE') {
      let ctx = new CTXParser(int.d, client);
      if(ctx.command) {
        try {
          await ctx.command.execute(ctx);
          client.logger.info(`Command`, colors.green(`/${ctx.commandName || ''}`), 'has been executed in', colors.green(ctx.guild?.name || ''), 'guild');
        } catch(_: any) {
          client.logger.error('There was an error running the', colors.green(ctx?.command?.infos?.name || ''),  'command:', colors.red(`${_}`))
        }
      }
    }
    return true;
  }
}