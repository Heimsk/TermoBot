import { BaseEvent } from '../../structures/BaseEvent';
import { TermoClient } from '../../structures/Client';

export default class ReadyEvent extends BaseEvent {
  public constructor() {
    super('ready');
  }
  
  public async execute(client: TermoClient): Promise<boolean> {
    client.logger.success('Bot connected to Discord\'s gateway!')
    return true;
  }
}