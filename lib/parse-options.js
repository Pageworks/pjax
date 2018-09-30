"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parsedOptions;
exports.default = (function (options) {
    parsedOptions = options || {};
    parsedOptions.elements = options.elements || 'a[href]';
    parsedOptions.selectors = options.selectors || ['title', '.js-pjax'];
    parsedOptions.switches = options.switches || {};
    parsedOptions.history = (typeof options.history === undefined) ? true : options.history;
    parsedOptions.scrollTo = (typeof options.scrollTo === undefined) ? 0 : options.scrollTo;
    parsedOptions.cacheBust = (typeof options.cacheBust === undefined) ? true : options.cacheBust;
    parsedOptions.debug = options.debug || false;
    parsedOptions.timeout = options.timeout || 0;
    return parsedOptions;
});
//# sourceMappingURL=parse-options.js.map