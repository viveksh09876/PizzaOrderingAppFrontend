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
  favItems = [];
  favOrders = [];
  showLoading = false;
  currencyCode = null;

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

    
    
  }

  goToTab(tab) {
    this.currentTab = tab;

    if(this.currentTab == 'favOrders') {
      this.getFavOrders(this.user.id);
    }else if(this.currentTab == 'orderHistory') {
      this.getOrderHistory(this.user.id);
    }
  }


  getOrderHistory(userId) {
    this.showLoading = true;
    this.dataService.getOrderHistory(userId)
        .subscribe(data => {
          if(data != 'null' && data != null) {
            
            this.showLoading = false;
          }

        }); 
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
