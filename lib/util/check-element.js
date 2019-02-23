"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var link_events_1 = require("../events/link-events");
exports.default = (function (el, pjax) {
    if (el.getAttribute('href')) {
        link_events_1.default(el, pjax);
    }
    else {
        if (pjax.options.debug) {
            console.log(el + " is missing a href attribute. Pjax can't assign listeners.");
        }
    }
});
//# sourceMappingURL=check-element.js.map