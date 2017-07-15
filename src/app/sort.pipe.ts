import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {

      let opt_a = 0; 
      let opt_b = 0;

      // if(a.Option.is_checked) {
      //   opt_a = 1;
      // }

      // if(b.Option.is_checked) {
      //   opt_b= 1;
      // } 

      //alphabetical
     // if(opt_a == 0 && opt_b == 0) {
       //console.log(a, b)
        if(a.Option.name < b.Option.name) return -1;
        if(a.Option.name > b.Option.name) return 1;
        return 0;
      //}
      //console.log(a,b);
      // let opt_a = 0; 
      // let opt_b = 0;

      // if(a.Option.is_checked) {
      
      // }
      // if(a.Option.is_included_mod) {
      //   opt_a = 1;
      // }else{
      //   opt_a = 0;
      // }

      // if(b.Option.is_included_mod) {
      //   opt_b = 1;
      // }else{
      //   opt_b = 0;
      // }

//      return (a === b)? 0 : a? -1 : 1;

    });
    return array;
  }

}
