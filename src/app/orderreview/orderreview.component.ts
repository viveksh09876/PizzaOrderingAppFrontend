import { Component, OnInit } from '@angular/core';
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

  constructor(private dataService: DataService) { }
  
  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.items = JSON.parse(this.dataService.getLocalStorageData('item'));
    
    this.totalCost = this.dataService.getLocalStorageData('totalCost');
    this.netCost = this.totalCost;
   
  }

  updateQuantity(type) {
    //increase
    if(type == 1) {
      this.items.Product.qty += 1;      
    }else{
      this.items.Product.qty = this.items.Product.qty - 1;
      if(this.items.Product.qty <= 0) {
        this.items.Product.qty = 1;
      }
    }

    let total =  parseInt(this.dataService.getLocalStorageData('totalCost'))*this.items.Product.qty;
    this.totalCost =  total;
    this.netCost = total;
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
    let products = this.items;
    if(products != null) {
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
                    name: opt.name,
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
                    name: iopt.name,
                    add_extra: iopt.add_extra,
                    quantity: 1,
                    type: 0,
                    modifier_type: 'included_modifier'
                }

                if(iopt.send_code == 0) {
                  ival.type = 0;
                }

                if(iopt.add_extra == true) {
                  ival.type = 0;
                }
                
                product.modifier.push(ival);
             
          }          
        }

      }
      
      finalOrder.push(product);

      this.order.order_details = finalOrder;
      //console.log(this.order);
      this.dataService.placeOrder(this.order).subscribe(data => {
             console.log(data);               
             alert('Order Placed');
          });
     
  }
    
  }


}
