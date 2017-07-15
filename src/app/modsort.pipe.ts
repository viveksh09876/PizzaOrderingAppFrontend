import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modsort'
})
export class ModsortPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      let returnVal = 0;
      if(a.Option.is_checked === b.Option.is_checked) {
        returnVal = 0;
      }else if(a.Option.is_checked) {
        returnVal = -1;
      }else {
        returnVal = 1;
      }
      //console.log(a.Option.name,a.Option.is_checked, b.Option.name,b.Option.is_checked, returnVal);
     return returnVal;
    });
    return array;
  }

}
