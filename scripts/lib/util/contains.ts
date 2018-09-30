export default (doc: Document, selectors: string[], element: Element)=>{
    selectors.map((selector)=>{
        let selectorEls = doc.querySelectorAll(selector);
        selectorEls.forEach((el)=>{
            if(el.contains(element)){
                return true;
            }
        });
    });

    return false;
}