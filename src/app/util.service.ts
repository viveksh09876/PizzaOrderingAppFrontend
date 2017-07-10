import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() { }

  showFooter = true;

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

  updateFooterDisplay(isShow) {
    this.showFooter = isShow; 
  }



  formatFavData(item) {
    let favData = { itemId: null , itemName: null, itemSlug: null,  modifiers: [] }
    
    favData.itemId = item.Product.id;
    favData.itemName = item.Product.title;
    favData.itemSlug = item.Product.slug;

    if(item.ProductModifier.length > 0) {
      for(var i = 0; i < item.ProductModifier.length; i++) {
        let options = item.ProductModifier[i].Modifier.ModifierOption;
        let modObj = {
          modifier_id: null,
          option: []
        };

        for(var j=0; j<options.length; j++) {
          modObj.modifier_id = options[j].Modifier.id;

          if((options[j].Option.is_checked && !options[j].Option.is_included_mod)
              || (options[j].Option.add_extra)
                || (!options[j].Option.is_checked && options[j].Option.is_included_mod)) {

                let opt = {
                  id: options[j].Option.id,
                  name: options[j].Option.name,
                  plu_code: options[j].Option.plu_code,
                  is_checked: options[j].Option.is_checked,
                  is_included_mod: options[j].Option.is_included_mod,
                  is_topping: options[j].Option.is_topping,
                  no_modifier: options[j].Option.no_modifier,
                  price: options[j].Option.price,
                  quantity: options[j].Option.quantity,
                  send_code: options[j].Option.send_code,
                  send_code_permanent: options[j].Option.send_code_permanent,
                  default_checked: options[j].Option.default_checked,
                  add_extra: options[j].Option.add_extra,
                  subOption: null
                }

                let subArr = [];
                if(options[j].Option.OptionSuboption.length > 0) {
                  let subOp = options[j].Option.OptionSuboption;
                  if(subOp.length > 0) {
                    for(var k=0; k < subOp.length; k++) {
                      if(subOp.SubOption) {
                        if(subOp.SubOption.is_active) {
                          subArr.push(subOp.SubOption.id);
                        }
                      }                      
                    }
                  }
                }
                opt.subOption = subArr; 
                
                modObj.option.push(opt);
          }

        }
        
        favData.modifiers.push(modObj);
      }
    }
    //console.log(favData);

    return favData;
  }


  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  findNearbyStore(stores, userLat, UserLong) {
    let myStore = stores[0];
    let myStoreDistance = this.getDistanceFromLatLonInKm(myStore.Store.latitude, myStore.Store.longitude, userLat, UserLong);
    for(var i=0; i < stores.length; i++) {
      if(i != 0) {
        let distance = this.getDistanceFromLatLonInKm(stores[i].Store.latitude, stores[i].Store.longitude, userLat, UserLong);

        if(distance < myStoreDistance) {
          myStore = stores[i];
        }
      }
    }

    return stores[i];
  }

  formatCountryName(name) {
    if(name == 'United States' || name == 'United States of America' || name == 'USA') {
      return 'USA';
    }else if(name == 'United Arab Emirates' || name == 'UAE') {
      return 'UAE';
    }else{
      return name;
    }
  }


}
