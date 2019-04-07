export {Pjax as default};

export as namespace Pjax;

declare class Pjax {
    constructor(options?: Partial<Pjax.IOptions>);
    public static load: (url:string)=>void;
}

declare namespace Pjax{
    export interface IOptions{
        elements?:                      string;
        selectors?:                     Array<string>;
        history?:                       boolean;
        cacheBust?:                     boolean;
        debug?:                         boolean;
        titleSwitch?:                   boolean;
        customTransitions?:             boolean;
        customPreventionAttributes?:    Array<string>;
        importScripts?:                 boolean;
        importCSS?:                     boolean;
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