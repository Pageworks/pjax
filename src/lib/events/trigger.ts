/**
 * Used to dispatch custom events
 * Takes the node you want the event to be dispatched with
 * Loops through array of strings and fires each string as a custom event
 * @param {Node} el
 * @param {Array<string>} events
 * @param {HTMLAnchorElement} target Triggers custom event when set, defaults to `null`
 */
export default (el: Node, events: string[], target:HTMLAnchorElement = null)=>{
    events.forEach((e)=>{
        if(target !== null){
            const customEvent = new CustomEvent(e, {
                detail:{
                    el: target
                }
            });
            el.dispatchEvent(customEvent);
        }else{
            const event = new Event(e);
            el.dispatchEvent(event);
        }
    });
}