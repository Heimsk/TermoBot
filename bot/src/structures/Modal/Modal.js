"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
class Modal {
    constructor(title, customID, ...components) {
        let modal = {
            title,
            custom_id: customID,
            components: components
        };
        return modal;
    }
}
exports.Modal = Modal;
