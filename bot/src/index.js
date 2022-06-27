"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Client_1 = require("./structures/Client");
dotenv_1.default.config();
(async () => {
    let client = new Client_1.TermoClient(process.env.TOKEN || '');
    await client.init();
})();
