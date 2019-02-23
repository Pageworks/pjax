/**
 * This method will add the event listener to the provided element.
 * @param el - `Element` that the listener will be attached to
 * @param event - event that should be attached
 * @param listener - `EventListener` callback method
 */
export default (el:Element, event:string, listener:EventListener)=>{
    el.addEventListener(event, listener);
}