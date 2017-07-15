import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { DataService } from '../data.service';
import { UtilService } from '../util.service';
import { OrdernowmodalComponent } from '../ordernowmodal/ordernowmodal.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private dialogService:DialogService,
              private dataService: DataService,
                private utilService: UtilService,
                  private router: Router) { }
  name = '';
  currentTab = 'favItems';
  user = null;
  account = null;
  prefrence = null;
  favItems = [];
  favOrders = [];
  storeList = [];
  prefreces = [];
  userCountryName = null;
  showLoading = false;
  currencyCode = null;
  error = { show:false, isSuccess:false, message: ''};
  orderData = null;

  ngOnInit() {
    
    let isLoggedIn = this.dataService.getLocalStorageData('isLoggedIn');
    if(isLoggedIn == undefined || isLoggedIn == 'false') {
      window.location.href = '/';
      // window.location.reload();
    }else{
      this.currencyCode = this.utilService.currencyCode;
      let user = JSON.parse(this.dataService.getLocalStorageData('user-details'));
      this.user = user;
      this.name = user.firstName + ' ' + user.lastName; 
      this.getFavItems(user.id);
    } 


    this.getUserIp();

    this.dataService.getPrefreces()
          .subscribe(data => {
              this.prefreces = data;
          });
  }

  getUserIp() {
    this.dataService.getIp()
          .subscribe(data => {
              this.userCountryName = data.geoplugin_countryName;
              this.getStores(this.userCountryName);
          });
  }

  getStores(CountryName) {
    if(CountryName.length > 0) {
      this.dataService.getCountryStore(CountryName)
            .subscribe(data => {
                this.storeList = data;
            });
    }
  }

  goToTab(tab) {
    this.currentTab = tab;

    if(this.currentTab == 'favOrders') {
      this.getFavOrders(this.user.id);
    }else if(this.currentTab == 'orderHistory') {
      this.getOrderHistory(this.user.id);
    }

    if(this.currentTab == 'personalInfo') {
      this.showLoading = true;
      // let userId = this.user.id;
      let userId = 133;
      this.dataService.getProfile(userId).subscribe(pdata => {
        this.user = {
          id: pdata.Id,
          firstname : pdata.FirstName,
          lastname: pdata.LastName,
          email: pdata.Email,
          dob: pdata.DOB,
          postal: pdata.PostalCode,
          favloc: pdata.FavLocation
        }
        this.error = { show:false, isSuccess:false, message: ''};
        this.showLoading = false;
      });
    }

    if(this.currentTab == 'accountInfo'){
       this.showLoading = true;
      //  let userId = this.user.id;
      let userId = 133;
      this.dataService.getProfile(userId).subscribe(pdata => {
        this.account = {
          id: pdata.Id,
          phone : pdata.Phone,
          address1: pdata.Address1,
          address2: pdata.Address2,
          address3: pdata.Address3,
        }
        this.error = { show:false, isSuccess:false, message: ''};
        this.showLoading = false;
      });
    }

    if(this.currentTab == 'preference'){
       this.showLoading = true;
      //  let userId = this.user.id;
      let userId = 118;
      this.dataService.getProfile(userId).subscribe(pdata => {
        // let dataPref = pdata.Pref;
        this.prefrence = {
          id: pdata.Id,
          prefData: pdata.Pref
        }
        this.error = { show:false, isSuccess:false, message: ''};
        this.showLoading = false;
      });
    }
  }

  updateProfile(){
    // this.showLoading = true;
    this.user.form = 1;
    this.dataService.updateProfile(this.user).subscribe(data => {
      if(data != 'null' && data != null && data.length>0) {
        let errorMessage = {
          show:true, 
          isSuccess:true, 
          message: 'Thank You ! Your profile has been updated.'
        }
        let user = {
            id: data.Id,
            firstname : data.FirstName,
            lastname: data.LastName,
            email: data.Email
        }
       // this.dataService.setLocalStorageData('user-details', JSON.stringify(user));
        this.error = errorMessage;
      }else{
        let errorMessage = {
          show:true, 
          isSuccess:false, 
          message: 'Sorry ! Profile not updated, please try again.'
        }
        this.error = errorMessage;
      }
      this.showLoading = false;
    });
  }

  updateAccount(){
    // this.showLoading = true;
    this.account.form = 2;
    this.dataService.updateProfile(this.account).subscribe(data => {
      if(data != 'null' && data != null && data.length>0) {
        let errorMessage = {
          show:true, 
          isSuccess:true, 
          message: 'Thank You ! Your account info has been updated.'
        }
        this.error = errorMessage;
      }else{
        let errorMessage = {
          show:true, 
          isSuccess:false, 
          message: 'Sorry ! Account info not updated, please try again.'
        }
        this.error = errorMessage;
      }
      this.showLoading = false;
    });
  }

  updatePrefrence(){
    alert('hi');
    console.log(this);
  }

  getOrderHistory(userId) {
    this.showLoading = true;
    this.dataService.getOrderHistory(userId)
        .subscribe(data => {
          if(data != 'null' && data != null && data.length > 0) {
            this.orderData = data;
            this.showLoading = false;
          }

        }); 
        this.showLoading = false;
  }
 
  getFavItems(userId) {
    this.showLoading = true;
    this.dataService.getFav('item', userId)
        .subscribe(data => {
          if(data != 'null' && data != null) {
            this.favItems = data;

            if(this.favItems.length > 0) {
              for(var i=0; i<this.favItems.length; i++) {
                this.favItems[i].FDetail = JSON.parse(this.favItems[i].FDetail);
              }
            }
            this.showLoading = false;
          }

        });  
  }

  getFavOrders(userId) {
    this.showLoading = true;
    this.dataService.getFav('order', userId)
        .subscribe(data => {
            if(data != 'null' && data != null) {
              
              this.favOrders = data;
              if(this.favOrders.length > 0) {
                for(var i=0; i<this.favOrders.length; i++) {    
                  this.favOrders[i].FDetail = JSON.parse(this.favOrders[i].FDetail);
                  //console.log(this.favOrders[i].FDetail)
                }
              }
            }
            this.showLoading = false;
        });  
  }  


  orderFavItem(itemData) {
    this.dataService.setLocalStorageData('favItemFetched', JSON.stringify(itemData));
    this.router.navigate(['/item','favorite']);    
  }

  orderFavOrder(itemData) {
    this.showLoading = true;
    this.dataService.setLocalStorageData('favOrdersFetched', JSON.stringify(itemData));
    let menuCountry = 'UAE';
    if(this.dataService.getLocalStorageData('menuCountry') != null && 
            this.dataService.getLocalStorageData('menuCountry') != undefined) {
          menuCountry = this.dataService.getLocalStorageData('menuCountry');    
    }

    this.dataService.getFavOrderData(itemData, menuCountry)
          .subscribe(data => {
            this.dataService.setLocalStorageData('allItems', JSON.stringify(data));
            this.showLoading = false;
            this.router.navigate(['/order-review']);  
        });  
    //  
  }  


  openModal(type) {     
      let isLoggedIn = this.dataService.getLocalStorageData('isLoggedIn');
      if(isLoggedIn == undefined || isLoggedIn == 'false') {
         this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
      }else{
        this.dialogService.addDialog(OrdernowmodalComponent, {  }, { closeByClickingOutside:true }); 
      }
                
  }



}
