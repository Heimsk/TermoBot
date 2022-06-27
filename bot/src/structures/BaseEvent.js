"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEvent = void 0;
class BaseEvent {
    constructor(name) {
        if (!name)
            throw Error('Event is missing name');
        this.name = name;
    }
}
exports.BaseEvent = BaseEvent;
