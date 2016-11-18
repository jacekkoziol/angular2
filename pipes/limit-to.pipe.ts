// API Doc: https://docs.angularjs.org/api/ng/filter/limitTo

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo',
  pure: false
})
export class LimitToPipe implements PipeTransform {

  private isString(value) {return typeof value === 'string';}
  private isNumber(value) {return typeof value === 'number';}
  private isWindow(obj) {return obj && obj.window === obj;}

  private isArrayLike(obj) {
    if (obj == null || this.isWindow(obj)) return false;
    if (Array.isArray(obj) || this.isString(obj)) return true;

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    var length = "length" in Object(obj) && obj.length;

    // NodeList objects (with `item` method) and
    // other objects with suitable length characteristics are array-like
    return this.isNumber(length) &&
      (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item == 'function');
  }

  private sliceFn(input, begin, end) {
    if (this.isString(input)) return input.slice(begin, end);

    return Array.prototype.slice.call(input, begin, end);
  }


  transform(input:any, limit:any, begin?:any): any {
    if (Math.abs(Number(limit)) === Infinity) {
      limit = Number(limit);
    } else {
      limit = parseInt(limit, 10);
    }

    if (isNaN(limit)) return input;

    if (this.isNumber(input)) input = input.toString();
    if (!this.isArrayLike(input)) return input;

    begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin, 10);
    begin = (begin < 0) ? Math.max(0, input.length + begin) : begin;

    if (limit >= 0) {
      return this.sliceFn(input, begin, begin + limit);
    } else {
      if (begin === 0) {
        return this.sliceFn(input, limit, input.length);
      } else {
        return this.sliceFn(input, Math.max(0, begin + limit), begin);
      }
    }
  }
}
