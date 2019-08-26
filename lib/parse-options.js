"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (options) {
    if (options === void 0) { options = null; }
    var parsedOptions = (options !== null) ? options : {};
    parsedOptions.elements = (options !== null && options.elements !== undefined) ? options.elements : 'a[href]';
    parsedOptions.selectors = (options !== null && options.selectors !== undefined) ? options.selectors : ['.js-pjax'];
    parsedOptions.history = (options !== null && options.history !== undefined) ? options.history : true;
    parsedOptions.cacheBust = (options !== null && options.cacheBust !== undefined) ? options.cacheBust : false;
    parsedOptions.debug = (options !== null && options.debug !== undefined) ? options.debug : false;
    parsedOptions.titleSwitch = (options !== null && options.titleSwitch !== undefined) ? options.titleSwitch : true;
    parsedOptions.customTransitions = (options !== null && options.customTransitions !== undefined) ? options.customTransitions : false;
    parsedOptions.customPreventionAttributes = (options !== null && options.customPreventionAttributes !== undefined) ? options.customPreventionAttributes : [];
    parsedOptions.importScripts = (options !== null && options.importScripts !== undefined) ? options.importScripts : true;
    parsedOptions.importCSS = (options !== null && options.importCSS !== undefined) ? options.importCSS : true;
    parsedOptions.scriptImportLocation = (options !== null && options.scriptImportLocation !== undefined && options.scriptImportLocation instanceof HTMLElement) ? options.scriptImportLocation : document.head;
    parsedOptions.requireCssBeforeComplete = (options !== null && options.requireCssBeforeComplete !== undefined) ? options.requireCssBeforeComplete : false;
    return parsedOptions;
});
//# sourceMappingURL=parse-options.js.map