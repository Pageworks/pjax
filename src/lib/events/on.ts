/**
 * This method will add our desired event listener to the provided element
 * and will call the desired listener callback when the event is fired
 * @param {HTMLAnchorElement} el
 * @param {string} event
 * @param {EventListener} listener
 */
export default (el:HTMLAnchorElement, event:string, listener:EventListener)=>{
    el.addEventListener(event, listener);
}