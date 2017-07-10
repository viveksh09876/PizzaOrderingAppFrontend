import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private dataService: DataService,
                private utilService: UtilService,
                  private router: Router) { }
  name = '';
  currentTab = 'favItems';
  user = null;
  favItems = null;
  favOrders = null;

  ngOnInit() {
    let user = JSON.parse(this.dataService.getLocalStorageData('user-details'));
    this.user = user;
    this.name = user.firstName + ' ' + user.lastName; 
    this.getFavItems(user.id);
    
  }

  goToTab(tab) {
    this.currentTab = tab;

    if(this.currentTab == 'favOrders') {
      this.getFavOrders(this.user.id);
    }
  }

  getFavItems(userId) {
    this.dataService.getFav('item', userId)
        .subscribe(data => {
            this.favItems = data;

            if(this.favItems.length > 0) {
              for(var i=0; i<this.favItems.length; i++) {
                this.favItems[i].FDetail = JSON.parse(this.favItems[i].FDetail);
              }
            }

        });  
  }

  getFavOrders(userId) {
    this.dataService.getFav('order', userId)
        .subscribe(data => {
            this.favOrders = data;
            
            if(this.favOrders.length > 0) {
              for(var i=0; i<this.favOrders.length; i++) {    
                this.favOrders[i].FDetail = JSON.parse(this.favOrders[i].FDetail);
                //console.log(this.favOrders[i].FDetail)
              }
            }

        });  
  }  


  orderFavItem(itemData) {
    this.dataService.setLocalStorageData('favItemFetched', JSON.stringify(itemData));
    this.router.navigate(['/item','favorite']);    
  }

  orderFavOrder(itemData) {
    this.dataService.setLocalStorageData('favOrdersFetched', JSON.stringify(itemData));
    this.router.navigate(['/item','favorite']);    
  }  



}
