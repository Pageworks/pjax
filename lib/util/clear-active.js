"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    if (document.activeElement) {
        try {
            document.activeElement.blur();
        }
        catch (e) {
            console.log(e);
        }
    }
});
//# sourceMappingURL=clear-active.js.map