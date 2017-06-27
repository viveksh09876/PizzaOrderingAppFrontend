import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from '../login/login.component';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item = null;
  totalCost = 0;
  netCost = 0;
  selectedModifiers = [];
  allItems = null;
  is_fav = false;

  constructor(private dialogService:DialogService,
              private dataService: DataService, 
                private route: ActivatedRoute, 
                  private router: Router,
                    private utilService: UtilService) { }

  ngOnInit() {
      
      this.route.params.subscribe(params => {
        
        if(params['slug'] && params['slug']!= '') {
          this.getItemData(params['slug']);

          if(this.dataService.getLocalStorageData('allItems') != null
                && this.dataService.getLocalStorageData('allItems') != 'null') {
            this.allItems = JSON.parse(this.dataService.getLocalStorageData('allItems'));
            this.netCost = this.utilService.calculateOverAllCost(this.allItems);
          }

        }else{
          alert('Invalid Page Requested!');
        }

      });

  }

  getItemData(slug) {
     this.dataService.getItemData(slug)
          .subscribe(data => {
                
             if(data.ProductModifier.length == 0) {
                
                data.originalItemCost = data.Product.price;
                data.totalItemCost = data.Product.price;
                let temp = this.dataService.getLocalStorageData('allItems');
                
                if(temp == null || temp == 'null') {

                  let allItems = [];                  
                  allItems.push(data);
                  this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
                 
                }else{

                  let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems'));                  
                  allItems.push(data);  
                  this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
                }

                this.router.navigate(['/menu']);
             
            }else{
                this.item = data;
                this.getTotalCost();
             }
            
          });
  }

  getTotalCost() {

    let total = 0;

    if(this.item.Product.category_id == 1) {

      if(this.item.ProductModifier.length > 0) {
        for(var i = 0; i < this.item.ProductModifier.length; i++) {
          let options = this.item.ProductModifier[i].Modifier.ModifierOption;
          for(var j = 0; j < options.length; j++) {

              

              if(options[j].Option.is_checked) {
                
                if(options[j].Option.price) {

                  let addPrice = options[j].Option.price;

                  if(options[j].Option.price.small) {

                    for(var x = 0; x < this.item.ProductModifier.length; x++) {
                      let p_op = this.item.ProductModifier[x].Modifier.ModifierOption;
                      for(var y = 0; y < p_op.length; y++) {
                        if(p_op[y].Option.is_checked) {
                          if(p_op[y].Option.plu_code == 999991) {  //small

                            if(typeof options[j].Option.price.small == 'string') {
                              addPrice = parseInt(options[j].Option.price.small);
                            }
                            
                          }else if(p_op[y].Option.plu_code == 999992) {
                            if(typeof options[j].Option.price.medium == 'string') {
                              addPrice = parseInt(options[j].Option.price.medium);
                            }
                            
                          }else if(p_op[y].Option.plu_code == 999993) {
                            if(typeof options[j].Option.price.large == 'string') {
                              addPrice = parseInt(options[j].Option.price.large);
                            }
                            
                          }
                        }
                      }
                    }

                    //console.log('addPrice', addPrice);
                  }else if(options[j].Option.price != null){
                    addPrice = parseInt(options[j].Option.price);
                  }

                  total += parseInt(addPrice);
                  //console.log('total', options[j].Option.name, options[j].Option.price, total, addPrice);
                }
                
                
              }

              if(options[j].Option.is_checked && options[j].Option.default_checked == false) {      
                         
                options[j].Option.send_code = 1;                                  
              }else if(options[j].Option.is_checked == false && options[j].Option.default_checked == true) {
                
                options[j].Option.send_code = 0;
              }else if(options[j].Option.is_checked == true && options[j].Option.default_checked == true) {
                
                options[j].Option.send_code = 1;                    
              }

          }
        }
      }

      if(this.item.Product.price && this.item.Product.price != null) {
        total += parseInt(this.item.Product.price); 
      }
           

    }else{

      if(this.item.ProductModifier.length > 0) {
        for(var i = 0; i < this.item.ProductModifier.length; i++) {
          let options = this.item.ProductModifier[i].Modifier.ModifierOption;
          for(var j = 0; j < options.length; j++) {
              if(options[j].Option.is_checked) {
              
                total += parseInt(options[j].Option.price); 
                
              }
          }
        }
      }

      total += parseInt(this.item.Product.price);

    }

    
    this.totalCost = total;
    
    this.item.originalItemCost = this.totalCost;
    this.item.totalItemCost = this.totalCost;

    //this.dataService.setLocalStorageData('item', JSON.stringify(this.item));
    //this.dataService.setLocalStorageData('totalCost', this.totalCost);
  }

  updateModifier(option_id, type, modifier_id) {
    
    if(this.item.ProductModifier.length > 0) {
      
      for(var i = 0; i < this.item.ProductModifier.length; i++) {
        
        let options = this.item.ProductModifier[i].Modifier.ModifierOption;
        for(var j = 0; j < options.length; j++) {

            if(type == 'radio') {
              if(options[j].Option.id != option_id) {

                if(options[j].Modifier.id == modifier_id) {
                  //console.log(options[j].Option.name + ' first unchecked');
                  options[j].Option.is_checked = false;
                }                
              }
            }

            if(options[j].Option.id == option_id) {
              //console.log(options[j].Option.name + ' reversed', options[j].Option.is_checked);
              options[j].Option.is_checked = !options[j].Option.is_checked;

              //hard code for pizza
              if(this.item.Product.category_id == '1') {
                if(options[j].Option.dependent_modifier_option_id != null) {

                  let p_mod_id = options[j].Option.dependent_modifier_id; 
                  let p_op_id = options[j].Option.dependent_modifier_option_id;

                  for(var x=0; x<this.item.ProductModifier.length; x++) {
                    let p_options = this.item.ProductModifier[x].Modifier.ModifierOption;
                    for(var y=0; y<p_options.length; y++) {
                      
                      if(p_options[y].modifier_id == p_mod_id) {
                        if(p_options[y].Option.id == p_op_id) {
                          //console.log(p_options[y].Option.name + ' checked');
                          p_options[y].Option.is_checked = true;
                        }else{
                          //console.log(p_options[y].Option.name + ' unchecked');
                          p_options[y].Option.is_checked = false;
                        }
                      }

                    }
                  }

                }
              }

            }
        }
      }
    }
    
    let total = this.calculateTotalCost();

    this.totalCost = total;
    this.item.originalItemCost = this.totalCost;

    if(this.item.Product.qty) {
        total = total*parseInt(this.item.Product.qty);
    }

    this.item.totalItemCost = this.totalCost;

    // this.dataService.setLocalStorageData('item', JSON.stringify(this.item));
    // this.dataService.setLocalStorageData('totalCost', this.totalCost);
  }


  updateIncludedModifier(option_id) {

    if(this.item.ProductIncludedModifier.length > 0) {
      for(var i = 0; i < this.item.ProductIncludedModifier.length; i++) {

        let options = this.item.ProductIncludedModifier[i].option;
        for(var j = 0; j < options.length; j++) {

            if(options[j].id == option_id) {
              options[j].is_checked = !options[j].is_checked;
            }

            if(options[j].is_checked) {       
              options[j].send_code = 1;
            }else if(options[j].is_checked == false) {
              options[j].send_code = 0;
            }
            

        }
      }
    }
    
    //this.dataService.setLocalStorageData('item', JSON.stringify(this.item));

  }


  updateExtra(option_id, type, controlType) {
     
      //modifier    
      if(this.item.ProductModifier.length > 0) {
        for(var i = 0; i < this.item.ProductModifier.length; i++) {
          let options = this.item.ProductModifier[i].Modifier.ModifierOption;
          for(var j = 0; j < options.length; j++) {

              if(options[j].Option.id == option_id && type == 'modifier') {  
                options[j].Option.add_extra = !options[j].Option.add_extra;  
                
                if(options[j].Option.add_extra == true) {
                  options[j].Option.is_checked = true;
                }

                if(options[j].Option.add_extra == true) {
                  options[j].Option.send_code = 1;
                }else if(options[j].Option.add_extra == false && options[j].Option.is_checked == false ){
                  options[j].Option.send_code = 0;
                }
              }


          }
        }
      }

          

      //included modifier
      if(this.item.ProductIncludedModifier.length > 0) {

        for(var i = 0; i < this.item.ProductIncludedModifier.length; i++) {

          let ioptions = this.item.ProductIncludedModifier[i].option;
          for(var j = 0; j < ioptions.length; j++) {

              if(ioptions[j].id == option_id && type == 'includedModifier') {
                ioptions[j].add_extra = !ioptions[j].add_extra;

                if(ioptions[j].add_extra == true) {
                  ioptions[j].send_code = 1;
                }

              }

          }
        }
      }

     
      let total = this.calculateTotalCost();
      this.totalCost = total;
      
      this.item.originalItemCost = this.totalCost;
      this.item.totalItemCost = this.totalCost;
          
      // this.dataService.setLocalStorageData('item', JSON.stringify(this.item));
      // this.dataService.setLocalStorageData('totalCost', this.totalCost);

  }



  calculateTotalCost() {

    let total = 0;

    if(this.item.Product.category_id == 1) {

      if(this.item.ProductModifier.length > 0) {
        for(var i = 0; i < this.item.ProductModifier.length; i++) {
          let options = this.item.ProductModifier[i].Modifier.ModifierOption;
          for(var j = 0; j < options.length; j++) {

              

              if(options[j].Option.is_checked) {
                
                if(options[j].Option.price) {

                  let addPrice = options[j].Option.price;

                  if(options[j].Option.price.small) {

                    for(var x = 0; x < this.item.ProductModifier.length; x++) {
                      let p_op = this.item.ProductModifier[x].Modifier.ModifierOption;
                      for(var y = 0; y < p_op.length; y++) {
                        if(p_op[y].Option.is_checked) {
                          if(p_op[y].Option.plu_code == 999991) {  //small

                            if(typeof options[j].Option.price.small == 'string') {
                              addPrice = parseInt(options[j].Option.price.small);
                            }
                            
                          }else if(p_op[y].Option.plu_code == 999992) {
                            if(typeof options[j].Option.price.medium == 'string') {
                              addPrice = parseInt(options[j].Option.price.medium);
                            }
                            
                          }else if(p_op[y].Option.plu_code == 999993) {
                            if(typeof options[j].Option.price.large == 'string') {
                              addPrice = parseInt(options[j].Option.price.large);
                            }
                            
                          }
                        }
                      }
                    }

                    //console.log('addPrice', addPrice);
                  }else if(options[j].Option.price != null){
                    addPrice = parseInt(options[j].Option.price);
                  }

                  if(options[j].Option.add_extra) {                                    
                    addPrice += parseInt(options[j].Option.price);                       
                  }

                  if(options[j].Option.is_checked && options[j].Option.default_checked == false) {      
                         
                    options[j].Option.send_code = 1;                                  
                  }else if(options[j].Option.is_checked == false && options[j].Option.default_checked == true) {
                   
                    options[j].Option.send_code = 0;
                  }else if(options[j].Option.is_checked == true && options[j].Option.default_checked == true) {
                    
                    options[j].Option.send_code = 1;                    
                  }


                  total += parseInt(addPrice);
                  //console.log('total', options[j].Option.name, options[j].Option.price, total, addPrice);
                }
                
                
              }
          }
        }
      }

      if(this.item.Product.price && this.item.Product.price != null) {
        total += parseInt(this.item.Product.price); 
      }

                

    }else{


        if(this.item.ProductModifier.length > 0) {
          for(var i = 0; i < this.item.ProductModifier.length; i++) {
            let options = this.item.ProductModifier[i].Modifier.ModifierOption;
            for(var j = 0; j < options.length; j++) {

                if(options[j].Option.is_checked && options[j].Option.default_checked == false) {              
                  options[j].Option.send_code = 1;
                  total += parseInt(options[j].Option.price);               
                }else if(options[j].Option.is_checked == false && options[j].Option.default_checked == true) {
                  options[j].Option.send_code = 0;
                }else if(options[j].Option.is_checked == true && options[j].Option.default_checked == true) {
                  options[j].Option.send_code = 1;
                  total = total + parseInt(options[j].Option.price);
                }

                if(options[j].Option.add_extra) {                      
                  total += parseInt(options[j].Option.price);                       
                }

            }
          }
        }

    }


      //included modifier
      if(this.item.ProductIncludedModifier.length > 0) {

        for(var i = 0; i < this.item.ProductIncludedModifier.length; i++) {

          let ioptions = this.item.ProductIncludedModifier[i].option;
          for(var j = 0; j < ioptions.length; j++) {

              if(ioptions[j].add_extra) { 
                  total += parseInt(ioptions[j].price); 
              }

          }
        }
      }
      
      total += parseInt(this.item.Product.price);
      
      return total;

  }

  updateQuantity(type) {

    let total = 0;

    //increase
    if(type == 1) {
      this.item.Product.qty += 1;      
    }else{
      
      this.item.Product.qty = this.item.Product.qty - 1;
      if(this.item.Product.qty <= 0) {
        this.item.Product.qty = 1;
      }
    }
    
    total =  parseInt(this.item.originalItemCost)*this.item.Product.qty;
    this.item.totalItemCost = total;
    this.totalCost = total;

    let overallCost = 0;
    let allItems = this.dataService.getLocalStorageData('allItems');
    if(allItems != null && allItems != 'null') {
      overallCost = this.utilService.calculateOverAllCost(allItems); 
    }else{
      overallCost = 0;
    }
    
    //this.netCost += overallCost;
   // console.log(type, this.totalCost, this.items.Product.qty);
  }  


  checkout() {    
    
    if(this.dataService.getLocalStorageData('allItems') != null
          && this.dataService.getLocalStorageData('allItems') != 'null') {
       let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems'));
       allItems.push(this.item);  
       this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
    }else{
      let allItems = [];
      allItems.push(this.item);
      this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
    }
    
    this.dataService.setLocalStorageData('totalCost', this.totalCost); 
    this.router.navigate(['/order-review']);
  }


  add_to_cart() {
    //console.log(this.item);
    if(this.dataService.getLocalStorageData('allItems') != null
          && this.dataService.getLocalStorageData('allItems') != 'null') {
       let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems'));
       allItems.push(this.item);  
       this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
    }else{
      let allItems = [];
      allItems.push(this.item);
      this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
    }
    
    this.dataService.setLocalStorageData('totalCost', this.totalCost); 
    this.router.navigate(['/menu']);

  }


  addToFav() {
    if(this.is_fav == false) {

      let isLoggedIn = this.dataService.getLocalStorageData('isLoggedIn');
      if(isLoggedIn == undefined || isLoggedIn == 'false') {
        //do login
         this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
      }else{
        //add fav
        let userDetails = JSON.parse(this.dataService.getLocalStorageData('user-details'));
        let userId = userDetails.id;
        this.dataService.saveFavItem(userId, this.item)
          .subscribe(data => {
              console.log(data);
          });
      }
    }
  }



}
