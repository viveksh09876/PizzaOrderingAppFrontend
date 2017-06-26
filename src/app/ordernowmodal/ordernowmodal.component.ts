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
  selectedStore = { info: null, val: ''};
  showContent = 'pickup-delivery';
  cityVal = '';
  postalCode = '';
  delivery_state = '';
  delivery_apartment = '';
  delivery_streetno = '';
  delivery_street = '';
  showOutletError = false;
  delivery_time = new Date();
  showTimeError = '';
  curDate = new Date();


  order = {
    orderType: 'pickup',
    delivery_time_type: 'asap',
    selectedStore: this.selectedStore
  };


  ngOnInit() {
    this.getUserIp();
  }


  getUserIp() {
    this.dataService.getIp()
          .subscribe(data => {
             
              this.userCountryName = data.geoplugin_countryName;
              this.userCountryCode = data.geoplugin_countryCode;
              
          });
  }

  updateOrderType(type) {
    this.order.orderType = type;
    this.selectedStore.info = null;
    this.selectedStore.val = ''
  }

  getCities(searchKey) {

    if(searchKey.length > 2) {
      this.dataService.getCitiesSuggestions(this.userCountryCode, searchKey)
            .subscribe(data => {
                
                this.cityList = data;
                
            });
    }
  
  }

  getStores(cityVal) {
    
    this.dataService.getStoreList(cityVal)
          .subscribe(data => {                    
                    this.storeList = data;                    
                }); 
  }

  getStoresFromPostalCode(postal_code) {
    this.dataService.getStoresFromPostalCode(postal_code)
        .subscribe(data => {                    
                    this.storeList = data;                    
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
    console.log(now);
  }

}

export interface OrdernowModal {

}
