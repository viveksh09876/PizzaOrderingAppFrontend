import { Injectable } from '@angular/core';
import { Http, Response, Jsonp  } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

  constructor(private http: Http, private jsonp:Jsonp) { }

  domain = environment.cmsApiPath;

  
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
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


                  
  }

  getCitiesSuggestions(countryCode, searchKey): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getCitiesSuggestion/'+searchKey+'/'+countryCode)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


  }   


  getStoreList(city): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getStoreList/'+city)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


  }  

  getStoresFromPostalCode(code): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getStoresFromPostalCode/'+code)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


  } 

  getStoresFromLatLong(lat, lng): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getStoresFromLatLong/'+lat+'/'+lng)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


  }   

  getStoreDetails(id): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getStoreDetails/'+id)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


  }   


  login(username, password): Observable<any>{   
    
    let data = { username: username, password: password};
    return this.http.post( this.domain + '/webservice/login', data)
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
                
  }


  getTwitterFeeds(name): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getTwitterFeeds/'+name)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );


  }

  saveFavItem(userId, favTitle, itemData, type): Observable<any>{   
    
    let data = {  user_id: userId,
                  fav_name: favTitle,
                  fav_type: type,
                  fav_detail: itemData
                };
    return this.http.post( this.domain + '/webservice/saveFavItem', data)
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
                
  }

  getFbFeeds(name): Observable<any>{

    return this.http.get( this.domain + '/webservice/getFbFeed/'+name)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getIgFeeds(name): Observable<any>{

    return this.http.get( this.domain + '/webservice/getIgFeed/'+name)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  sendCateringInfo(cateringInfo): Observable<any>{   
    let data = cateringInfo;
    return this.http.post( this.domain + '/webservice/sendCateringInfo', data)
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
                
  }


}
