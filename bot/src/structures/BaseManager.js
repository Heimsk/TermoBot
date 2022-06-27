"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseManager = void 0;
class BaseManager {
    constructor(client, name, initAfterClientReady = false) {
        this.client = client;
        this.name = name;
        this.initAfterClientReady = initAfterClientReady;
    }
    async init() {
        return true;
    }
}
exports.BaseManager = BaseManager;
