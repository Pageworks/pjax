"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_elements_1 = require("./util/get-elements");
var check_element_1 = require("./util/check-element");
exports.default = (function (el, pjax) {
    var elements = get_elements_1.default(el);
    if (pjax.options.debug && elements.length === 0) {
        console.log('No elements could be found! Check your Pjax options object.');
        return;
    }
    for (var i = 0; i < elements.length; i++) {
        check_element_1.default(elements[i], pjax);
    }
});
//# sourceMappingURL=parse-dom.js.map