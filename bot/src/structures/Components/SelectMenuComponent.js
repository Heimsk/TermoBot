"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectMenuComponent = void 0;
class SelectMenuComponent {
    constructor(customID, selections, options = {}) {
        let selectmenu = {
            type: 3,
            custom_id: customID,
            options: selections
        };
        if (options) {
            ['placeholder', 'min_values', 'max_values', 'disabled'].forEach((opt) => {
                if (options[opt]) {
                    //@ts-ignore
                    selectmenu[opt] = options[opt];
                }
            });
        }
        return selectmenu;
    }
}
exports.SelectMenuComponent = SelectMenuComponent;
