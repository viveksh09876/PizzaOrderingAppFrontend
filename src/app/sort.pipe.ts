import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {

      let opt_a = 0; 
      let opt_b = 0;

      if(a.Option.is_included_mod) {
        opt_a = 1;
      }else{
        opt_a = 0;
      }

      if(b.Option.is_included_mod) {
        opt_b = 1;
      }else{
        opt_b = 0;
      }

      return (opt_a === opt_b)? 0 : opt_a? -1 : 1;

    });
    return array;
  }

}
