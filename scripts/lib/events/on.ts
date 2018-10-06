export default (el:HTMLAnchorElement, event:string, listener:EventListener)=>{
    el.addEventListener(event, listener);
}