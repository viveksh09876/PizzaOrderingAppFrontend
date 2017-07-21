import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modsort'
})
export class ModsortPipe implements PipeTransform {

  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      let returnVal = 0;

      if((a.Option.plu_code == '999991' || 
              a.Option.plu_code == '999992' ||
                a.Option.plu_code == '999993') || (b.Option.plu_code == '999991' || 
              b.Option.plu_code == '999992' ||
                b.Option.plu_code == '999993')) {
            
                  if(a.Option.plu_code == '999992' && b.Option.plu_code == '999991') {
                    //console.log(1, a.Option.name, b.Option.name); 
                    return -1;        
                  } else if (b.Option.plu_code == '999993') {
                    //console.log(2, a.Option.name, b.Option.name);
                    return -1;
                  } else{
                    //console.log(3, a.Option.name, b.Option.name);
                    return 0;
                  }  
      } else {
       
        if(a.Option.is_checked === b.Option.is_checked) {
          returnVal = 0;
        }else if(a.Option.is_checked) {
          returnVal = -1;
        }else {
          returnVal = 1;
        }
      
      }

     return returnVal;
    
    });
    return array;
  }

}
