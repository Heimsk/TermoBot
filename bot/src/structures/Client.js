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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermoClient = void 0;
const eris_1 = require("eris");
const fs_1 = require("fs");
const config_1 = require("../utils/config");
const BaseCommand_1 = require("./BaseCommand");
const Logger_1 = require("../utils/Logger");
class TermoClient extends eris_1.Client {
    constructor(token, options) {
        super(token, options);
        this.config = config_1.ClientConfig;
        this.commands = new eris_1.Collection(BaseCommand_1.BaseCommand);
        this.games = [];
        this.logger = new Logger_1.Logger({
            showTime: true
        });
    }
    async startManagers() {
        let managers = await fs_1.promises.readdir(this.config.SafeEnv.$HOME + '/src/managers');
        let scheduled_managers = [];
        if (managers.length > 0) {
            for (let imanager of managers) {
                let Manager = await Promise.resolve().then(() => __importStar(require(`${this.config.SafeEnv.$HOME}/src/managers/${imanager}`)));
                let manager = new Manager.default(this);
                if (manager.initAfterClientReady) {
                    scheduled_managers.push(manager);
                }
                else {
                    this.logger.info(`Initializing ${manager.name}`);
                    await manager.init();
                    this.logger.success(`${manager.name} initialized`);
                }
            }
            if (scheduled_managers.length > 0) {
                let cb = async () => {
                    for (let i = 0; i < scheduled_managers.length; i++) {
                        let manager = scheduled_managers[i];
                        this.logger.info(`Initializing ${manager.name}`);
                        await manager.init();
                        this.logger.success(`${manager.name} initialized`);
                        if (i == scheduled_managers.length - 1) {
                            this.logger.endTimingTrace();
                        }
                    }
                };
                super.on('ready', cb);
            }
            else {
                this.logger.endTimingTrace();
            }
        }
    }
    async init() {
        this.logger.startTimingTrace();
        this.logger.info(`Initializing client managers...`);
        await this.startManagers();
        return await super.connect();
    }
}
exports.TermoClient = TermoClient;
