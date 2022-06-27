"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalTextInput = void 0;
class ModalTextInput {
    constructor(customID, style, label, options = {}) {
        let input = {
            type: 4,
            custom_id: customID,
            label,
            style
        };
        if (options) {
            ['placeholder', 'min_length', 'max_length', 'required', 'value'].forEach((opt) => {
                if (options[opt]) {
                    //@ts-ignore
                    input[opt] = options[opt];
                }
            });
        }
        return input;
    }
}
exports.ModalTextInput = ModalTextInput;
