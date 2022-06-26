import { TermoClient } from '../../structures/Client';
import { BaseCommand } from '../../structures/BaseCommand';

export default class PingCmd extends BaseCommand {
  public constructor(client: TermoClient) {
    super(client, {
      name: 'ping',
      description: 'Um simples comando para ver a latência do bot.',
    });
  }
  
  public async execute(ctx: any): Promise<boolean> {
    await ctx.reply({ content: `(💫 Shard ${ctx.guild.shard.id + 1}/${this.client.shards.size})\nWebSocket ~ **${ctx.guild.shard.latency}**ms` });
    return true;
  }
}