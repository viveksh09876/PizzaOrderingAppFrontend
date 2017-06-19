import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-orderreview',
  templateUrl: './orderreview.component.html',
  styleUrls: ['./orderreview.component.css']
})
export class OrderreviewComponent implements OnInit {

  items = null;
  totalCost = null;
  netCost = null;
  order = { 
            storeId: 1,
            user: {
                first_name: '',
                last_name: '',
                email: '',
                phone: ''
            },
            order_type: 'pickup',
            delivery_time: '',
            address_house_no: '',
            address_street: '',
            order_details: {} 
          };

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit() {
    this.getItems();
  }

  getItems() {
    
    this.items = JSON.parse(this.dataService.getLocalStorageData('allItems'));
    
    let overAllPrice = 0;
    for(var i=0; i < this.items.length; i++) {
      
      overAllPrice += parseInt(this.items[i].totalItemCost);
    }
    
    
    this.totalCost = overAllPrice;
    this.netCost = this.totalCost;
   
  }

  updateQuantity(type, plu) {

    let total = 0;

    for(var i=0; i<this.items.length; i++) {
      if(this.items[i].Product.plu_code == plu) {

          //increase
          if(type == 1) {
            this.items[i].Product.qty += 1;      
          }else{
           
            this.items[i].Product.qty = this.items[i].Product.qty - 1;
            if(this.items[i].Product.qty <= 0) {
              this.items[i].Product.qty = 1;
            }
          }

          total =  parseInt(this.items[i].originalItemCost)*this.items[i].Product.qty;
          this.items[i].totalItemCost = total;

          break;
      }
    }

    let totalCost = 0;
    for(var i=0; i<this.items.length; i++) {
      totalCost += parseInt(this.items[i].totalItemCost);
    }
    

    
    this.totalCost =  totalCost;
    this.netCost = totalCost;
   // console.log(type, this.totalCost, this.items.Product.qty);
  }


  addDeliveryCost(e, type) {
    
    if(type == 'delivery') {
      this.totalCost = parseInt(this.totalCost) + 6;
     
    }else{
      this.totalCost = parseInt(this.totalCost) - 6;
    }
     
  }

  confirmOrder() {
    let finalOrder = [];
    
    if(this.items.length > 0) {

      for(var p=0; p<this.items.length; p++) {
         let products = this.items[p];
         
         let product = { name: '', plu: '', quantity: 1, modifier: []};
          product.name = products.Product.title;
          product.plu = products.Product.plu_code;
          product.quantity = products.Product.qty;
          
          
        // console.log(products);
          if(products.ProductModifier.length > 0) {
            
            for(var i = 0; i<products.ProductModifier.length; i++) {
              
              for(var j = 0; j < products.ProductModifier[i].Modifier.ModifierOption.length; j++) {
                  
                  let opt = products.ProductModifier[i].Modifier.ModifierOption[j].Option;
                  
                  if(opt.send_code == 1) {
                    
                    let val = {
                        plu: opt.plu_code,                   
                        add_extra: opt.add_extra,
                        quantity: opt.quantity,
                        type: 0,
                        modifier_type: 'modifier'
                    }

                    if(opt.is_checked || opt.add_extra == true) {
                      val.type = 1
                    }
                    
                    product.modifier.push(val);
                  }

              }
            }

            for(var i = 0; i<products.ProductIncludedModifier.length; i++) {
              
              for(var j = 0; j < products.ProductIncludedModifier[i].option.length; j++) {
                
                  let iopt = products.ProductIncludedModifier[i].option[j];
                                  
                    let ival = {
                        plu: iopt.plu_code,                    
                        add_extra: iopt.add_extra,
                        quantity: 1,
                        type: 0,
                        modifier_type: 'included_modifier'
                    }

                    if(iopt.send_code == 0) {
                      ival.type = 0;
                    }

                    if(iopt.add_extra == true) {
                      ival.type = 1;
                    }
                    
                    if(iopt.send_code == 1) {
                      product.modifier.push(ival);
                    }
                
              }          
            }
            
          }
          
          finalOrder.push(product); 
      }

          

      this.order.order_details = finalOrder;
      console.log(this.order);
      this.dataService.placeOrder(this.order).subscribe(data => {
            this.dataService.setLocalStorageData('allItems', null);
             console.log(data);               
             alert('Order Placed');
             this.router.navigate(['/menu']);
          });
     
    }
    
  }


  deleteItem(num, prod) {

    var y = confirm('Are you sure, you want to delete this item from order?');
      if(y) {
          let allItems = [];
          let item = this.items;
          for(var i=0; i<this.items.length; i++) {
            if(i != num && this.items[i].Product.plu_code != prod.Product.plu_code) {
              allItems.push(this.items[i]);
            }
          }

          if(allItems.length > 0) {

            let overAllPrice = 0;
            for(var i=0; i < allItems.length; i++) {
              
              overAllPrice += parseInt(allItems[i].totalItemCost);
            }
            
            this.items = allItems;
            this.dataService.setLocalStorageData('allItems', JSON.stringify(this.items));
            this.totalCost = overAllPrice;
            this.netCost = this.totalCost; 

          }else{
            alert('No items remaining in your cart!');
            this.router.navigate(['/menu']);
          }
         
      }
      

  }


}
