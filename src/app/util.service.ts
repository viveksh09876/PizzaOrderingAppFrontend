import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }


  calculateOverAllCost(items) {
    let overAllPrice = 0;

    if(items != null) {
      for(var i=0; i < items.length; i++) {
      
        overAllPrice += parseInt(items[i].totalItemCost);
      }
    }
    

    return overAllPrice;
  }


  toISOString(date) {
      var dt = new Date(date);
      var tzo = -dt.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return dt.getFullYear() +
        '-' + pad(dt.getMonth() + 1) +
        '-' + pad(dt.getDate()) +
        'T' + pad(dt.getHours()) +
        ':' + pad(dt.getMinutes()) +
        ':' + pad(dt.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);  
  }


}
