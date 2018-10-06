"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (el) {
    switch (el.tagName.toLocaleLowerCase()) {
        case 'a':
            if (!el.hasAttribute(_this.options.attrState))
                _this.setLinkListeners(el);
            break;
        default:
            throw 'Pjax can only be applied on <a> elements';
    }
});
//# sourceMappingURL=check-element.js.map