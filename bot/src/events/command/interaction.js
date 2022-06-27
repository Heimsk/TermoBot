"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("../../structures/BaseEvent");
const CTXParser_1 = require("../../structures/CTXParser");
const safe_1 = __importDefault(require("colors/safe"));
class InteractionEvent extends BaseEvent_1.BaseEvent {
    constructor() {
        super('rawWS');
    }
    async execute(client, int) {
        if (int && int.t === 'INTERACTION_CREATE') {
            let ctx = new CTXParser_1.CTXParser(int.d, client);
            if (ctx.command) {
                try {
                    await ctx.command.execute(ctx);
                    client.logger.info(`Command`, safe_1.default.green(`/${ctx.commandName || ''}`), 'has been executed in', safe_1.default.green(ctx.guild?.name || ''), 'guild');
                }
                catch (_) {
                    client.logger.error('There was an error running the', safe_1.default.green(ctx?.command?.infos?.name || ''), 'command:', safe_1.default.red(`${_}`));
                }
            }
        }
        return true;
    }
}
exports.default = InteractionEvent;
