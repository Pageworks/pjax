"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parse_options_1 = require("./lib/parse-options");
var uuid_1 = require("./lib/uuid");
var trigger_1 = require("./lib/events/trigger");
var parse_dom_1 = require("./lib/parse-dom");
var scroll_1 = require("./lib/util/scroll");
var Pjax = (function () {
    function Pjax(options) {
        var _this = this;
        this.handleContinue = function (e) {
            if (_this.cachedSwitch !== null) {
                if (_this.options.titleSwitch) {
                    document.title = _this.cachedSwitch.title;
                }
                _this.handleSwitches(_this.cachedSwitch.queue);
            }
            else {
                if (_this.options.debug) {
                    console.log('Switch queue was empty. You might be sending `pjax:continue` too fast.');
                }
                trigger_1.default(document, ['pjax:error']);
            }
        };
        if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
            console.log('IE 11 detected - fuel-pjax aborted!');
            return;
        }
        this.state = {};
        this.cache = null;
        this.options = parse_options_1.default(options);
        this.lastUUID = uuid_1.default();
        this.request = null;
        this.confirmed = false;
        this.cachedSwitch = null;
        this.scrollPos = this.options.scrollTo;
        if (this.options.debug) {
            console.log('Pjax Options:', this.options);
        }
        this.init();
    }
    Pjax.prototype.init = function () {
        if (this.options.customTransitions) {
            document.addEventListener('pjax:continue', this.handleContinue);
        }
        parse_dom_1.default(document.body, this);
    };
    Pjax.prototype.abortRequest = function () {
        if (this.request === null) {
            return;
        }
        if (this.request.readyState !== 4) {
            this.request.abort();
        }
        this.request = null;
    };
    Pjax.prototype.handlePushState = function () {
        if (this.state.history) {
            if (this.options.debug) {
                console.log('Pushing History State: ', this.state);
            }
            this.lastUUID = uuid_1.default();
            window.history.pushState({
                url: this.state.url,
                title: this.state.title,
                uuid: this.lastUUID,
                scrollPos: [0, 0]
            }, this.state.title, this.state.url);
        }
        else {
            if (this.options.debug) {
                console.log('Replacing History State: ', this.state);
            }
            this.lastUUID = uuid_1.default();
            window.history.replaceState({
                url: this.state.url,
                title: this.state.title,
                uuid: this.lastUUID,
                scrollPos: [0, 0]
            }, document.title);
        }
    };
    Pjax.prototype.finalize = function () {
        if (this.options.debug) {
            console.log('Finishing Pjax');
        }
        this.state.url = this.request.responseURL;
        this.state.title = document.title;
        this.state.scrollPos = [window.scrollX, window.scrollY];
        scroll_1.default(this.scrollPos);
        this.cache = null;
        this.state = {};
        this.request = null;
        this.confirmed = false;
        this.cachedSwitch = null;
        trigger_1.default(document, ['pjax:complete']);
    };
    Pjax.prototype.handleSwitches = function (switchQueue) {
        for (var i = 0; i < switchQueue.length; i++) {
            switchQueue[i].current.innerHTML = switchQueue[i].new.innerHTML;
            parse_dom_1.default(switchQueue[i].current, this);
        }
        this.finalize();
    };
    Pjax.prototype.switchSelectors = function (selectors, tempDocument, currentDocument) {
        var switchQueue = [];
        var contiansScripts = false;
        for (var i = 0; i < selectors.length; i++) {
            var newContainers = Array.from(tempDocument.querySelectorAll(selectors[i]));
            var currentContainers = Array.from(currentDocument.querySelectorAll(selectors[i]));
            if (this.options.debug) {
                console.log('Pjax Switch Selector: ', selectors[i], newContainers, currentContainers);
            }
            if (newContainers.length !== currentContainers.length) {
                if (this.options.debug) {
                    console.log('DOM doesn\'t look the same on the new page');
                }
                this.lastChance(this.request.responseURL);
                return;
            }
            for (var k = 0; k < newContainers.length; k++) {
                var scripts = Array.from(newContainers[k].querySelectorAll('script'));
                if (scripts.length > 0) {
                    contiansScripts = true;
                    return;
                }
                var newContainer = newContainers[k];
                var currentContainer = currentContainers[k];
                var switchObject = {
                    new: newContainer,
                    current: currentContainer
                };
                switchQueue.push(switchObject);
            }
        }
        if (switchQueue.length === 0) {
            if (this.options.debug) {
                console.log('Couldn\'t find anything to switch');
            }
            this.lastChance(this.request.responseURL);
            return;
        }
        if (contiansScripts) {
            if (this.options.debug) {
                console.log('New page contains script elements.');
            }
            this.lastChance(this.request.responseURL);
            return;
        }
        if (!this.options.customTransitions) {
            if (this.options.titleSwitch) {
                document.title = tempDocument.title;
            }
            this.handleSwitches(switchQueue);
        }
        else {
            this.cachedSwitch = {
                queue: switchQueue,
                title: tempDocument.title
            };
        }
    };
    Pjax.prototype.lastChance = function (uri) {
        if (this.options.debug) {
            console.log("Something went wrong, native loading " + uri);
        }
        window.location.href = uri;
    };
    Pjax.prototype.statusCheck = function () {
        for (var status_1 = 200; status_1 <= 206; status_1++) {
            if (this.cache.status === status_1) {
                return true;
            }
        }
        return false;
    };
    Pjax.prototype.clearActiveElement = function () {
        if (document.activeElement) {
            try {
                document.activeElement.blur();
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    Pjax.prototype.loadCachedContent = function () {
        if (!this.statusCheck()) {
            this.lastChance(this.cache.url);
            return;
        }
        this.clearActiveElement();
        this.switchSelectors(this.options.selectors, this.cache.document, document);
    };
    Pjax.prototype.parseContent = function (responseText) {
        var tempDocument = document.implementation.createHTMLDocument('pjax-temp-document');
        var htmlRegex = /<html[^>]+>/gi;
        var matches = responseText.match(htmlRegex);
        if (matches.length !== 0) {
            tempDocument.documentElement.innerHTML = responseText;
            return tempDocument;
        }
        return null;
    };
    Pjax.prototype.cacheContent = function (responseText, responseStatus, uri) {
        var tempDocument = this.parseContent(responseText);
        if (tempDocument instanceof HTMLDocument) {
            this.cache = {
                status: responseStatus,
                document: tempDocument,
                url: uri
            };
            if (this.options.debug) {
                console.log('Cached Content: ', this.cache);
            }
        }
        else {
            if (this.options.debug) {
                console.log('Response wasn\'t a HTML document');
            }
            trigger_1.default(document, ['pjax:error']);
            return;
        }
    };
    Pjax.prototype.loadContent = function (responseText) {
        var tempDocument = this.parseContent(responseText);
        if (tempDocument instanceof HTMLDocument) {
            this.clearActiveElement();
            this.switchSelectors(this.options.selectors, tempDocument, document);
        }
        else {
            if (this.options.debug) {
                console.log('Response wasn\'t a HTML document');
            }
            trigger_1.default(document, ['pjax:error']);
            this.lastChance(this.request.responseURL);
            return;
        }
    };
    Pjax.prototype.handleResponse = function (e, loadType) {
        if (this.options.debug) {
            console.log('XML Http Request Status: ', this.request.status);
        }
        if (this.request.responseText === null) {
            trigger_1.default(document, ['pjax:error']);
            return;
        }
        switch (loadType) {
            case 'prefetch':
                this.state.history = true;
                if (this.confirmed) {
                    this.loadContent(this.request.responseText);
                }
                else {
                    this.cacheContent(this.request.responseText, this.request.status, this.request.responseURL);
                }
                break;
            case 'popstate':
                this.state.history = false;
                this.loadContent(this.request.responseText);
                break;
            case 'reload':
                this.state.history = false;
                this.loadContent(this.request.responseText);
                break;
            default:
                this.state.history = true;
                this.loadContent(this.request.responseText);
                break;
        }
    };
    Pjax.prototype.doRequest = function (href) {
        var _this = this;
        var reqeustMethod = 'GET';
        var timeout = this.options.timeout || 0;
        var request = new XMLHttpRequest();
        var uri = href;
        var queryString = href.split('?')[1];
        if (this.options.cacheBust) {
            uri += (queryString === undefined) ? ("?cb=" + Date.now()) : ("&cb=" + Date.now());
        }
        return new Promise(function (resolve, reject) {
            request.open(reqeustMethod, uri, true);
            request.timeout = timeout;
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('X-PJAX', 'true');
            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(_this.options.selectors));
            request.onload = resolve;
            request.onerror = reject;
            request.send();
            _this.request = request;
        });
    };
    Pjax.prototype.handlePrefetch = function (href) {
        var _this = this;
        if (this.confirmed) {
            return;
        }
        if (this.options.debug) {
            console.log('Prefetching: ', href);
        }
        this.abortRequest();
        trigger_1.default(document, ['pjax:prefetch']);
        this.doRequest(href).then(function (e) {
            _this.handleResponse(e, 'prefetch');
        }).catch(function (e) {
            if (_this.options.debug) {
                console.log('XHR Request Error: ', e);
            }
        });
    };
    Pjax.prototype.handleLoad = function (href, loadType, el) {
        var _this = this;
        if (el === void 0) { el = null; }
        if (this.confirmed) {
            return;
        }
        trigger_1.default(document, ['pjax:send'], el);
        this.confirmed = true;
        if (this.cache !== null) {
            if (this.options.debug) {
                console.log('Loading Cached: ', href);
            }
            this.loadCachedContent();
        }
        else if (this.request !== null) {
            if (this.options.debug) {
                console.log('Loading Prefetch: ', href);
            }
            this.confirmed = true;
        }
        else {
            if (this.options.debug) {
                console.log('Loading: ', href);
            }
            this.doRequest(href).then(function (e) {
                _this.handleResponse(e, loadType);
            }).catch(function (e) {
                if (_this.options.debug) {
                    console.log('XHR Request Error: ', e);
                }
            });
        }
    };
    Pjax.prototype.clearPrefetch = function () {
        if (!this.confirmed) {
            this.cache = null;
            this.abortRequest();
            trigger_1.default(document, ['pjax:cancel']);
        }
    };
    return Pjax;
}());
exports.default = Pjax;
//# sourceMappingURL=pjax.js.map