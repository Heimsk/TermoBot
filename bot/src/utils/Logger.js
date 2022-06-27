"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const safe_1 = __importDefault(require("colors/safe"));
class Logger {
    constructor(config) {
        this.date = 0;
        this.initialDate = 0;
        this.timingtrace = false;
        this.config = config;
    }
    startTimingTrace() {
        this.date = Date.now();
        this.initialDate = this.date;
        this.timingtrace = true;
        console.log('~~~~~~~~~~~ Start of timing trace ~~~~~~~~~~~\n');
    }
    endTimingTrace() {
        if (!this.timingtrace) {
            return;
        }
        this.timingtrace = false;
        console.log(`\n~~~~~~~~~~~ End of timing trace ~~~~~~~~~~~\nTime spent:`, safe_1.default.green(`${(Date.now() - this.initialDate) / 1000}s`));
    }
    success(...text) {
        console.log(safe_1.default.green(safe_1.default.bold('SUCCESS')), `🟢`, (this.config.showTime ? `[ ${safe_1.default.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? safe_1.default.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
        if (this.timingtrace) {
            this.date = Date.now();
        }
    }
    info(...text) {
        console.log(safe_1.default.blue(safe_1.default.bold('INFO')), `🔵`, (this.config.showTime ? `[ ${safe_1.default.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? safe_1.default.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
        if (this.timingtrace) {
            this.date = Date.now();
        }
    }
    debug(...text) {
        console.log(safe_1.default.magenta(safe_1.default.bold('DEBUG')), `🟣`, (this.config.showTime ? `[ ${safe_1.default.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? safe_1.default.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
        if (this.timingtrace) {
            this.date = Date.now();
        }
    }
    warn(...text) {
        console.log(safe_1.default.yellow(safe_1.default.bold('WARN')), `🟡`, (this.config.showTime ? `[ ${safe_1.default.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? safe_1.default.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
        if (this.timingtrace) {
            this.date = Date.now();
        }
    }
    error(...text) {
        console.log(safe_1.default.red(safe_1.default.bold('ERROR')), `🔴`, (this.config.showTime ? `[ ${safe_1.default.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')));
    }
    fatal(...text) {
        console.log(safe_1.default.bgRed(safe_1.default.bold('FATAL')), `🔴🔴🔴`, (this.config.showTime ? `[ ${safe_1.default.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')));
    }
}
exports.Logger = Logger;
