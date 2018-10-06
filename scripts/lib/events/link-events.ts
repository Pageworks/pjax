// Function Imports
import on from './on';

// TypeScript Declaration Imports
import pjax from '../../globals';

/**
 * Check if the event has had it's default prevented OR
 * if the developer added a `prevent-default` attribute OR
 * if the element has a `no-transition` class
 * otherwise return false
 * @param el
 * @param e
 */
const isDefaultPrevented = (el:HTMLAnchorElement, e:Event)=>{
    if(e.defaultPrevented) return true;
    else if(el.getAttribute('prevent-default') !== null) return true;
    else if(el.classList.contains('no-transition')) return true;
    else return false;
}

/**
 * Check for link types and edge cases so we can abort if needed
 * This method prevents us from breaking some default browser behaviors
 * @param el 
 * @param e 
 */
const checkForAbort = (el:HTMLAnchorElement, e:Event)=>{
    // Ignore external links
    if(el.protocol !== window.location.protocol || el.host !== window.location.host) return 'external';

    // Ignore anchors on the smae page
    if(el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, '')) return 'anchor';

    // Ignore empty anchor
    if(el.href === window.location.href.split('#')[0] + '#') return 'anchor-empty';

    return null;
}

/**
 * Called when a user clicks on a link
 * First we check if default is prevented
 * Then we prepare our eventOptions object, this is used to store specific or
 * unique data for this event that we don't need/want attached to the overall
 * this.options for our pjax class
 * Then we check to see if there is any reason to abort the event hijack
 * Then we prevent default
 * Then we check if the event is a reload or is linked to the same page
 * Then we set the load state for the element
 * Finally we call loadUrl and pass in our desired href and the new eventOptions object
 * @param el HTMLAnchorElement
 * @param e Event
 */
const handleClick = (el:HTMLAnchorElement, e:Event)=>{
    if(isDefaultPrevented(el, e)) return;

    let eventOptions:pjax.EventOptions = {
        triggerElement: el
    };

    let attrValue = checkForAbort(el, e);
    if(attrValue !== null){
        el.setAttribute(this.options.attrState, attrValue);
        return;
    }

    e.preventDefault();

    // Don't do 'nothing' if the user is trying to reload the page by clicking on the same link twice
    if(el.href === window.location.href.split('#')[0]){
        el.setAttribute(this.options.attrState, 'reload');
        return;
    }

    el.setAttribute(this.options.attrState, 'load');
    this.handleLoad(el.href, eventOptions);
}

/**
 * Called when a user hovers/unhovers a link element
 * First we check if default is prevented
 * Then we check if it's a `mouseout` event
 * If it's a `mouseout` event we need to handle the change
 * Otherwise we defien our eventOptions (see handleClick for more info on eventOptions object)
 * Then we check if we should abort for any reason
 * Then we set our prefetch state
 * Finally we call prefetch and pass in our desired href and the new eventOptions object
 * @param el HTMLAnchorElement
 * @param e Event
 */
const handleHover = (el:HTMLAnchorElement, e:Event)=>{
    if(isDefaultPrevented(el, e)) return;

    if(e.type === 'mouseout'){
        this.handleUnhover();
        return;
    }

    let eventOptions:pjax.EventOptions = {
        triggerElement: el
    };

    let attrValue = checkForAbort(el, e);
    if(attrValue !== null){
        el.setAttribute(this.options.attrState, attrValue);
        return;
    }

    // If the user is hovering over the link to their current page do nothing
    // There is no reason to prefetch the same page since the reload state has unique functionality
    if(el.href !== window.location.href.split('#')[0]) el.setAttribute(this.options.attrState, 'prefetch');
    else return;

    this.handlePrefetch(el.href, eventOptions);
}

/**
 * Start by setting our pjax state attribute to nothing
 * This will prevent us to setting the listeners to an element that we've already parsed
 * Then attach the `click` event
 * Then attach the `mouseover` event
 * Then attach the `mouseout` event
 * Then attach the `keyup` event
 * For the `keyup` event check for the enter key or the enter key's key code
 * Key code is depricated but is needed for older browser support (IE<=10)
 * @param el HTMLAnchorElement
 */
export default (el:HTMLAnchorElement)=>{
    el.setAttribute(this.options.attrState, '');

    // Use clicked a link
    on(el, 'click', (e:Event)=>{ handleClick(el, e); });

    // User is hovering over a link
    on(el, 'mouseover', (e:Event)=>{ handleHover(el, e); });

    // User unhovered the link
    on(el, 'mouseout', (e:Event)=>{ handleHover(el, e); });

    // User released a key press
    on(el, 'keyup', (e:KeyboardEvent)=>{
        if(e.key === 'enter' || e.keyCode === 13) handleClick(el, e);
    });
}