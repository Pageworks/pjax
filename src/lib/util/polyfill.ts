/* tslint:disable */
// @ts-nocheck
export default ()=>{
  // Adds `Array.from()` for IE 11
  if (!Array.from) {
    Array.from = (function () {
      const toStr = Object.prototype.toString;
      const isCallable = function (fn:any) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      const toInteger = function (value:any) {
        const num = Number(value);
        if (isNaN(num)) { return 0; }
        if (num === 0 || !isFinite(num)) { return num; }
        return (num > 0 ? 1 : -1) * Math.floor(Math.abs(num));
      };
      const maxSafeInteger = Math.pow(2, 53) - 1;
      const toLength = function (value:any) {
        const len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };
  
      // The length property of the from method is 1.
      return function from(arrayLike:any){
        // 1. Let C be the this value.
        const C = this;
  
        // 2. Let items be ToObject(arrayLike).
        const items = Object(arrayLike);
  
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
  
        // 4. If mapfn is undefined, then let mapping be false.
        const mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        let T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }
  
          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
  
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        const len = toLength(items.length);
  
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method 
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        const A = isCallable(C) ? Object(new C(len)) : [len];
  
        // 16. Let k be 0.
        let k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        let kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }

  // Adds `new Event()` for IE 11
  (()=>{
    // @ts-ignore
    if ( typeof window.CustomEvent === "function" ) return false;
    function CustomEvent ( event:any, params:any ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      const evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }
  
    // @ts-ignore
    CustomEvent.prototype = window.Event.prototype;
    
    // @ts-ignore
    window.CustomEvent = CustomEvent;
  })();
}