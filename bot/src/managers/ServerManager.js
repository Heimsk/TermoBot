"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseManager_1 = require("../structures/BaseManager");
const express_1 = __importDefault(require("express"));
class ServerManager extends BaseManager_1.BaseManager {
    constructor(client) {
        super(client, 'ServerManager', false);
    }
    async init() {
        let server = (0, express_1.default)();
        server.get('/', (req, res) => {
            res.send('Hello World!');
        });
        server.listen(8080);
        return true;
    }
}
exports.default = ServerManager;
