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

  ngOnInit() {
    this.currencyCode = this.utilService.currencyCode;
    this.getItems();
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

    } else {
        window.location.href = '/';
    }
    
    this.showLoading = false;
  }


  placeOrder() {
      this.showLoading = true;
        this.showPlaceOrder = false;
        this.dataService.placeOrder(this.orderData).subscribe(data => {
              console.log(JSON.parse(data.response));
              let resp = JSON.parse(data.response);
              if(resp.Status == 'Error') {
                this.showPlaceOrder = true;
                alert('There is some issue. Please try again later!');
              /*
                this.dialogService.addDialog(MessageComponent, { title: 'Oops!', message: resp.message, buttonText: 'Close', doReload: false }, { closeByClickingOutside:true });
                this.router.navigate(['/order-review']); 
                */  
              }else{
                this.dataService.setLocalStorageData('confirmationItems', JSON.stringify(this.items));
                this.dataService.setLocalStorageData('allItems', null);                              
                //alert('Order Placed');
                this.dataService.setLocalStorageData('confirmationFinalOrder', JSON.stringify(this.orderData));
                this.dataService.setLocalStorageData('finalOrder', null);

                this.router.navigate(['/confirmation']);
              }
              this.showLoading = false;
            });
  }
        


}
