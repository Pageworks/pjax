export default (el: Node, events: string[])=>{
    events.forEach((e)=>{
        let event = new Event(e);
        el.dispatchEvent(event);
    });
}