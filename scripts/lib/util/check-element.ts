const attrState = 'data-pjax-state';

export default (el:HTMLAnchorElement)=>{
    switch(el.tagName.toLocaleLowerCase()){
        case 'a':
            if(!el.hasAttribute(attrState)) this.setLinkListeners(el);
            break;
        default:
            throw 'Pjax can only be applied on <a> elements'
    }
}