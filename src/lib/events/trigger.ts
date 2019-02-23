/**
 * Used to dispatch custom events.
 * @param el - `Node` that the events should be fired on
 * @param events - an array of custom event names to dispatch
 * @param target - triggers custom event when set, defaults to `null`
 */
export default (el: Node, events: string[], target:Element = null)=>{
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