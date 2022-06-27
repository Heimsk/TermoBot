"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseManager_1 = require("../structures/BaseManager");
const APICommandParser_1 = require("../structures/APICommandParser");
const fs_1 = require("fs");
const safe_1 = __importDefault(require("colors/safe"));
class CommandManager extends BaseManager_1.BaseManager {
    constructor(client) {
        super(client, 'CommandManager', true);
    }
    async registerCommand(command) {
        try {
            //@ts-ignore
            await this.client.requestHandler.request('POST', `/applications/${this.client.user.id}/${this.client.config.SafeEnv.$DEVMODE ? `guilds/${this.client.config.SafeEnv.$BASE_GUILD_ID}/commands` : `commands`}`, true, command);
        }
        catch (_) {
            throw Error(_);
        }
        return true;
    }
    async unregisterCommand(id) {
        try {
            await this.client.requestHandler.request('DELETE', `/applications/${this.client.user.id}/${this.client.config.SafeEnv.$DEVMODE ? `guilds/${this.client.config.SafeEnv.$BASE_GUILD_ID}/commands` : `commands`}/${id}`, true);
        }
        catch (_) {
            throw Error(_);
        }
        return true;
    }
    async init() {
        let commands = await this.client.requestHandler.request('GET', `/applications/${this.client.user.id}/${this.client.config.SafeEnv.$DEVMODE ? `guilds/${this.client.config.SafeEnv.$BASE_GUILD_ID}/commands` : `commands`}`, true);
        for (let dir of await fs_1.promises.readdir(`${this.client.config.SafeEnv.$HOME}/src/commands`)) {
            for (let file of await fs_1.promises.readdir(`${this.client.config.SafeEnv.$HOME}/src/commands/${dir}`)) {
                let Command = await Promise.resolve().then(() => __importStar(require(`${this.client.config.SafeEnv.$HOME}/src/commands/${dir}/${file}`)));
                let command = new Command.default(this.client);
                if (command) {
                    if (!command.infos) {
                        this.client.logger.warn('The', safe_1.default.green(file), 'command did not have a specified name');
                    }
                    else {
                        this.client.commands.set(command.infos.name, command);
                    }
                }
                let register = true;
                let parsed = (0, APICommandParser_1.APICommandParser)(command);
                if (commands && commands.length > 0) {
                    let apiCmd = commands.find((n) => n.name === parsed.name);
                    if (apiCmd) {
                        register = isDifferent(parsed, apiCmd);
                    }
                    else {
                        register = true;
                    }
                }
                if (register) {
                    try {
                        await this.registerCommand(parsed);
                        this.client.logger.debug('the', safe_1.default.green(parsed.name), 'command has been registered');
                    }
                    catch (_) {
                        this.client.logger.error('There was an error registering the', safe_1.default.green(parsed.name || file), 'command', safe_1.default.red(`${_}`));
                    }
                }
            }
        }
        for (let cmd of commands) {
            if (!this.client.commands.get(cmd.name)) {
                try {
                    if (cmd.id) {
                        await this.unregisterCommand(String(cmd.id));
                    }
                    this.client.logger.warn(`Command ${cmd.name} has been removed.`);
                }
                catch (_) {
                    this.client.logger.error('There was an error removing the', safe_1.default.green(cmd.name), 'command', safe_1.default.red(`${_}`));
                }
            }
        }
        return true;
    }
}
exports.default = CommandManager;
function isDifferent(obj1, obj2) {
    let entries1 = Object.entries(obj1);
    let entries2 = Object.entries(obj2);
    let len = 0;
    if (entries2.find((n) => n[0] === 'id' || n[0] === 'guild_id' || n[0] === 'application_id' || n[0] === 'version' || n[0] === 'default_permission')) {
        for (let entrie of entries2) {
            if (entrie[0] !== 'id' && entrie[0] !== 'guild_id' && entrie[0] !== 'application_id' && entrie[0] !== 'version' && entrie[0] !== 'default_permission') {
                len++;
            }
        }
    }
    else {
        len = entries2.length;
    }
    if (entries1.length != len) {
        return true;
    }
    for (let entrie of entries1) {
        let find = entries2.find((n) => n[0] === entrie[0]);
        if (find) {
            if (Array.isArray(entrie[1]) && Array.isArray(find[1])) {
                if (entrie[1].length != find[1].length)
                    return true;
                for (let i = 0; i < entrie[1].length; i++) {
                    if (isDifferent(entrie[1][i], find[1][i]))
                        return true;
                }
            }
            else {
                if (find[1] !== entrie[1]) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }
    return false;
}
