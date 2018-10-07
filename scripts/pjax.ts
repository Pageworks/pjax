// Function Imports
import parseOptions from './lib/parse-options';
import uuid from './lib/uuid';
import trigger from './lib/events/trigger';
import contains from './lib/util/contains';
import linkEvent from './lib/events/link-events';
import checkElement from './lib/util/check-element';

// TypeScript Declarations
import globals from './globals';
declare const module:any

class Pjax{
    state:      globals.StateObject
    cache:      Document
    options:    globals.IOptions
    lastUUID:   string
    request:    XMLHttpRequest
    links:      NodeList

    constructor(options?:globals.IOptions){
        this.state = {
            url: window.location.href,
            title: document.title,
            history: true,
            scrollPos: [0,0]
        };
        this.cache = null;
        this.options = parseOptions(options);
        this.lastUUID = uuid();
        this.request = null;

        if(this.options.debug) console.log('Pjax Options:', this.options);

        this.init();
    }

    /**
     * Declare all initial event listeners
     */
    init(){
        window.addEventListener('popstate', e => this.handlePopstate(e));
        this.parseDOM(document.body); // Attach listeners to initial link elements
    }

    handleReload(){
        window.location.reload();
    }

    /**
     * Take the parsed element and attach our link listeners to it
     * @param el HTMLAnchorElement
     */
    setLinkListeners(el:HTMLAnchorElement){
        linkEvent(el, this);
    }

    /**
     * Called by `this.parseDOM`
     * Takes the provided element and queries for all our desired elements
     * defined in this.options.elements (default as HTMLAnchorElement)
     * @param el Element
     * @returns NodeList
     */
    getElements(el:Element){
        return el.querySelectorAll(this.options.elements);
    }

    /**
     * This method parses the DOM looking for our desired elements
     * Once we have our elements as a NodeList we loop through the
     * elements looking to see if the element is an HTMLAnchorElement
     * @param el Element
     */
    parseDOM(el:Element){
        const elements = this.getElements(el);
        elements.forEach((el)=>{
            checkElement(el, this);
        });
    }

    handleRefresh(el:Element){
        this.parseDOM(el);
    }

    /**
     * Handles the windows popstate event
     * Called by a popstate event listener
     * @param e PopStateEvent
     */
    handlePopstate(e: PopStateEvent){
        if(e.state){
            if(this.options.debug) console.log('Hijacking Popstate Event');

            e.preventDefault();

            this.lastUUID = e.state.uuid;

            this.loadUrl(e.state.url, null);
        }
    }

    abortRequest(){
        if(this.request === null) return;
        if(this.request.readyState !== 4){
            this.request.abort();
            this.request = null;
        }
    }

    /**
     * Abort any current request
     * If we have content cached load the content
     * If we don't have content cached trigger the pjax:send event before
     * starting our new XML HTTP request
     * @param href string
     * @param options object
     */
    loadUrl(href:string, eOptions:globals.EventOptions){
        this.abortRequest();

        if(this.cache === null){
            this.handleLoad(href, eOptions);
        }else{
            this.loadCachedContent();
        }
    }

    handlePushState(){
        if(this.state !== {}){
            if(this.state.history){
                this.lastUUID = uuid();
                window.history.pushState({
                    url: this.state.url,
                    title: this.state.title,
                    uuid: this.lastUUID,
                    scrollPos: [0,0]
                }, this.state.title, this.state.url);
            }else{
                this.lastUUID = uuid();
                window.history.replaceState({
                    url: this.state.url,
                    title: this.state.title,
                    uuid: this.lastUUID,
                    scrollPos: [0,0]
                }, document.title);
            }
        }
    }

    handleScrollPosition(){
        if(this.state.history){
            let temp = document.createElement('a');
            temp.href = this.state.url;
            
            if(temp.hash){
                let name = temp.hash.slice(1);
                name = decodeURIComponent(name);

                let currTop = 0;
                let target = document.getElementById(name) || document.getElementsByName(name)[0];
                
                if(target){
                    if(target.offsetParent){
                        do{
                            currTop += target.offsetTop;
                            target = <HTMLElement>target.offsetParent;
                        } while (target);
                    }
                }

                window.scrollTo(0, currTop);
            }
            else window.scrollTo(0, this.options.scrollTo);
        }
        else if(this.state.scrollPos){
            window.scrollTo(this.state.scrollPos[0], this.state.scrollPos[1]);
        }
    }

