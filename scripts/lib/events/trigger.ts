/**
 * Used to dispatch custom events
 * Takes the node you want the event to be dispatched with
 * Loops through array of strings and fires each string as a custom event
 */
export default (el: Node, events: string[])=>{
    events.forEach((e)=>{
        let event = new Event(e);
        el.dispatchEvent(event);
    });
}