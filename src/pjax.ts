// Function Imports
import parseOptions from './lib/parse-options';
import trigger from './lib/events/trigger';
import parseDOM from './lib/parse-dom';
import scrollWindow from './lib/util/scroll';
import clearActive from './lib/util/clear-active';

// Custom Packages
import StateManager from '@pageworks/state-manager';
import DeviceManager from '@pageworks/device-manager';

// Type Definitions
import PJAX from './global';

export default class Pjax{

    public static VERSION:string    = '2.2.0';

    public  options:            PJAX.IOptions;
    private _cache:             PJAX.ICacheObject;
    private _request:           string;
    private _response:          Response;
    private _confirmed:         boolean;
    private _cachedSwitch:      PJAX.ICachedSwitchOptions;
    private _scrollTo:          PJAX.IScrollPosition;
    private _isPushstate:       boolean;
    private _dom:               HTMLElement;
    private _scriptsToAppend:   Array<HTMLScriptElement>;
    private _requestId:         number;

    constructor(options?:PJAX.IOptions){
        this._dom           = document.documentElement;

        // If IE 11 is detected abort pjax
        if(DeviceManager.isIE){
            console.log('%c[Pjax] '+`%cIE 11 detected - Pjax aborted`,'color:#f3ff35','color:#eee');
            this._dom.classList.remove('dom-is-loading');
            this._dom.classList.add('dom-is-loaded');
            return;
        }
        
        this._cache             = null;
        this.options            = parseOptions(options);
        this._request           = null;
        this._response          = null;
        this._confirmed         = false;
        this._cachedSwitch      = null;
        this._scrollTo          = {x:0, y:0};
        this._isPushstate       = true;
        this._scriptsToAppend   = [];
        this._requestId         = 0;

        this.init();
    }

    init(){
        if(this.options.debug){
            console.group();
            console.log('%c[Pjax] '+`%cinitializing Pjax version ${ Pjax.VERSION }`, 'color:#f3ff35','color:#eee');
            console.log('%c[Pjax] '+`%cview Pjax documentation at http://papertrain.io/pjax`, 'color:#f3ff35','color:#eee');
            console.log('%c[Pjax] '+`%cloaded with the following options: `, 'color:#f3ff35','color:#eee');
            console.log(this.options);
            console.groupEnd();
        }

        // Handle status classes for initial load
        this._dom.classList.add('dom-is-loaded');
        this._dom.classList.remove('dom-is-loading');
        

        new StateManager(this.options.debug, true);

        window.addEventListener('popstate', this.handlePopstate);

        if(this.options.customTransitions){
            document.addEventListener('pjax:continue', this.handleContinue );
        }

        document.addEventListener('pjax:load', this.handleManualLoad);

        // Attach listeners to initial link elements
        parseDOM(document.body, this);
    }

    /**
     * Fired when the custom `pjax:load` event fires on the `document`
     */
    private handleManualLoad:EventListener = (e:CustomEvent)=>{
        const uri = e.detail.uri;
        if(this.options.debug){
            console.log('%c[Pjax] '+`%cmanually loading ${ uri }`,'color:#f3ff35','color:#eee');
        }
        this.doRequest(uri);
    }

