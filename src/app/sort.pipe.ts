import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      
      if(a.Option.is_checked || b.Option.is_checked) {

        if(a.Option.is_checked && b.Option.is_checked) {
          return 0;
        }else if(a.Option.is_checked && !b.Option.is_checked) {
          return -1;
        }else if(!a.Option.is_checked && b.Option.is_checked) {
          return 1;
        }

      }else{

        var textA = a.Option.name.toUpperCase();
        var textB = b.Option.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

       }
    });
    return array;
  }

}
