import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(input:Array<any>, search:string, fields?:Array<string>): Array<any> {
    let searchRegExp = new RegExp('.*' + this.escapeRegExp(search.trim()) + '.*', 'ig');
    console.clear();
    if (!search.trim().length) {
      return input;
    }

    let result = input.filter((val, i) => {
      if (typeof val !== 'string' && typeof val !== 'number') {
        return this.searchInObject(searchRegExp, val, fields);
      }

      return String(val).indexOf(search) != -1;
    });

    return result;
  }

  private searchInObject (pattern:RegExp, objectToSearch:Object, fieldsToSearch?:Array<string>):boolean {
    let hasMatch = false;

    for (let item in objectToSearch) {
      if (objectToSearch.hasOwnProperty(item) && this.canBeSearched(objectToSearch[item]) ) {
        if(fieldsToSearch && fieldsToSearch.length) {
          if(pattern.test(String(objectToSearch[item])) && fieldsToSearch.indexOf(item) != -1) {
            hasMatch = true;
            break;
          }
        } else {
          if(pattern.test(String(objectToSearch[item]))) {
            hasMatch = true;
            break;
          }
        }
      }
    }

    return hasMatch;
  }

  private canBeSearched (fieldValue:any) {
    return (typeof fieldValue === 'string' || typeof fieldValue === 'number') || false;
  }

  private escapeRegExp (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

}