    /**
     * Fired when the `popstate` event is fired on the `window`.
     */
    private handlePopstate:EventListener = (e:PopStateEvent)=>{
        
        // Check if the state object is available
        if(e.state){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%chijacking popstate event`,'color:#f3ff35','color:#eee');
            }
            this._scrollTo = e.state.scrollPos;
            this.loadUrl(e.state.uri, 'popstate');
        }
    }

    /**
     * 
     * @param href - URI from the popstates state object
     * @param loadType - the load type that should be perfomred (eg: popstate)
     */
    private loadUrl(href:string, loadType:string):void{
        
        if(this._confirmed){
            return;
        }

        // Abort any current request
        this.abortRequest();
        this._cache = null;

        // Handle the page load request
        this.handleLoad(href, loadType);
    }

    /**
     * Called when the current request needs to be aborted.
     */
    private abortRequest(): void{
        // Reset the request
        this._request = null;

        // Reset the response
        this._response = null;
    }

    /**
     * Called when Pjax needs to finish the page transition.
     * This method is responsible for cleaning up all the status trackers.
     */
    private finalize(): void{
        if(this.options.debug){
            console.log('%c[Pjax] '+`%cpage transition completed`,'color:#f3ff35','color:#eee');
        }

        // Update the windows scroll position
        scrollWindow(this._scrollTo);

        // Handle the pushState
        if(this.options.history){
            if(this._isPushstate){
                StateManager.doPush(this._response.url, document.title);
            }else{
                StateManager.doReplace(this._response.url, document.title);
            }
        }

        // Trigger the complete event
        trigger(document, ['pjax:complete']);

        if(!this._scriptsToAppend.length){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cNo new scripts to load`,'color:#f3ff35','color:#eee');
                trigger(document, ['pjax:scriptContentLoaded']);
            }
        }

        // Handle status classes
        this._dom.classList.add('dom-is-loaded');
        this._dom.classList.remove('dom-is-loading');

        // Reset status trackers
        this._cache             = null;
        this._request           = null;
        this._response          = null;
        this._cachedSwitch      = null;
        this._isPushstate       = true;
        this._scrollTo          = {x:0,y:0};
        this._confirmed         = false;
    }

    /**
     * Loops through the `SwitchObject` array and swapps the `innerHTML` from the containers.
     * @param switchQueue -`SwitchObject` array
     */
    private handleSwitches(switchQueue:Array<PJAX.ISwitchObject>): void{
        
        // Loop through all the queued switch objects
        for(let i = 0; i < switchQueue.length; i++){
            
            // Swap out the innerHTML
            switchQueue[i].current.innerHTML = switchQueue[i].new.innerHTML;
            
            // Parse the new container and handle event listeners
            parseDOM(switchQueue[i].current, this);
        }

        // Finalize the page transition
        this.finalize();
    }

    /**
     * Called when the `pjax:continue` event is fired.
     * Only listening if the `customTransition` is enabled in the options object.
     */
    private handleContinue:EventListener = (e:Event)=>{
        // Check if Pjax has cached the new page
        if(this._cachedSwitch !== null){
            
            // Check if the titles need to be swapped
            if(this.options.titleSwitch){
                document.title = this._cachedSwitch.title;
            }
            
            // Swap content
            this.handleSwitches(this._cachedSwitch.queue);
        }else{
            // The developer fired the continue event too early so the page hasn't finished loading
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cswitch queue was empty. You might be sending pjax:continue early`,'color:#f3ff35','color:#eee');
            }
            trigger(document, ['pjax:error']);
        }
    }

    /**
     * Builds an array of `SwitchObjects` that need to be swapped based on the `options.selectors` array.
     * @param selectors - an array of container selectors that Pjax needs to swap
     * @param tempDocument - the temporary `HTMLDocument` generated from the fetch response
     */
    private switchSelectors(selectors:string[], tempDocument:HTMLDocument): void{
        
        if(tempDocument === null){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%ctemporary document was null, telling the browser to load ${ (this._cache !== null) ? this._cache.url : this._response.url }`,'color:#f3ff35','color:#eee');
            }

            if(this._cache !== null){
                this.lastChance(this._cache.url);
            }else{
                this.lastChance(this._response.url);
            }

            return;
        }

        // If `importScripts` is false check if Pjax needs to native load the page
        if(!this.options.importScripts){

            // Get the script elements from the temp document
            const newScripts = Array.from(tempDocument.querySelectorAll('script'));
            
            if(newScripts.length){

                // Get the script elements from the current document
                const currentScripts = Array.from(document.querySelectorAll('script'));

                newScripts.forEach((newScript)=>{
                    
                    // Assume the script is new
                    let isNewScript = true;
                    currentScripts.forEach((currentScript)=>{
                        
                        // Check if the new script is already on the document
                        if(newScript.src === currentScript.src){
                            isNewScript = false;
                        }
                    });

                    // If the new script is not already on the document load the new page using the native browser functionality
                    if(isNewScript){
                        // Abort switch if one of the new containers contains a script element
                        if(this.options.debug){
                            console.log('%c[Pjax] '+`%cthe new page contains scripts`,'color:#f3ff35','color:#eee');
                        }
                        this.lastChance(this._response.url);
                    }
                });
            }
        }

        // If `importsCSS` is false check if Pjax needs to native load the page
        if(!this.options.importCSS){
            // Get the script elements from the temp document
            const newStylesheets = Array.from(tempDocument.querySelectorAll('link[rel="stylesheet"]'));
            
            if(newStylesheets.length){

                // Get the script elements from the current document
                const currentStylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

                newStylesheets.forEach((newStylesheet)=>{
                    
                    // Assume the sheet is new
                    let isNewSheet = true;
                    currentStylesheets.forEach((currentStylesheet)=>{
                        
                        // Check if the new script is already on the document
                        if(newStylesheet.getAttribute('href') === currentStylesheet.getAttribute('href')){
                            isNewSheet = false;
                        }
                    });

                    // If the new script is not already on the document load the new page using the native browser functionality
                    if(isNewSheet){
                        // Abort switch if one of the new containers contains a script element
                        if(this.options.debug){
                            console.log('%c[Pjax] '+`%cthe new page contains new stylesheets`,'color:#f3ff35','color:#eee');
                        }
                        this.lastChance(this._response.url);
                    }
                });
            }
        }

        // Build a queue of containers to swap
        const switchQueue:Array<PJAX.ISwitchObject> = [];

        // Loop though all the selector strings
        for(let i = 0; i < selectors.length; i++){
            
            // Grab the selector containers from the temporay and current documents
            const newContainers = Array.from(tempDocument.querySelectorAll(selectors[i]));
            const currentContainers = Array.from(document.querySelectorAll(selectors[i]));

            if(this.options.debug){
                console.log('%c[Pjax] '+`%cswapping content from ${ selectors[i] }`,'color:#f3ff35','color:#eee');
            }

            // Check that the selector contains exist on both documents
            if(newContainers.length !== currentContainers.length){
                if(this.options.debug){
                    console.log('%c[Pjax] '+`%cthe dom doesn't look the same`,'color:#f3ff35','color:#eee');
                    
                }

                // If a document is missing a container natively load the page
                this.lastChance(this._response.url);

                return;
            }

            // Loop though all the new containers
            for(let k = 0; k < newContainers.length; k++){

                // Get the current container object
                const newContainer = newContainers[k];
                const currentContainer = currentContainers[k];

                // Build the switch object
                const switchObject:PJAX.ISwitchObject = {
                    new: newContainer,
                    current: currentContainer
                };
    
                // Queue the switch
                switchQueue.push(switchObject);
            }
        }
        
        // Check that there are switch objects in the queue
        if(switchQueue.length === 0){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%ccouldn't find anything to switch`,'color:#f3ff35','color:#eee');
            }
            this.lastChance(this._response.url);
            return;
        }

        if(this.options.importScripts){
            this.handleScripts(tempDocument);
        }

        if(this.options.importCSS){
            this.handleCSS(tempDocument);
        }
        
        // Check if Pjax needs to wait for the continue event
        if(!this.options.customTransitions){
            if(this.options.titleSwitch){
                document.title = tempDocument.title;
            }
            this.handleSwitches(switchQueue);
        }else{
            this._cachedSwitch = {
                queue: switchQueue,
                title: tempDocument.title
            };
        }
    }

    /**
     * Called when something went wrong with Pjax.
     * This fallback will force the browser to natively load the page.
     * @param uri - URI of the page that should be natively loaded
     */
    private lastChance(uri:string): void{
        if(this.options.debug){
            console.log('%c[Pjax] '+`%csomething caused Pjax to break, native loading ${ uri }`,'color:#f3ff35','color:#eee');
        }
        window.location.href = uri;
    }

    /**
     * Check if the cached content has a successful response.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     */
    private statusCheck(): boolean{
        for(let status = 200; status <= 206; status++){
            if(this._cache.status === status){
                return true;
            }
        }
        return false;
    }

    /**
     * Called when Pjax needs to load the temporary `HTMLDocument` that's currently cached.
     */
    private loadCachedContent(): void{
        
        // Verify that the server responded with a 200 level response status
        if(!this.statusCheck()){
            this.lastChance(this._cache.url);
            return;
        }

        // Clear the active element
        clearActive();

        StateManager.doReplace(window.location.href, document.title);

        // Build the selector swapping queue
        this.switchSelectors(this.options.selectors, this._cache.document);
    }

    /**
     * Builds a temporary `HTMLDocument` using the `responseText` provided by the `XMLHttpRequest` response.
     * @param responseText - `responseText` from the `XMLHttpRequest` response
     * @returns `HTMLDocument` or `null`
     */
    private parseContent(responseText:string): HTMLDocument{        
        const tempDocument:HTMLDocument = document.implementation.createHTMLDocument('pjax-temp-document');

        const contentType = this._response.headers.get('Content-Type');
        const htmlRegex = /text\/html/gi;
        const matches = contentType.match(htmlRegex);
        
        // Check that the regex match was successful
        if(matches !== null){
            tempDocument.documentElement.innerHTML = responseText;
            return tempDocument;
        }

        return null;
    }

    /**
     * Caches the response from the server in a temporary `HTMLDocument`.
     * @param responseText - `responseText` from the `XMLHttpRequest` response
     * @param responseStatus - `status` from the `XMLHttpRequest` response
     * @param uri - the URI that was used for the request
     */
    private cacheContent(responseText:string, responseStatus:number, uri:string): void{
        
        // Create a temp HTML document
        const tempDocument = this.parseContent(responseText);

        // Create the cache object
        this._cache = {
            status: responseStatus,
            document: tempDocument,
            url: uri
        }

        // Check that the temp document is valid
        if(tempDocument instanceof HTMLDocument){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%ccaching content`,'color:#f3ff35','color:#eee');
            }
        }else{
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cresponse wan't an HTML document`,'color:#f3ff35','color:#eee');
            }

            // Trigger error if the response wasn't an HTML Document
            trigger(document, ['pjax:error']);
        }
    }

    /**
     * Handles building the new `HTMLDocument`
     * @param responseText - `responseText`
     */
    private loadContent(responseText:string): void{

        // Create a temp HTML document
        const tempDocument = this.parseContent(responseText);

        if(tempDocument instanceof HTMLDocument){
            
            // Clear the active element
            clearActive();

            StateManager.doReplace(window.location.href, document.title);
    
            // Swap the current page with the new page
            this.switchSelectors(this.options.selectors, tempDocument);
        }else{
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cresponse wasn't an HTML document`,'color:#f3ff35','color:#eee');
            }

            // Trigger the error event
            trigger(document, ['pjax:error']);

            // Have the browser load the page natively
            this.lastChance(this._response.url);

            return;
        }
    }

    /**
     * Append any `<script>` elements onto the current `HTMLDocument`
     * @param newDocument - `HTMLDocument`
     */
    private handleScripts(newDocument:HTMLDocument):void{

        if(newDocument instanceof HTMLDocument){
            const newScripts = Array.from(newDocument.querySelectorAll('script'));
            const currentScripts = Array.from(document.querySelectorAll('script'));


            newScripts.forEach((newScript)=>{
                let appendScript = true;
                let newScriptFilename = 'inline-script';

                if (newScript.getAttribute('src') !== null)
                {
                    newScriptFilename = newScript.getAttribute('src').match(/[^/]+$/g)[0];
                }

                currentScripts.forEach((currentScript)=>{
                    let currentScriptFilename = 'inline-script';

                    if (currentScript.getAttribute('src') !== null)
                    {
                        currentScriptFilename = currentScript.getAttribute('src').match(/[^/]+$/g)[0];
                    }

                    if(newScriptFilename === currentScriptFilename && newScriptFilename !== 'inline-script'){
                        appendScript = false;
                    }
                });

                if(appendScript){
                    this._scriptsToAppend.push(newScript);
                }
            });

            // Append the new scripts to the body
            if(this._scriptsToAppend.length){
                let scriptLoadCount = 0;

                this._scriptsToAppend.forEach((script)=>{
                    // Append inline script elements
                    if(script.src === ''){
                        const newScript = document.createElement('script');
                        newScript.dataset.src = this._response.url;
                        newScript.innerHTML = script.innerHTML;
                        this.options.scriptImportLocation.appendChild(newScript);
                        scriptLoadCount++;
                        this.checkForScriptLoadComplete(scriptLoadCount);
                    }
                    else
                    {
                        fetch(script.src, {
                            method: 'GET',
                            credentials: 'include',
                            headers: new Headers({
                                'X-Requested-With': 'XMLHttpRequest',
                                'Accept': 'text/javascript'
                            })
                        })
                        .then(request => request.text())
                        .then(response => {
                            const newScript = document.createElement('script');

                            newScript.setAttribute('src', script.src);
                            newScript.innerHTML = response;
                            this.options.scriptImportLocation.appendChild(newScript);
                            scriptLoadCount++;
                            this.checkForScriptLoadComplete(scriptLoadCount);
                        })
                        .catch(error => {
                            console.error('Failed to fetch script', script.src, error);
                        });
                    }
                });
            }
        }
    }

    /**
     * Handles the custom `DOMContentLoaded` style event.
     * If a `script` is provided splice it from the array of scripts to append.
     * @param script - `HTMLScriptElement`
     */
    private checkForScriptLoadComplete(scriptCount:number){
        if (scriptCount === this._scriptsToAppend.length)
        {
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cAll scripts have been loaded`,'color:#f3ff35','color:#eee');
            }

            this._scriptsToAppend = [];

            // Trigger the content loaded event
            trigger(document, ['pjax:scriptContentLoaded']);
        }
    }

    /**
     * Append any `<style>` or `<link rel="stylesheet">` elements onto the current documents head
     * @param newDocument - `HTMLDocument`
     */
    private handleCSS(newDocument:HTMLDocument):void{
        
        if(newDocument instanceof HTMLDocument){
            const newStyles:Array<HTMLLinkElement> = Array.from(newDocument.querySelectorAll('link[rel="stylesheet"]'));
            const currentStyles:Array<HTMLElement> = Array.from(document.querySelectorAll('link[rel="stylesheet"], style[href]'));
            const stylesToAppend:Array<HTMLLinkElement> = [];

            newStyles.forEach((newStyle)=>{
                let appendStyle = true;
                const newStyleFile = newStyle.getAttribute('href').match(/[^/]+$/g)[0];

                currentStyles.forEach((currentStyle)=>{
                    const currentStyleFile = currentStyle.getAttribute('href').match(/[^/]+$/g)[0];
                    if(newStyleFile === currentStyleFile){
                        appendStyle = false;
                    }
                });

                if(appendStyle){
                    stylesToAppend.push(newStyle);
                }
            });

            // Append the new `link` styles to the head
            if(stylesToAppend.length){
                stylesToAppend.forEach((style)=>{
                    fetch(style.href, {
                        method: 'GET',
                        credentials: 'include',
                        headers: new Headers({
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'text/javascript'
                        })
                    })
                    .then(request => request.text())
                    .then(response => {
                        const newStyle = document.createElement('style');
                        newStyle.setAttribute('rel', 'stylesheet');
                        newStyle.setAttribute('href', style.href);
                        newStyle.innerHTML = response;
                        document.head.appendChild(newStyle);
                    })
                    .catch(error => {
                        console.error('Failed to fetch stylesheet', style.href, error);
                    });
                });
            }
        }
    }

    /**
     * Handles the fetch `Response` based on the load type.
     * @param response - `Reponse` object provided by the Fetch API
     * @param loadType - informs the response handler what type of load is being preformed (eg: reload)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
     */
    private handleResponse(response:Response): void{
        
        // If the request is null (aborted) do nothing
        if(this._request === null){
            return;    
        }
        
        if(this.options.debug){
            console.log('%c[Pjax] '+`%cRequest status: ${ response.status }`,'color:#f3ff35','color:#eee');
        }
        
        // Check if the server response is valid
        if(!response.ok){
            trigger(document, ['pjax:error']);
            return;
        }

        this._response = response;

        response.text().then((responseText:string)=>{
            // Handle the response based on the load type provided
            switch(this._request){
                case 'prefetch':
                    if(this._confirmed){
                        this.loadContent(responseText);
                    }else{
                        this.cacheContent(responseText, this._response.status, this._response.url);
                    }
                    break;
                case 'popstate':
                    this._isPushstate = false;
                    this.loadContent(responseText);
                    break;
                case 'reload':
                    this._isPushstate = false;
                    this.loadContent(responseText);
                    break;
                default:
                    this.loadContent(responseText);
                    break;
            }
        });
    }

    /**
     * Request the new page using the `fetch` api.
     * @see https://fetch.spec.whatwg.org/
     * @param href - URI of the reqeusted page
     */
    private doRequest(href:string):void{
        
        // Update the current request ID
        this._requestId++;

        // Store the ID at the start of the async request
        const idAtStartOfRequest = this._requestId;
        
        let     uri                   = href;
        const   queryString           = href.split('?')[1];

        // Check if Pjax needs to modify the URI with a cache busting param
        if(this.options.cacheBust){
            uri += (queryString === undefined) ? (`?cb=${Date.now()}`) : (`&cb=${Date.now()}`);
        }

        const fetchMethod = 'GET';
        const fetchHeaders = new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'X-Pjax': 'true'
        });

        fetch(uri, {
            method: fetchMethod,
            headers: fetchHeaders
        }).then((response:Response)=>{
            // Only handle the request if it's still the most reacent request
            if(idAtStartOfRequest === this._requestId){
                this.handleResponse(response);
            }
        }).catch((error:Error)=>{
            if(this.options.debug){
                console.group();
                console.error('%c[Pjax] '+`%cFetch error:`,'color:#f3ff35','color:#eee');
                console.error(error);
                console.groupEnd();
            }
        });
    }

    /**
     * Called when the user hovers over an element.
     * Handles prefetching the page request before the user clicks.
     * @param href - URI of the requested page
     */
    public handlePrefetch(href:string): void{
        
        // Don't prefetch links after the user has confirmed a page switch
        if(this._confirmed){
            return;
        }

        if(this.options.debug){
            console.log('%c[Pjax] '+`%cprefetching ${ href }`,'color:#f3ff35','color:#eee');
        }

        // Abort any outstanding request
        this.abortRequest();

        // Trigger the prefetch event
        trigger(document, ['pjax:prefetch']);

        this._request = 'prefetch';
        this.doRequest(href);
    }

    /**
     * Called when a new page needs to be loaded.
     * @param href - URI of the reqeusted page
     * @param loadType - informs the response handler what type of load is being preformed (eg: prefetch)
     * @param el - `Element` that the triggered the page load
     */
    public handleLoad(href:string, loadType:string, el:Element = null): void{
        
        // If the user already confirmed the page switch abort load
        if(this._confirmed){
            return;
        }

        // Trigger the send event
        trigger(document, ['pjax:send'], el);

        // Handle status classes
        this._dom.classList.remove('dom-is-loaded');
        this._dom.classList.add('dom-is-loading');

        // Set the page switch confirmed flag
        this._confirmed = true;

        // Check if the new page is cached
        if(this._cache !== null){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cloading cached content from ${ href }`,'color:#f3ff35','color:#eee');
            }
            this.loadCachedContent();
        }
        // Pjax isn't prefetching, do the request
        else if(this._request !== 'prefetch'){
            if(this.options.debug){
                console.log('%c[Pjax] '+`%cloading ${ href }`,'color:#f3ff35','color:#eee');
            }
            this._request = loadType;
            this.doRequest(href);
        }
    }

    /**
     * Called when Pjax needs to clear a prefetch.
     */
    public clearPrefetch(): void{
        
        // Check that the user hasn't confirmed a page switch
        if(!this._confirmed){
            
            // Reset the cache
            this._cache = null;

            // Abort any current requests
            this.abortRequest();

            // Trigger the cancel event
            trigger(document, ['pjax:cancel']);
        }
    }

    /**
     * Manually triggers Pjax to load the requested page.
     * @param url - `string`
     */
    public static load(url:string):void{
        const customEvent = new CustomEvent('pjax:load', {
            detail:{
                uri: url
            }
        });
        document.dispatchEvent(customEvent);
    }
}