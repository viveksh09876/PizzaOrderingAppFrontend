import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-ordernowmodal',
  templateUrl: './ordernowmodal.component.html',
  styleUrls: ['./ordernowmodal.component.css']
})
export class OrdernowmodalComponent extends DialogComponent<OrdernowModal, null> implements OnInit{

  constructor(dialogService: DialogService, private dataService: DataService, private router: Router) {
    super(dialogService);
   }

  
  userCountryName = '';
  userCountryCode = '';
  cityList = [];
  storeList = [];
  areaList = { areas: [], streets: []};
  selectedStore = { info: null, val: ''};
  showContent = 'pickup-delivery';
  cityVal = '';
  areaVal = '';
  postalCode = '';
  delivery_state = '';
  delivery_apartment = '';
  delivery_streetno = '';
  delivery_street = '';
  showOutletError = false;
  delivery_time = new Date();
  showTimeError = '';
  curDate = new Date();
  showStoreLoading = false;
  timeModalText = '';
  useStreetDb = false;
  streetArr = [];
  selectedStreet = '';
  citySource = [];
  showCityList = false;
  showAreaList = false;

  order = {
    orderType: 'pickup',
    delivery_time_type: 'asap',
    selectedStore: this.selectedStore
  };


  ngOnInit() {
    
    this.userCountryName = this.dataService.getLocalStorageData('userCountry');
    this.userCountryCode = this.dataService.getLocalStorageData('userCountryCode');
    if (this.userCountryName != undefined && this.userCountryName != null && this.userCountryName != '') {
      this.userCountryName = 'uae';  //hardcode for testing
      if (this.userCountryName.toLowerCase() == 'uae' || this.userCountryName.toLowerCase() == 'united arab emirates') {
        this.useStreetDb = true;
      }
    }
  }


  updateOrderType(type) {
    this.order.orderType = type;
    this.selectedStore.info = null;
    this.selectedStore.val = ''

    if(type == 'pickup') {
      this.timeModalText = 'What time would you like to pick up your order?';
    }else if(type == 'delivery') {
      this.timeModalText = 'What time would you like your order to be delivered?';
    }
  }

  selectCity(city) {
    this.getStores(city);
    this.cityVal = city;
    this.showCityList = false;
  }

  selectArea(area) {
    this.getAreaStreets(area);
    this.areaVal = area;
    this.showAreaList = false;
  }

  getCities(searchKey) {

    if(searchKey.length > 2) {
      this.dataService.getCitiesSuggestions(this.userCountryCode, searchKey)
            .subscribe(data => {            
                this.cityList = data;
                this.showCityList = true;
                this.getStores(searchKey);
            });
    }
  
  }

  getStreetArea(searchKey) {
    if(searchKey.length > 1) {
      this.dataService.getAreaSuggestions(this.userCountryName, searchKey)
            .subscribe(data => {
                this.areaList = data;
                this.showAreaList = true;
                this.order['delivery_state'] = this.areaList.areas[0].state;
                this.getAreaStreets(this.areaList.areas[0].city);
            });
    }
  }


  getAreaStreets(area) {
    let streets = [];
    if(area != '' && this.areaList.streets.length > 0) {
      for(var i=0; i<this.areaList.streets.length; i++) {
        if(this.areaList.streets[i].area_name == area) {
          streets.push(this.areaList.streets[i]);
        }
      }
      if (streets.length > 0) {
        //console.log(streets);
        this.streetArr = streets;
      }
    }
  } 


  getAreaStores(street) {
    let stores = [];
    this.showStoreLoading = true;
    if(street != '' && this.areaList.streets.length > 0) {
      for(var i=0; i<this.areaList.streets.length; i++) {
        if(this.areaList.streets[i].street_name == street) {
          let storeObj = {
            Store: this.areaList.streets[i].Store
          }
          stores.push(storeObj);
        }
      }
    }
    this.storeList = stores;
  }


  getStores(cityVal) {
    this.showStoreLoading = true;
    this.dataService.getStoreList(cityVal)
          .subscribe(data => {                    
                    this.storeList = data;   
                    this.showStoreLoading = false;                 
                }); 
  }

  getStoresFromPostalCode(postal_code) {
    this.showStoreLoading = true;
    this.dataService.getStoresFromPostalCode(postal_code)
        .subscribe(data => {                    
                    this.storeList = data;
                    this.showStoreLoading = false;                    
                }); 
  }


  setSelectedStore(id) {    
    if(id != '') { 
      let stores = this.storeList;     
      for(var i=0; i<stores.length; i++) {
         if(stores[i].Store.id == id) {
           this.selectedStore.info = stores[i];
           break;
         } 
      }

      this.showOutletError = false;    
    }else{
      this.showOutletError = true;
    }
  }

  goTotimeModal() {
    //this.getCurrentDateTime();
    if(this.selectedStore.val == '') {
      this.showOutletError = true;
    }else{
      this.order.selectedStore = this.selectedStore.info;
      this.showContent = 'delivery-time';
    }
  }

  updateDeliveryTimeType(type) {
    this.order.delivery_time_type = type;
    this.showOutletError = false;
  }

  goToMenu() {
  
    if(this.selectedStore.info != '') {

        let orderDetails = {
            
              type: this.order.orderType,
              delivery_time_type: this.order.delivery_time_type,
              delivery_time: this.delivery_time,
              selectedStore: this.order.selectedStore,
              address: {
                apartment: this.delivery_apartment,
                streetNo: this.delivery_streetno,
                street: this.delivery_street,
                city: this.cityVal,
                state: this.delivery_state,
                postal_code: this.postalCode
              
            }
        }

        if(orderDetails.type == 'delivery' && orderDetails.delivery_time_type == 'defer') {
           if(orderDetails.delivery_time == null) {
            this.showTimeError = 'Please select delivery date/time';
          }
        }


        this.dataService.setLocalStorageData('order-now', JSON.stringify(orderDetails));
        this.close();
        this.router.navigate(['/menu']);
        window.location.reload();
    }else{
      this.showOutletError = true;
    }
    
  }


  getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.dataService.getStoresFromLatLong(position.coords.latitude, position.coords.longitude)
              .subscribe(data => {             
                    this.cityVal = data.cityVal;
                    this.postalCode = data.postalCode;      
                    this.storeList = data.stores;                    
                }); 
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
  }

  getCurrentDateTime() {
    let now = new Date();
    now.setMinutes(now.getMinutes() + 30);
  }

}

export interface OrdernowModal {

}
