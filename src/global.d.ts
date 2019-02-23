export {Pjax as default};

export as namespace Pjax;

declare class Pjax {
    constructor(options?: Partial<Pjax.IOptions>);
}

declare namespace Pjax{
    export interface IOptions{
        elements?:          string;
        selectors?:         string[];
        history?:           boolean;
        cacheBust?:         boolean;
        debug?:             boolean;
        timeout?:           number;
        titleSwitch?:       boolean;
        customTransitions?: boolean;
    }

    export interface IScrollPosition{
        x:  number;
        y:  number;
    }
    
    export interface ICacheObject{
        status:     number;
        document:   Document;
        url:        string;
    }
    
    export interface IEventOptions{
        triggerElement: Element;
    }
    
    export interface ISwitchObject{
        new:        Element;
        current:    Element;
    }
    
    export interface ICachedSwitchOptions{
        queue:  Array<ISwitchObject>;
        title?: string;
    }
}