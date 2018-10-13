"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var on_1 = require("./on");
var isDefaultPrevented = function (el, e) {
    if (e.defaultPrevented)
        return true;
    else if (el.getAttribute('prevent-default') !== null)
        return true;
    else if (el.classList.contains('no-transition'))
        return true;
    else
        return false;
};
var checkForAbort = function (el, e) {
    if (el.protocol !== window.location.protocol || el.host !== window.location.host)
        return 'external';
    if (el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, ''))
        return 'anchor';
    if (el.href === window.location.href.split('#')[0] + '#')
        return 'anchor-empty';
    return null;
};
var handleClick = function (el, e, pjax) {
    if (isDefaultPrevented(el, e))
        return;
    var eventOptions = {
        triggerElement: el
    };
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(pjax.options.attrState, attrValue);
        return;
    }
    e.preventDefault();
    if (el.href === window.location.href.split('#')[0])
        el.setAttribute(pjax.options.attrState, 'reload');
    else
        el.setAttribute(pjax.options.attrState, 'load');
    pjax.handleLoad(el.href, el.getAttribute(pjax.options.attrState));
};
var handleHover = function (el, e, pjax) {
    if (isDefaultPrevented(el, e))
        return;
    if (e.type === 'mouseout') {
        pjax.clearPrefetch();
        return;
    }
    var eventOptions = {
        triggerElement: el
    };
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(pjax.options.attrState, attrValue);
        return;
    }
    if (el.href !== window.location.href.split('#')[0])
        el.setAttribute(pjax.options.attrState, 'prefetch');
    else
        return;
    pjax.handlePrefetch(el.href, eventOptions);
};
exports.default = (function (el, pjax) {
    el.setAttribute(pjax.options.attrState, '');
    on_1.default(el, 'click', function (e) { handleClick(el, e, pjax); });
    on_1.default(el, 'mouseover', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'mouseout', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'keyup', function (e) {
        if (e.key === 'enter' || e.keyCode === 13)
            handleClick(el, e, pjax);
    });
});
//# sourceMappingURL=link-events.js.map