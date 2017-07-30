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
  selectedFavItemData = null;

  
  getSlides(lang_id): Observable<any>{

    return this.http.get( this.domain + '/webservice/get_slides/'+lang_id)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }
  
  getMenuData(storeId, country): Observable<any>{

    return this.http.get( this.domain + '/webservice/get_all_categories_data/'+storeId+ '/'+country)
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

  getItemData(slug, menuCountry): Observable<any>{
    if(menuCountry == null) {
      menuCountry = 'UAE';
    }
    return this.http.get( this.domain + '/webservice/getItemData/'+slug+'/'+menuCountry)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  setLocalStorageData(key, data) {
    localStorage.setItem(key, data);
  }
 
  getLocalStorageData(key) {
    return localStorage.getItem(key);
  }

  clearLocalStorageData() {
    localStorage.clear();
    return;
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
   
  getAreaSuggestions(country, searchKey): Observable<any>{   
    return this.http.get( this.domain + '/webservice/getAreaSuggestion/'+country+'/'+searchKey)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 


  getStoreList(city): Observable<any>{   
    return this.http.get( this.domain + '/webservice/getStoreList/'+city)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }
                  
  
  getAreaStoreList(street): Observable<any>{   
    return this.http.get( this.domain + '/webservice/getAreaStoreList/'+street)
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
                  
  getStoreDetailsByStoreId(id): Observable<any>{   
  
    return this.http.get( this.domain + '/webservice/getStoreDetailsByStoreId/'+id)
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

   sendContactInfo(ContactInfo): Observable<any>{   
    let data = ContactInfo;
    return this.http.post( this.domain + '/webservice/sendContactInfo', data)
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
                
  }

  sendCareerInfo(CareerInfo): Observable<any>{   
    let data = CareerInfo;
    return this.http.post( this.domain + '/webservice/sendCareerInfo', data)
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
                
  }

  getCountryStore(countryName): Observable<any>{
    return this.http.get( this.domain + '/webservice/getCountryStores/'+countryName)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getPrefreces(): Observable<any>{
    return this.http.get( this.domain + '/webservice/getPrefrences/')
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }
  
  getUserPrefreces(userId): Observable<any>{
    return this.http.get( this.domain + '/webservice/getUserPrefreces/'+userId)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }
  
  registerUser(userInfo): Observable<any>{   
    let data = userInfo;
    return this.http.post( this.domain + '/webservice/signUp', data)
                    .map((res: Response) => res.json())
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
                
  }

  getFav(type, userId): Observable<any>{

    return this.http.get( this.domain + '/webservice/getFav/'+ type + '/' + userId)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  
  setSelectedFavItemData(data){
    this.selectedFavItemData = data;
  }

  getSelectedFavItemData(): Observable<any>{
    return this.selectedFavItemData;
  }


  getformattedFavData(favData, menuCountry): Observable<any>{
  if(menuCountry == null) {
      menuCountry = 'UAE';
    }
      var data = { menuCountry: menuCountry, favData: favData };
      return this.http.post( this.domain + '/webservice/getFavItemData', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  applyCoupon(orderData): Observable<any>{
        return this.http.post( this.domain + '/webservice/applyCoupon', orderData)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  getFavOrderData(orderData, menuCountry): Observable<any>{
  if(menuCountry == null) {
      menuCountry = 'UAE';
    }
        var data = { menuCountry: menuCountry, orderData: orderData };
        return this.http.post( this.domain + '/webservice/getFavOrderData', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 

  getProfile(userId): Observable<any>{

    return this.http.get( this.domain + '/webservice/getProfile/'+ userId)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  updateProfile(userData): Observable<any>{
        var data = userData;
        return this.http.post( this.domain + '/webservice/updateProfile', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 
  
   updatePrefrence(userData): Observable<any>{
        var data = userData;
        return this.http.post( this.domain + '/webservice/updatePrefrence', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 

  getOrderHistory(userId): Observable<any>{
    return this.http.get( this.domain + '/webservice/getOrderHistory/'+ userId)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  }

  addAddress(userData): Observable<any>{
        var data = userData;
        return this.http.post( this.domain + '/webservice/addAddress', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 

  editAddress(userData): Observable<any>{
        var data = userData;
        return this.http.post( this.domain + '/webservice/editAddress', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 
                

  deleteAddress(userData): Observable<any>{
        var data = userData;
        return this.http.post( this.domain + '/webservice/deleteAddress', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 
  
   setAsDefault(userData): Observable<any>{
        var data = userData;
        return this.http.post( this.domain + '/webservice/setAsDefault', data)
                  .map((res: Response) => res.json())
                  .catch( (error: any) => Observable.throw(error.json().error || 'server error') );
  } 

   getPageInfo(pageId): Observable<any>{
        return this.http.get( this.domain + '/webservice/getPageInfo/'+ pageId)
                    .map( (res: Response) => res.json() )
                    .catch( (error: any) => Observable.throw(error.json().error || 'server error') );

  } 

  
}
