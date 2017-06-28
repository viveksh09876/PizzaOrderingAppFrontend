import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private dataService: DataService, 
                  private route: ActivatedRoute, 
                    private router: Router,
                      private utilService: UtilService) { }

  ngOnInit() {
    
  }


  placeOrder() {
    
    let orderData = JSON.parse(this.dataService.getLocalStorageData('finalOrder'));

        this.dataService.placeOrder(orderData).subscribe(data => {
              this.dataService.setLocalStorageData('allItems', null);
               console.log(data);               
               //alert('Order Placed');
               this.dataService.setLocalStorageData('finalOrder', null);
               this.router.navigate(['/confirmation']);
            });
  }
        


}
