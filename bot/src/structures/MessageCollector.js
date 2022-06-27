"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCollector = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
class MessageCollector extends eventemitter3_1.default {
    constructor(client, options) {
        super();
        if (!client)
            throw Error('missing client');
        if (!options)
            throw Error('missing options');
        this.options = options;
        this.client = client;
        this.filter = options.filter;
        this.channel_id = options.channel_id;
        this.ended = false;
        this.count = 0;
        this.callback = (message) => {
            if (this.channel_id == message.channel.id && !this.ended) {
                if (this.filter && !this.filter(message.channel, message.author))
                    return;
                super.emit('collect', message);
                this.count++;
                if (options.max && options.max <= this.count) {
                    super.removeListener('rawWS', this.callback);
                    super.emit('end', 'attempts');
                    this.ended = true;
                }
            }
        };
        if (this.options.timeout) {
            setTimeout(() => {
                if (this.ended)
                    return;
                super.removeListener('rawWS', this.callback);
                super.emit('end', 'time');
                this.ended = true;
            }, this.options.timeout);
        }
        this.client.on('messageCreate', this.callback);
    }
    end(reason) {
        super.emit('end', reason || 'ended');
        super.removeListener('rawWS', this.callback);
        this.ended = true;
    }
}
exports.MessageCollector = MessageCollector;
