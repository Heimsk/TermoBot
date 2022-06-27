import { BaseCommand } from '../../structures/BaseCommand';
import { CTXParser } from '../../structures/CTXParser';
import { TermoClient } from '../../structures/Client';

export default class ServerCommand extends BaseCommand {
  public constructor(client: TermoClient) {
    super(client, {
      name: "servidor",
      description: "Use esse comando para conseguir o link de convite para o meu servidor de suporte!"
    });
  }
  
  public async execute(ctx: CTXParser) {
    try {
      await ctx.reply({ content: this.client.config.server_link }, { ephemeral: true });
    } catch(_) {
      await this.sendErrorMsg(ctx, _);
    }
    
    return true;
  }
}