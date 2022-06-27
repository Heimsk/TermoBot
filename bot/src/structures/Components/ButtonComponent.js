"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonComponent = void 0;
class ButtonComponent {
    constructor(label, style, options = {}) {
        let button = {
            type: 2,
            label,
            style,
        };
        if (options) {
            if (options.url)
                button.url = options.url;
            if (options.emoji)
                button.emoji = options.emoji;
            if (options.disabled)
                button.disabled = options.disabled;
            if (options.custom_id)
                button.custom_id = options.custom_id;
        }
        return button;
    }
}
exports.ButtonComponent = ButtonComponent;
