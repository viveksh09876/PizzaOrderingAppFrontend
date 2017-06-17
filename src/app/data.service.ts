import { Injectable } from '@angular/core';
import { Http, Response, Jsonp  } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  constructor(private http: Http, private jsonp:Jsonp) { }

  domain = 'http://mavin360.com/demo/nkd/dev';

  
  getSlides(lang_id): Observable<any>{

    return this.http.get( this.domain + '/webservice/get_slides/'+lang_id)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }
  
  getMenuData(lang_id): Observable<any>{

    return this.http.get( this.domain + '/webservice/get_all_categories_data/'+lang_id)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getAllBanners(): Observable<any>{
    return this.http.get( this.domain + '/webservice/get_slides')
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getIp(): Observable<any>{
    return this.http.get( this.domain + '/webservice/getip')
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getItemData(slug): Observable<any>{
    return this.http.get( this.domain + '/webservice/getItemData/'+slug)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  setLocalStorageData(key, data) {
    localStorage.setItem(key, data);
  }
 
  getLocalStorageData(key) {
    return localStorage.getItem(key);
  }

  placeOrder(data): Observable<any>{
   
  
    return this.http.post( this.domain + '/webservice/placeOrder', data)
                    .map( (res: Response) => {
                      res.json() 
                    })
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


                  
  }

}
