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
    state:              globals.StateObject
    cache:              globals.CacheObject
    options:            globals.IOptions
    lastUUID:           string
    request:            XMLHttpRequest
    links:              NodeList
    confirmed:           boolean
    cachedSwitch:       globals.CachedSwitchOptions

    constructor(options?:globals.IOptions){
        this.state = {
            url: window.location.href,
            title: document.title,
            history: true,
            scrollPos: [0,0]
        };
        this.cache              = null;
        this.options            = parseOptions(options);
        this.lastUUID           = uuid();
        this.request            = null;
        this.confirmed           = false;
        this.cachedSwitch       = null;

        if(this.options.debug) console.log('Pjax Options:', this.options);

        this.init();
    }

    /**
     * Declare all initial event listeners
     * Calls parseDOM to init all base link event listeners
     */
    init(){
        window.addEventListener('popstate', e => this.handlePopstate(e));

        if(this.options.customTransitions) document.addEventListener('pjax:continue', e => this.handleContinue(e) );

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

    // handleRefresh(el:Element){
    //     this.parseDOM(el);
    // }

    /**
     * Handles the windows popstate event
     * Called by a popstate event listener
     * @param e PopStateEvent
     */
    handlePopstate(e: PopStateEvent){
        if(e.state){
            if(this.options.debug) console.log('Hijacking Popstate Event');
            this.loadUrl(e.state.url, 'popstate');
        }
    }

    /**
     * Called when we need to abort an XMLHttpRequest
     * If the request is null do nothing
     * If the request is not ready abort and make null
     */
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
    loadUrl(href:string, loadType:string){
        this.abortRequest();

        if(this.cache === null){
            this.handleLoad(href, loadType);
        }else{
            this.loadCachedContent();
        }
    }

    /**
     * First we check if we have a state object to use with the history state
     * If we do and we want to defind our browsers history get a new UUID
     * Then use `window.history.pushState` to set a new browser history state
     * If we're not defining the browsers history use `window.history.replaceState`
     */
    handlePushState(){
        if(this.state !== {}){
            if(this.state.history){
                if(this.options.debug) console.log('Pushing History State: ', this.state);
                this.lastUUID = uuid();
                window.history.pushState({
                    url: this.state.url,
                    title: this.state.title,
                    uuid: this.lastUUID,
                    scrollPos: [0,0]
                }, this.state.title, this.state.url);
            }else{
                if(this.options.debug) console.log('Replacing History State: ', this.state);
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

    /**
     * If history is defined check if there is a hash we need to jump to
     * If a hash exist get our target and set the current offset top for the window
     * Then scroll to the hash's position
     * Otherwise scroll to the default scroll position defined in our options object
     * Otherwise if the state has a scroll position set scroll to the histroy states scroll position
     */
    handleScrollPosition(){
        if(this.state.history){
            const temp = document.createElement('a');
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

    /**
     * Called as our final step when switching pages
     * This method resets our object back to their initial values
     * while also handling the history state and the scroll position
     * Triggers a complete and success call when finished
     */
    finalize(){
        if(this.options.debug) console.log('Finishing Pjax');

        this.state.url = this.request.responseURL;
        this.state.title = document.title;
        this.state.scrollPos = [0, window.scrollY];

        this.handlePushState();
        this.handleScrollPosition();

        this.cache              = null;
        this.state              = {};
        this.request            = null;
        this.confirmed           = false;
        this.cachedSwitch       = null;

        trigger(document, ['pjax:complete']);
    }

    /**
     * This method takes a switch queue and swapps out the innerHTML of our 'old' element with the
     * content returned by the XMLHttpRequest in it's responseText
     * Once the innerHTML is switched we call `this.parseDOM` and pass in the 'old' element (now containing the new elements)
     * so we can set any event listeners to elements within our new html
     * Calls `this.finalize` when finished
     * @param switchQueue
     */
    handleSwitches(switchQueue:Array<globals.SwitchOptions>){
        switchQueue.map((switchObj)=>{
            switchObj.oldEl.innerHTML = switchObj.newEl.innerHTML;
            this.parseDOM(switchObj.oldEl);
        });

        this.finalize();
    }

    /**
     * Called when the developer marked `this.options.customTransitions = true` and
     * Pjax has recieved the `pjax:continue` event from the developers transition manager
     * Calls `this.handleSwitches` if we have switches queued
     * @param e Event
     */
    handleContinue(e:Event){
        if(this.cachedSwitch !== null){
            if(this.options.titleSwitch) document.title = this.cachedSwitch.title;
            this.handleSwitches(this.cachedSwitch.queue);
        }
        else{
            if(this.options.debug) console.log('Switch queue was empty');
            trigger(document, ['pjax:error']);
        }
    }

    /**
     * This method begins by building an empty array of switches
     * The switch queue will be passed to our `handleSwitches` method
     * Take all selectors and grab the new elements and old elements from the documents provided
     * If we don't have the same number of elements to switch to it means the documents (pages) don't have the same layout
     * Build switch objects based on how many new elements we have to switch to
     * Push the new switch objects into the switch queue
     * If the switch queue is empty we couldn't find any containers in the documents to swap
     * If emtpy call `this.lastChance` so we can let the browser switch to the page
     * Otherwise set the document title and then call `this.handleSwitches` and provide the switch queue
     * @param selectors
     * @param toEl
     * @param fromEl
     */
    switchSelectors(selectors: string[], toEl: Document, fromEl: Document){
        const switchQueue:Array<globals.SwitchOptions> = [];

        selectors.forEach((selector)=>{
            const newEls = toEl.querySelectorAll(selector);
            const oldEls = fromEl.querySelectorAll(selector);

            if(this.options.debug) console.log('Pjax Switch Selector: ', selector, newEls, oldEls);

            if(newEls.length !== oldEls.length){
                if(this.options.debug) console.log('DOM doesn\'t look the same on the new page');
                this.lastChance(this.request.responseURL);
                return;
            }

            newEls.forEach((newElement, i)=>{
                const oldElement = oldEls[i];

                const elSwitch = {
                    newEl: newElement,
                    oldEl: oldElement
                };

                switchQueue.push(elSwitch);
            });
        });
        
        if(switchQueue.length === 0){
            if(this.options.debug) console.log('Couldn\'t find anything to switch');
            this.lastChance(this.request.responseURL);
            return;
        }
        
        if(!this.options.customTransitions){
            if(this.options.titleSwitch) document.title = toEl.title;
            this.handleSwitches(switchQueue);
        }
        else{
            this.cachedSwitch = {
                queue: switchQueue,
                title: toEl.title
            };
        }
    }

    /**
     * Called when something goes wrong
     * This method is our failsafe for the Pjax application
     * This method provides base level and expected browser response to a page change
     * @param uri
     */
    lastChance(uri:string){
        if(this.options.debug) console.log('Cached content has a response of ', this.cache.status,' but we require a success response, fallback loading uri ', uri);
        window.location.href = uri;
    }

    /**
     * Check if the cached content has a successful response
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     */
    statusCheck(){
        for(let status = 200; status <= 206; status++){
            if(this.cache.status === status) return true;
        }
        return false;
    }

    /**
     * If we have cached content we need to check if there is an active element and if the document contains our selectors and active element
     * If it does blur the HTMLElement
     * Then tell Pjax to switch selectors
     * Can be aborted if our cached content has a non-200 response status, if we need to abort due to an issue call `this.lastChance`
     */
    loadCachedContent(){
        if(!this.statusCheck()){
            this.lastChance(this.cache.url);
            return;
        }

        if(document.activeElement && contains(document, this.options.selectors, document.activeElement)){
            try{
                (document.activeElement as HTMLElement).blur();
            }catch(e){ console.log(e) }
        }

        this.switchSelectors(this.options.selectors, this.cache.html, document);
    }

    /**
     * Create an HTML Document
     * Check if the responseText is an HTML Document by checking with regex
     * If the responseText matches our format return the new document otherwise return null
     * @param responseText string
     */
    parseContent(responseText: string){
        const tempEl = document.implementation.createHTMLDocument('globals');

        // let htmlRegex = /<html[^>]+>/gi;
        const htmlRegex = /\s?[a-z:]+(?=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi;
        const matches = responseText.match(htmlRegex);
        
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
    cacheContent(responseText:string, responseStatus:number, uri:string){
        const tempEl = this.parseContent(responseText);

        if(tempEl === null){
            trigger(document, ['pjax:error']);
            return;
        }

        tempEl.documentElement.innerHTML = responseText;
        this.cache = {
            status: responseStatus,
            html: tempEl,
            url: uri
        }

        if(this.options.debug) console.log('Cached Content: ', this.cache);
    }

    /**
     * Called when we need to handle a `click` event and the page is loaded
     * First we parse the response text to see if we can build an artificial document
     * If we can't respond with an error and call `this.lastChance`
     * Otherwise set the documents innerHTML with our response text
     * Remove the :focus of any inputs
     * Call our switch selectors method
     * @param responseText
     */
    loadContent(responseText:string){
        const tempEl = this.parseContent(responseText);

        if(tempEl === null){
            trigger(document, ['pjax:error']);
            this.lastChance(this.request.responseURL);
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
     * If the state was a prefetch cache our response
     * Or if the request was confirmed (user clicked link during prefetch response) handle load
     * Set our history state based on they load type (set in link-events.ts)
     * @param e XMLHttpRequest
     * @param eOptions globals.EventOptions
     */
    handleResponse(e:Event, loadType:string){
        if(this.options.debug) console.log('XML Http Request Status: ', this.request.status);

        const request = this.request;
        
        if(request.responseText === null){
            trigger(document, ['pjax:error']);
            return;
        }

        switch(loadType){
            case 'prefetch':
                this.state.history = true;
                if(this.confirmed) this.loadContent(request.responseText);
                else this.cacheContent(request.responseText, request.status, request.responseURL);
                break;
            case 'popstate':
                this.state.history = false;
                this.loadContent(request.responseText);
                break;
            case 'reload':
                this.state.history = false;
                this.loadContent(request.responseText);
                break;
            default:
                this.state.history = true;
                this.loadContent(request.responseText);
                break;
        }
    }

    /**
     * This method takes the link we need to send an XMLHttpRequest to and handles the request
     * First we defind our request's params and we begin to build our request
     * If we have query params we prepare our new href
     * If we are cache busting we apply a timestamp to the href
     * Then we return an ES6 promise to the method that called this method
     * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
     * @param href
     */
    doRequest(href:string){
        const   reqeustMethod:string  = 'GET';
        const   timeout               = this.options.timeout || 0;
        const   request               = new XMLHttpRequest();
        let     uri                   = href;
        const   queryString           = href.split('?')[1];

        if(this.options.cacheBust) uri += (queryString === undefined) ? (`?cb=${Date.now()}`) : (`&cb=${Date.now()}`);

        return new Promise((resolve, reject)=>{
            request.open(reqeustMethod, uri, true);
            request.timeout = timeout;
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.setRequestHeader('X-PJAX', 'true');
            request.setRequestHeader('X-PJAX-Selectors', JSON.stringify(this.options.selectors));
            request.onload = resolve;
            request.onerror = reject;
            request.send();
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
    handlePrefetch(href:string){
        if(this.options.debug) console.log('Prefetching: ', href);

        this.abortRequest();

        trigger(document, ['pjax:prefetch']);

        this.doRequest(href)
        .then((e:Event)=>{ this.handleResponse(e, 'prefetch'); })
        .catch((e:ErrorEvent)=>{
            if(this.options.debug) console.log('XHR Request Error: ', e);
        });
    }

    /**
     * Called when use clicks a link, even if we're already prefetching
     * @param href
     * @param loadType
     */
    handleLoad(href:string, loadType:string){
        trigger(document, ['pjax:send']);
        if(this.cache !== null){ // Content is cached
            if(this.options.debug) console.log('Loading Cached: ', href);
            this.loadCachedContent();
        }
        else if(this.request !== null){ // We're still waiting for content
            if(this.options.debug) console.log('Loading Prefetch: ', href);
            this.confirmed = true;
        }else{ // Not prefetching so do request
            if(this.options.debug) console.log('Loading: ', href);
            this.doRequest(href)
            .then((e:Event)=>{ this.handleResponse(e, loadType); })
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
        this.cache      = null;
        this.confirmed  = false;
        this.abortRequest();
        trigger(document, ['pjax:cancel']);
    }
}

export = Pjax;