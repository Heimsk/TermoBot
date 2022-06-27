"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvent_1 = require("../../structures/BaseEvent");
class ReadyEvent extends BaseEvent_1.BaseEvent {
    constructor() {
        super('ready');
    }
    async execute(client) {
        client.logger.success('Bot connected to Discord\'s gateway!');
        return true;
    }
}
exports.default = ReadyEvent;
