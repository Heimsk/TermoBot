"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = require("../../structures/BaseCommand");
class PingCmd extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Um simples comando para ver a latência do bot.',
        });
    }
    async execute(ctx) {
        await ctx.reply({ content: `(💫 Shard ${ctx.guild.shard.id + 1}/${this.client.shards.size})\nWebSocket ~ **${ctx.guild.shard.latency}**ms` });
        return true;
    }
}
exports.default = PingCmd;
