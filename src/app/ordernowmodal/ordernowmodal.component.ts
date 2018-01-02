import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';
import {DateRangePickDirective} from '../date-range-pick.directive';
import { DateRange } from '../date-range';
import { environment } from '../../environments/environment';

declare var moment: any;
declare var $: any;

@Component({
  selector: 'app-ordernowmodal',
  templateUrl: './ordernowmodal.component.html',
  styleUrls: ['./ordernowmodal.component.css']
})
export class OrdernowmodalComponent extends DialogComponent<OrdernowModal, boolean> implements OnInit{

  constructor(dialogService: DialogService, private dataService: DataService, private router: Router, private utilService: UtilService) {
    super(dialogService);
   }

  dateRange:DateRange=new DateRange({});
   
  curDateTime = this.utilService.formatDate(this.utilService.getNowDateTime(35));
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
  delivery_time = this.curDateTime;
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
  time = { hour: '01', minutes: '00' };
  showStoreTimeError = false;
  storeImg = null;
  storeTimeObj = {
    fromTime: null,
    toTime: null
  }

  hours = [];
  minutes = this.utilService.getMinutes();
  isInTimeRange = true;

  order = {
    orderType: 'pickup',
    delivery_time_type: 'asap',
    selectedStore: this.selectedStore
  };

   
  pickerOptions: Object = {
    'showDropdowns': true,
    'singleDatePicker': true,
    'timePicker': true,
    'startDate': this.utilService.getNowDateTime(35),
    'minDate': this.utilService.getNowDateTime(35),
    'autoUpdateInput': true,
    'timePickerIncrement': 5,    
    locale: {
            format: 'YYYY/MM/DD hh:mm A',
            'applyLabel': 'Submit',
            'cancelLabel': 'Close'
        }
  };

  fromObj = this.fromObj;


  ngOnInit() {
    
    this.userCountryName = this.dataService.getLocalStorageData('userCountry');
    this.userCountryCode = this.dataService.getLocalStorageData('userCountryCode');
    if (this.userCountryName != undefined && this.userCountryName != null && this.userCountryName != '') {
     // this.userCountryName = 'uae';  //hardcode for testing
      if (this.userCountryName.toLowerCase() == 'uae' || this.userCountryName.toLowerCase() == 'united arab emirates') {
        this.useStreetDb = true;
        this.order['delivery_state'] = 'UAE';
      }
    }

    let user_details = this.dataService.getLocalStorageData('user-details');
    if (user_details != undefined) {
      user_details = JSON.parse(user_details);

      if (user_details['defaultAddress'] != null) {
        this.cityVal = user_details['defaultAddress'].city;
        this.areaVal = user_details['defaultAddress'].city;
        this.postalCode = user_details['defaultAddress'].postal_code;
        this.delivery_streetno = user_details['defaultAddress'].streetNo;
        this.delivery_apartment = user_details['defaultAddress'].apartment;
        this.order['delivery_state'] = user_details['defaultAddress'].state;
        
      }
    }

  // code for default selection and open time popup only when user click oon time change 
    let orderNowDetails = JSON.parse(this.dataService.getLocalStorageData('order-now')); 
    //console.log('odert',orderNowDetails);
    if(orderNowDetails!=null && orderNowDetails!='null'){
      this.postalCode=orderNowDetails.address.city;
      this.storeList = JSON.parse(this.dataService.getLocalStorageData('storeList')); 
      if(this.storeList==null){
        this.getStores(this.areaVal);
      }


      if(this.storeList != null){
      this.selectedStore.val=orderNowDetails.selectedStore.Store.id;
      this.setSelectedStore(this.selectedStore.val);
      let timeselector_click = JSON.parse(this.dataService.getLocalStorageData('timeselector-click')); 
      if(timeselector_click=='time'){
        this.order.delivery_time_type=orderNowDetails.delivery_time_type;
        this.goTotimeModal();
       }
     }
    }
  }


  dateSelected(dateRange:DateRange) {
    this.dateRange=dateRange;
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
    this.cityVal = area;
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
                if (this.areaList.areas[0] != undefined) {
                  this.order['delivery_state'] = this.areaList.areas[0].country;
                  this.getAreaStreets(this.areaList.areas[0].city);
                }
                
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

    if (stores.length > 0) {
      this.selectedStore.val = stores[0].Store.id;
      this.setSelectedStore(stores[0].Store.id);
    }
  }


