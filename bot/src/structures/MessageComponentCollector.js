"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageComponentCollector = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const CTXParser_1 = require("./CTXParser");
class MessageComponentCollector extends eventemitter3_1.default {
    constructor(client, options) {
        super();
        if (!client)
            throw Error('missing client');
        if (!options)
            throw Error('missing options');
        this.options = options;
        this.client = client;
        this.filter = options.filter;
        this.ended = false;
        this.count = 0;
        this.callback = (int) => {
            if (int.t === 'INTERACTION_CREATE') {
                if (int.d.type === 3 || int.d.type == 5) {
                    if (!this.ended) {
                        if (this.filter) {
                            if (!this.filter(int.d?.message, int.d?.member?.user, int.d?.data?.custom_id))
                                return;
                        }
                        ;
                        let component = new CTXParser_1.CTXParser(int.d, this.client);
                        super.emit('collect', component);
                        this.count++;
                        if (options.max && options.max <= this.count) {
                            super.removeListener('rawWS', this.callback);
                            super.emit('end', 'attempts');
                            this.ended = true;
                        }
                    }
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
        this.client.on('rawWS', this.callback);
    }
    end(reason) {
        super.emit('end', reason || 'ended');
        super.removeListener('rawWS', this.callback);
        this.ended = true;
    }
}
exports.MessageComponentCollector = MessageComponentCollector;