    finalize(){
        if(this.options.debug) console.log('Finishing Pjax');

        this.state = {
            url: this.request.responseURL,
            title: document.title,
            history: true,
            scrollPos: [0, window.scrollY]
        };

        if(this.options.debug) console.log('Setting History State: ', this.state);

        this.handlePushState();
        this.handleScrollPosition();

        this.cache = null;
        this.state = {};
        this.request = null;

        trigger(document, ['pjax:complete', 'pjax:success']);
    }

    handleSwitches(switchQueue:Array<globals.SwitchOptions>){
        switchQueue.map((switchObj)=>{
            switchObj.oldEl.innerHTML = switchObj.newEl.innerHTML;

            // if(switchObj.newEl.className === '') switchObj.oldEl.removeAttribute('class');
            // else switchObj.oldEl.className = switchObj.newEl.className;
        });

        this.finalize();
    }

    switchSelectors(selectors: string[], toEl: Document, fromEl: Document){
        let switchQueue:Array<globals.SwitchOptions> = [];

        selectors.forEach((selector)=>{
            let newEls = toEl.querySelectorAll(selector);
            let oldEls = fromEl.querySelectorAll(selector);

            if(this.options.debug) console.log('Pjax Switch: ', selector, newEls, oldEls);

            if(newEls.length !== oldEls.length){
                if(this.options.debug) console.log('DOM doesn\'t look the same on the new page');
            }

            newEls.forEach((newEl, i)=>{
                let oldEl = oldEls[i];

                let elSwitch = {
                    newEl: newEl,
                    oldEl: oldEl
                };

                switchQueue.push(elSwitch);
            });
        });
        
        if(switchQueue.length === 0){
            if(this.options.debug) console.log('Couldn\'t find anything to switch');
            return;
        }
        else this.handleSwitches(switchQueue);
    }

    /**
     * If we have cached content we need to check if there is an active element and if the document contains our selectors and active element
     * If it does blur the HTMLElement
     * Then tell Pjax to switch selectors
     */
    loadCachedContent(){
        if(document.activeElement && contains(document, this.options.selectors, document.activeElement)){
            try{
                (document.activeElement as HTMLElement).blur();
            }catch(e){ console.log(e) }
        }

        this.switchSelectors(this.options.selectors, this.cache, document);
    }

    /**
     * Create an HTML Document
     * Check if the responseText is an HTML Document by checking with regex
     * If the responseText matches our format return the new document otherwise return null
     * @param responseText string
     */
    parseContent(responseText: string){
        let tempEl = document.implementation.createHTMLDocument('globals');

        // let htmlRegex = /<html[^>]+>/gi;
        const htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        let matches = responseText.match(htmlRegex);
        
        if(matches && matches.length) return tempEl;

        return null;
    }

    /**
     * Attempts to cache the prefetched request
     * First we parse the content and return a new HTML Document
     * If parseContent returns null trigger and error and return
     * Otherwise set the innerHTML of the document to the responseText
     * Then cache the temp HTML Document
     * @param responseText string
     * @param eOptions globals.EventOptions
     */
    cacheContent(responseText:string){
        let tempEl = this.parseContent(responseText);

        if(tempEl === null){
            trigger(document, ['pjax:error']);
            return;
        }

        tempEl.documentElement.innerHTML = responseText;
        this.cache = tempEl;

        if(this.options.debug) console.log('Cached Content: ', this.cache);
    }

    loadContent(responseText:string){
        let tempEl = this.parseContent(responseText);

        if(tempEl === null){
            trigger(document, ['pjax:error']);
            return;
        }

        tempEl.documentElement.innerHTML = responseText;

        if(document.activeElement && contains(document, this.options.selectors, document.activeElement)){
            try{
                (document.activeElement as HTMLElement).blur();
            }catch(e){ console.log(e) }
        }

        this.switchSelectors(this.options.selectors, tempEl, document);
    }

