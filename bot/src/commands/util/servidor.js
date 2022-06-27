"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = require("../../structures/BaseCommand");
class ServerCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "servidor",
            description: "Use esse comando para conseguir o link de convite para o meu servidor de suporte!"
        });
    }
    async execute(ctx) {
        try {
            await ctx.reply({ content: this.client.config.server_link }, { ephemeral: true });
        }
        catch (_) {
            await this.sendErrorMsg(ctx, _);
        }
        return true;
    }
}
exports.default = ServerCommand;
