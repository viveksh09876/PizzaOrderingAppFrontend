import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';
import { MessageComponent } from '../message/message.component';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private dataService: DataService, 
                  private route: ActivatedRoute, 
                    private router: Router,
                      private utilService: UtilService,
                      private dialogService: DialogService) {
                        
                  }
  
  totalCost = 0;
  netCost = 0;    
  items = []; 
  orderData = null;
  showPlaceOrder = true; 
  couponDiscount = 0; 
  currencyCode = null;      
  showLoading = true; 
  payError = '';
  card = {
    name: null,
    customerId: null,
    customerEmail: null,
    postalCode: null,
    amount: null,
    expirationMonth: '',
    expirationYear: new Date().getFullYear(),
    card: null,
    cvc: null,
    type: false 
  }

  uniqueId = this.utilService.generateUniqueId();

  payDetails = {
    uuid: null,
    fname: null,
    lname: null,
    ccode: null,
    phone: null,
    email: null,
    amount: null,
    userid: null,
    bill_address_txt: { apartment: null, streetNo: null, street: null },
    bill_city: null,
    bill_state: null,
    bill_postal: null,
    bill_country: 'ARE',
    ship_address_txt: { apartment: null, streetNo: null, street: null },
    ship_city: null,
    ship_state: null,
    ship_postal: null,
    ship_country: 'ARE'
  }

  months = this.utilService.getMonths();
  years = this.utilService.getYears(2037);
  formattedItems = null;
  paymentReference = null;
  showBillCountryList = false;
  showShipCountryList = false;
  countryList = [];
  

  ngOnInit() {
    
    this.currencyCode = this.utilService.currencyCode;
    this.getItems();

    this.route.queryParams.subscribe(params => {
      if (params['payment_reference'] != undefined) {
        this.paymentReference = params['payment_reference'];

        if (this.paymentReference == 0) {
          this.payError = 'Payment rejected. Please contact administartor.';
        } else {
          this.orderData['uuid'] = this.dataService.getLocalStorageData('uuid');
          this.orderData['pref'] = this.paymentReference;
          this.placeOrder();
        }

      } else {
        
        this.dataService.setLocalStorageData('favItemFetched', null);
        this.dataService.setLocalStorageData('favOrdersFetched', null); 
        this.dataService.setLocalStorageData('confirmationItems', null); 
        this.dataService.setLocalStorageData('confirmationFinalOrder', null);
      }
    });
	  
	  
	  
    
  }


  getItems() {
    if(this.dataService.getLocalStorageData('allItems') != null 
            && this.dataService.getLocalStorageData('allItems') != undefined) {
        
        this.items = JSON.parse(this.dataService.getLocalStorageData('allItems'));
        this.orderData = JSON.parse(this.dataService.getLocalStorageData('finalOrder'));

        let tCost = this.utilService.calculateOverAllCost(this.items);
        this.totalCost = tCost
        this.netCost = tCost;  
        if(this.orderData.couponDiscount != 0 && !isNaN(this.orderData.couponDiscount)) {
          this.couponDiscount = this.orderData.couponDiscount;
          this.totalCost = this.totalCost - this.orderData.couponDiscount;
        }
        if(this.orderData.order_type == 'delivery') {
            this.totalCost += 6;
        } 

        if(this.orderData.payment_type == undefined) { 
          this.orderData['payment_type'] = 'Credit';
        }

        let userDetails = JSON.parse(this.dataService.getLocalStorageData('user-details'));
        let userId = '';
        if (userDetails != '' && userDetails != null) {
          userId = userDetails.id;
        }

        //set paytab api payment details
        this.payDetails.fname = this.orderData.user.first_name;
        this.payDetails.lname = this.orderData.user.last_name;
        this.payDetails.email = this.orderData.user.email;
        this.payDetails.phone = this.orderData.user.phone;
        this.payDetails.amount = this.totalCost;
        if (userId != '') {
          this.payDetails.userid = userId;
        }

        if (this.orderData.order_type == 'delivery') {
          this.payDetails.bill_address_txt.apartment = this.orderData.address.apartment;
          this.payDetails.bill_address_txt.streetNo = this.orderData.address.street_no;
          this.payDetails.bill_address_txt.street = this.orderData.address.street;
          this.payDetails.bill_city = this.orderData.address.city;
          this.payDetails.bill_state = this.orderData.address.state;
          this.payDetails.bill_postal = this.orderData.address.postal_code;

          this.payDetails.ship_address_txt.apartment = this.orderData.address.apartment;
          this.payDetails.ship_address_txt.streetNo = this.orderData.address.street_no;
          this.payDetails.ship_address_txt.street = this.orderData.address.street;
          this.payDetails.ship_city = this.orderData.address.city;
          this.payDetails.ship_state = this.orderData.address.state;
          this.payDetails.ship_postal = this.orderData.address.postal_code;
        }
        
        
        let favData = null;
        let favOrdArr = [];
        for(var i=0; i < this.items.length; i++) {
          let favObj = this.utilService.formatFavData(this.items[i]);
          let favDataObj = {
            userId: userId,
            data: favObj
          }
          favOrdArr.push(favDataObj);
        }
        this.orderData['customData'] = favOrdArr;

    } else {
        window.location.href = '/';
    }
    
    this.showLoading = false;
  }


  updatePaymentType(type) {
    this.orderData['payment_type'] = type;
  }


  placeOrder() {
      this.showLoading = true;
        this.showPlaceOrder = false;
        this.dataService.placeOrder(this.orderData).subscribe(data => {
             // console.log(JSON.parse(data.response));
              let resp = JSON.parse(data.response);

              if(resp.Status == 'Error') {
                this.showPlaceOrder = true;
                alert(resp.Message);
              /*
                this.dialogService.addDialog(MessageComponent, { title: 'Oops!', message: resp.message, buttonText: 'Close', doReload: false }, { closeByClickingOutside:true });
                this.router.navigate(['/order-review']); 
                */  
              }else{
                this.dataService.setLocalStorageData('allItems', null); 
                this.dataService.setLocalStorageData('confirmationItems', JSON.stringify(this.items));
                this.dataService.setLocalStorageData('finalOrder', null);                             
                //alert('Order Placed');
                this.dataService.setLocalStorageData('confirmationOrderId', resp.OrderId); 
                this.dataService.setLocalStorageData('confirmationFinalOrder', JSON.stringify(this.orderData));                
                this.showLoading = false;
                this.router.navigate(['/confirmation']);
              }
              this.showLoading = false;
            });
  }


  payOnline(isValid) {
    
    //if (isValid) {
      this.showLoading = true;

      let bill_address = this.payDetails.bill_address_txt.apartment + ' ' 
                            + this.payDetails.bill_address_txt.streetNo + ' ' 
                            + this.payDetails.bill_address_txt.street;

      //delete this.payDetails.bill_address_txt;
      this.payDetails['bill_address'] = bill_address;
                            
      let ship_address = this.payDetails.ship_address_txt.apartment + ' ' 
                            + this.payDetails.ship_address_txt.streetNo + ' ' 
                            + this.payDetails.ship_address_txt.street;   
                            
                            
                           

      //delete this.payDetails.ship_address_txt;
      this.payDetails['ship_address'] = ship_address;

      for (var key in this.payDetails) {
        if (this.payDetails.hasOwnProperty(key)) {
          if (this.payDetails[key] == null || this.payDetails[key] == '') {
            this.payDetails[key] = 0;
          }
        }
      }

      if (this.orderData.order_type == 'pickup') {
        
        this.payDetails.ship_city = this.payDetails.bill_city;
        this.payDetails.ship_state = this.payDetails.bill_state;
        this.payDetails.ship_postal = this.payDetails.bill_postal;
        this.payDetails.ship_country = this.payDetails.bill_country;
      } 

      this.payDetails.uuid = this.uniqueId;
      this.dataService.setLocalStorageData('uuid', this.payDetails.uuid);

      this.dataService.sendPaymentData(this.payDetails)
      .subscribe(data => {
        
        if (data.Status == 'Error') {
          
          this.showLoading = false;
          this.payError = data.Message;
          
        } else if (data.Status == 'OK') {
          this.showLoading = false;
          
          window.location.href = data.payment_url;
          
        }
      });
   // }
  }
        
  getCountryCodes(key, type) {

    if (key.length > 0) {
      this.dataService.getCountryCodes(key)
      .subscribe(data => {
          
		  this.countryList = data;
		  if (type == 'bill') {
			  this.showBillCountryList = true;
		  } else {
			  this.showShipCountryList = true;
		  }
		 
        
      });
    }
    
  }
  
  selectCountry(country, modal) {
	  
	  this.payDetails[modal] = country.Countrycode.iso3;
	  
  }

}