    /**
     * This method handles our different response types
     * First we check if the response has HTML for us to handle
     * If we have something to work with prepare our state object
     * with the response's URL and our current eOptions
     * Then get the state attribute from our trigger element
     * If the state was a prefetch cache our response
     * @todo Error reporting/handling for 404, 301, 302, 500
     * @param e XMLHttpRequest
     * @param eOptions globals.EventOptions
     */
    handleResponse(e:Event, eOptions:globals.EventOptions){
        if(this.options.debug) console.log('XML Http Request Status: ', this.request.status);

        const request = this.request;
        
        if(request.responseText === null){
            trigger(document, ['pjax:error']);
            return;
        }

        let loadType =  (eOptions !== null) ? eOptions.triggerElement.getAttribute(this.options.attrState) : null;

        switch(loadType){
            case 'prefetch':
                this.cacheContent(request.responseText);
                break;
            default:
                this.loadContent(request.responseText);
                break;
        }
    }

    doRequest(href:string){
        const requestOptions        = this.options.requestOptions || {};
        const reqeustMethod         = (requestOptions.requestMethod || 'GET').toUpperCase();
        const requestParams         = requestOptions.requestParams || null;
        const timeout               = this.options.timeout || 0;
        const request               = new XMLHttpRequest();
        let requestPayload:string   = null;
        let queryString;

        if(requestParams && requestParams.length){
            queryString = (requestParams.map((param)=>{ return param.name + '=' + param.value })).join('&'); // Build query string

            switch(reqeustMethod){
                case 'GET':
                    href = href.split('?')[0];
                    href += '?';
                    href += queryString;
                    break;
                case 'POST':
                    requestPayload = queryString;
                    break;
            }
        }

        if(this.options.cacheBust) href += (queryString.length) ? ('&t=' + Date.now()) : ('t=' + Date.now());

        return new Promise((resolve, reject)=>{
            request.open(reqeustMethod, href, true);
            request.timeout = timeout;
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('X-PJAX', 'true');
            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(this.options.selectors));
            request.onload = resolve;
            request.onerror = reject;
            request.send(requestPayload);
            this.request = request;
        });
    }

    /**
     * Called by a HTMLAnchorElement's `mouseover` event listener
     * Start by aborting the active request
     * Trigger the `pjax:prefetch` event
     * Do the request and handle the response
     * @param href string
     * @param eOptions globals.EventOptions
     */
    handlePrefetch(href:string, eOptions:globals.EventOptions){
        if(this.options.debug) console.log('Prefetching: ', href);

        this.abortRequest();

        trigger(document, ['pjax:prefetch']);

        this.doRequest(href)
        .then((e:Event)=>{ this.handleResponse(e, eOptions); })
        .catch((e:ErrorEvent)=>{
            if(this.options.debug) console.log('XHR Request Error: ', e);
        });
    }

    handleLoad(href:string, eOptions:globals.EventOptions){
        if(this.cache !== null){
            if(this.options.debug) console.log('Loading Cached: ', href);
            this.loadCachedContent();
        }
        else if(this.request !== null){
            if(this.options.debug) console.log('Loading Prefetch: ', href);
        }else{
            if(this.options.debug) console.log('Loading: ', href);
            trigger(document, ['pjax:send']);
            this.doRequest(href)
            .then((e:Event)=>{ this.handleResponse(e, eOptions); })
            .catch((e:ErrorEvent)=>{
                if(this.options.debug) console.log('XHR Request Error: ', e);
            });
        }
    }

    /**
     * Called when a user unhovers (`mouseout`) a link
     * Abort the current request
     * Trigger the cancel event
     * Clear the cache
     */
    clearPrefetch(){
        this.abortRequest();
        trigger(document, ['pjax:cancel']);
        this.cache = null;
    }
}

module.exports = Pjax;