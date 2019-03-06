// Function Imports
import on from './on';
import Pjax from '../../pjax';

const attrState:string = 'data-pjax-state';

/**
 * Check if the event should be prevented.
 * @param el - `Element` to check
 * @param e - `Event` that triggered the check
 */
const isDefaultPrevented = (el:Element, e:Event, options:Array<string>)=>{
    let isPrevented = false;
    if(e.defaultPrevented){
        isPrevented = true;
    }
    else if(el.getAttribute('prevent-pjax') !== null){
        isPrevented = true;
    }
    else if(el.classList.contains('no-transition')){
        isPrevented = true;
    }
    else if(el.getAttribute('download') !== null){
        isPrevented = true;
    }
    else if(el.getAttribute('target') === '_blank'){
        isPrevented = true;
    }

    // Check for custom prevention attributes
    if(options.length > 0){
        for(let i = 0; i < options.length; i++){
            if(el.getAttribute(options[i]) !== null){
                isPrevented = true;
            }
        }
    }
    
    return isPrevented;
}

/**
 * Check for link types and edge cases so we can abort if needed.
 * This method prevents us from breaking some default browser behaviors.
 * @param el - `Element` to check
 * @param e - `Event` that triggered the check
 */
const checkForAbort = (el:Element, e:Event)=>{
    if(el instanceof HTMLAnchorElement){
        // Ignore external links
        if(el.protocol !== window.location.protocol || el.host !== window.location.host){
            return 'external';
        }

        // Ignore anchors on the same page
        if(el.hash && el.href.replace(el.hash, '') === window.location.href.replace(location.hash, '')){
            return 'anchor';
        }

        // Ignore empty anchor
        if(el.href === `${window.location.href.split('#')[0]}, '#'`){
            return 'anchor-empty';
        }
    }

    return null;
}

/**
 * Called when the `click` event is fired.
 * @param el - `Element` that the event was fired on
 * @param e - `Event` that was fired
 * @param pjax - reference to the `Pjax` class object
 */
const handleClick = (el:Element, e:Event, pjax:Pjax)=>{
    
    // Check if Pjax should ignore the event
    if(isDefaultPrevented(el, e, pjax.options.customPreventionAttributes)){
        return;
    }

    // Check what type of link Pjax is working with
    const attrValue = checkForAbort(el, e);
    
    // If the link is an external reference or a page jump do nothing
    if(attrValue !== null){
        el.setAttribute(attrState, attrValue);
        return;
    }

    e.preventDefault();

    const elementLink = el.getAttribute('href');

    // Don't do 'nothing' if the user is trying to reload the page by clicking on the same link twice
    if(elementLink === window.location.href.split('#')[0]){
        el.setAttribute(attrState, 'reload');
    }else{
        el.setAttribute(attrState, 'load');
    }
    
    pjax.handleLoad(elementLink, el.getAttribute(attrState), el);
}

/**
 * 
 * @param el - `Element` that the event was fired on
 * @param e - `Event` that was fired
 * @param pjax - reference to the `Pjax` class object
 */
const handleHover = (el:Element, e:Event, pjax:Pjax)=>{
    
    // Check if Pjax should ignore the event
    if(isDefaultPrevented(el, e, pjax.options.customPreventionAttributes)){
        return;
    }

    // Check if Pjax should clear the prefetch
    if(e.type === 'mouseleave'){
        pjax.clearPrefetch();
        return;
    }

    // Check what type of link Pjax is working with
    const attrValue = checkForAbort(el, e);
    
    // If the link is an external reference or a page jump do nothing
    if(attrValue !== null){
        el.setAttribute(attrState, attrValue);
        return;
    }

    const elementLink = el.getAttribute('href');

    // If the user is hovering over the link to their current page do nothing
    if(elementLink !== window.location.href.split('#')[0]){
        el.setAttribute(attrState, 'prefetch');
    }else{
        return;
    }

    pjax.handlePrefetch(elementLink);
}

export default (el:Element, pjax:any)=>{
    el.setAttribute(attrState, '');

    // Use clicked a link
    on(el, 'click', (e:Event)=>{ handleClick(el, e, pjax); });

    // User is hovering over a link
    on(el, 'mouseenter', (e:Event)=>{ handleHover(el, e, pjax); });

    // User unhovered the link
    on(el, 'mouseleave', (e:Event)=>{ handleHover(el, e, pjax); });

    // User released a key press
    on(el, 'keyup', (e:KeyboardEvent)=>{
        if(e.key === 'enter' || e.keyCode === 13) handleClick(el, e, pjax);
    });
}