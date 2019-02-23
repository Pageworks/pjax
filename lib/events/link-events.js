"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var on_1 = require("./on");
var attrState = 'data-pjax-state';
var isDefaultPrevented = function (el, e) {
    var isPrevented = false;
    if (e.defaultPrevented) {
        isPrevented = true;
    }
    else if (el.getAttribute('prevent-pjax') !== null) {
        isPrevented = true;
    }
    else if (el.classList.contains('no-transition')) {
        isPrevented = true;
    }
    else if (el.getAttribute('download') !== null) {
        isPrevented = true;
    }
    else if (el.getAttribute('target') === '_blank') {
        isPrevented = true;
    }
    return isPrevented;
};
var checkForAbort = function (el, e) {
    if (el instanceof HTMLAnchorElement) {
        if (el.protocol !== window.location.protocol || el.host !== window.location.host) {
            return 'external';
        }
        if (el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, '')) {
            return 'anchor';
        }
        if (el.href === window.location.href.split('#')[0] + ", '#'") {
            return 'anchor-empty';
        }
    }
    return null;
};
var handleClick = function (el, e, pjax) {
    if (isDefaultPrevented(el, e)) {
        return;
    }
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(attrState, attrValue);
        return;
    }
    e.preventDefault();
    var elementLink = el.getAttribute('href');
    if (elementLink === window.location.href.split('#')[0]) {
        el.setAttribute(attrState, 'reload');
    }
    else {
        el.setAttribute(attrState, 'load');
    }
    pjax.handleLoad(elementLink, el.getAttribute(attrState), el);
};
var handleHover = function (el, e, pjax) {
    if (isDefaultPrevented(el, e)) {
        return;
    }
    if (e.type === 'mouseleave') {
        pjax.clearPrefetch();
        return;
    }
    var attrValue = checkForAbort(el, e);
    if (attrValue !== null) {
        el.setAttribute(attrState, attrValue);
        return;
    }
    var elementLink = el.getAttribute('href');
    if (elementLink !== window.location.href.split('#')[0]) {
        el.setAttribute(attrState, 'prefetch');
    }
    else {
        return;
    }
    pjax.handlePrefetch(elementLink);
};
exports.default = (function (el, pjax) {
    el.setAttribute(attrState, '');
    on_1.default(el, 'click', function (e) { handleClick(el, e, pjax); });
    on_1.default(el, 'mouseenter', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'mouseleave', function (e) { handleHover(el, e, pjax); });
    on_1.default(el, 'keyup', function (e) {
        if (e.key === 'enter' || e.keyCode === 13)
            handleClick(el, e, pjax);
    });
});
//# sourceMappingURL=link-events.js.map