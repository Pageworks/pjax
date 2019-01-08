"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    if (!Array.from) {
        Array.from = (function () {
            var toStr = Object.prototype.toString;
            var isCallable = function (fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {
                var num = Number(value);
                if (isNaN(num)) {
                    return 0;
                }
                if (num === 0 || !isFinite(num)) {
                    return num;
                }
                return (num > 0 ? 1 : -1) * Math.floor(Math.abs(num));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };
            return function from(arrayLike) {
                var C = this;
                var items = Object(arrayLike);
                if (arrayLike == null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }
                var len = toLength(items.length);
                var A = isCallable(C) ? Object(new C(len)) : [len];
                var k = 0;
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    }
                    else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                A.length = len;
                return A;
            };
        }());
    }
});
//# sourceMappingURL=polyfill.js.map