  getStores(cityVal) {
    this.showStoreLoading = true;
    this.dataService.getStoreList(cityVal)
          .subscribe(data => {                    
                    this.storeList = data;
                    this.selectedStore.val = data[0].Store.id;
                    this.setSelectedStore(data[0].Store.id);
                    this.showStoreLoading = false;
                    this.dataService.setLocalStorageData('storeList', JSON.stringify(data));
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

      let cDate = new Date();
      let cDay = cDate.getDay();
      let storeTime = null;
      let stores = this.storeList;    
      let storeFromTime = null;
      let storeToTime = null; 
      
      let cTime = moment().format('hh:mm a');

      for(var i=0; i<stores.length; i++) {
         if(stores[i].Store.id == id) {
           this.selectedStore.info = stores[i];

          /* if (stores[i].StoreTime != undefined) {

              for (var j=0; j < stores[i].StoreTime.length; j++) {
                  if (stores[i].StoreTime[j].from_day == cDay) {
                    storeTime = stores[i].StoreTime[j];
                  }
              } 

              storeFromTime = storeTime.from_time + ":" + storeTime.from_minutes;
              storeFromTime = moment(storeFromTime, 'HH:mm').format('hh:mm a');

              storeToTime = storeTime.to_time + ":" + storeTime.to_minutes;
              storeToTime = moment(storeToTime, 'HH:mm').format('hh:mm a');
              
              this.storeTimeObj.fromTime = storeFromTime;
              this.storeTimeObj.toTime = storeToTime;
           }*/
           

           //inTimeRange = this.utilService.inTimeRange(cTime, storeFromTime, storeToTime);

           this.storeImg = environment.cmsApiPath + '/' + stores[i].Store.store_image;
           this.order['delivery_state'] = stores[i].Store.state;
           break;
         } 
      }

      this.showOutletError = false;    
    }else{
      this.showOutletError = true;
    }
  }


  checkTimeRange(delivery_time) {
        
      this.isInTimeRange=this.utilService.getAllDateRange(this.selectedStore.info.StoreTime,delivery_time);
      return this.isInTimeRange;
  }


  updateTime() {
    var self = this;
    setTimeout(function() {
      this.delivery_time = $('#DateTimeDel').val(); 
      this.isInTimeRange = self.checkTimeRange(this.delivery_time);
      
    }, 800);
    
  }


  goTotimeModal() {
    //this.getCurrentDateTime();
    if(this.selectedStore.val == '') {
      this.showOutletError = true;
    }else{
      
      this.isInTimeRange = this.checkTimeRange(this.delivery_time);
      this.order.selectedStore = this.selectedStore.info;
      this.showContent = 'delivery-time';

    }
  }

  updateDeliveryTimeType(type) {
    this.order.delivery_time_type = type;
    this.showOutletError = false;
    this.time.hour = '01';

    
    this.isInTimeRange = this.checkTimeRange(this.delivery_time);
    
  }

  goToMenu(checkValidation) {
  
    if(this.selectedStore.info != '') {
      this.delivery_time = $("#DateTimeDel").val();

      let cTime = moment(this.delivery_time, 'YYYY-MM-DD HH:mm A').format('hh:mm a');
      
      //let cTime = moment().format('hh:mm a');
      let inTimeRange  = true;

      if (this.storeTimeObj.fromTime != undefined && this.storeTimeObj.toTime != undefined && checkValidation == 1) {
          inTimeRange = this.utilService.inTimeRange(cTime, this.storeTimeObj.fromTime, this.storeTimeObj.toTime);
          this.isInTimeRange = inTimeRange;
      }
      
      if (inTimeRange) {
        
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

        if (this.fromObj != null && this.fromObj != undefined && this.fromObj.modCount != undefined) {

          if (this.fromObj.modCount > 0) {

            this.close();

            if (this.fromObj.isDeal != undefined) {
              this.router.navigate(['/item/deal/', this.fromObj.dealId, this.fromObj.comboUniqueId, this.fromObj.selectedDealMenuCatIndex, this.fromObj.slug]); 
            } else {
              this.router.navigate(['/item', this.fromObj.slug]); 
            }
            

          } else {

            this.dataService.getItemData(this.fromObj.slug, this.fromObj.menuCountry)
            .subscribe(data => {
                 
                  data.originalItemCost = data.Product.price;
                  data.totalItemCost = data.Product.price;
                  let temp = this.dataService.getLocalStorageData('allItems');
                  
                  if(temp == null || temp == 'null') {
  
                    let allItems = [];  
                    allItems.push(data);
                    this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
  
                  }else{
  
                    let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems')); 
                    let isExist = false;
                    for(var i=0; i<allItems.length; i++) {
                      if(allItems[i].Product.id == data.Product.id) {
                        allItems[i].Product.qty += 1;
                        allItems[i].totalItemCost = parseFloat(allItems[i].Product.price)*allItems[i].Product.qty;
                        isExist = true;
                        break;
                      }
                    }         
                    
                    if(!isExist) {
                      allItems.splice(0,0,data);
                    }
                      
                    this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
  
                  }
                  
                  this.result = true;
                  this.close();
                  
                  
            });
        
          }

        } else {
          this.close();
          this.router.navigate(['/menu']);
        }
        
        //window.location.reload();
        
      } 

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
                    if (data.stores.length > 0) {
                      this.selectedStore.val = data.stores[0].Store.id;
                      this.setSelectedStore(data.stores[0].Store.id);
                    }                 
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
  fromObj: object;
}
