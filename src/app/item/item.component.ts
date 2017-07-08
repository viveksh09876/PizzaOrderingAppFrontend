import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from '../login/login.component';
import { FavmodalComponent } from '../favmodal/favmodal.component';
import { MessageComponent } from '../message/message.component';
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
  cmsApiPath = environment.cmsApiPath;
  showAddToCart = true;

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

    //total = Math.round(total * 100) / 100;
    total = this.calculateTotalCost();
    this.totalCost = +total.toFixed(2);
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
                  ////console.log(options[j].Option.name + ' first unchecked');
                  options[j].Option.is_checked = false;
                }                
              }
            }

            if(options[j].Option.id == option_id) {
              
              options[j].Option.is_checked = !options[j].Option.is_checked;
              
              if(options[j].Option.OptionSuboption != undefined && options[j].Option.OptionSuboption.length > 0) {
                if(options[j].Option.is_checked == true) {                  
                  for(var n=0; n<options[j].Option.OptionSuboption.length; n++) {
                    if(n==0) {
                      options[j].Option.OptionSuboption[n].SubOption.is_active = true;
                    }else{
                      options[j].Option.OptionSuboption[n].SubOption.is_active = false;
                    }                    
                  }                 
                }else{
                  
                   for(var l=0; l<options[j].Option.OptionSuboption.length; l++) {
                    options[j].Option.OptionSuboption[l].SubOption.is_active = false;
                   } 
                }                
              }

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
                          ////console.log(p_options[y].Option.name + ' checked');
                          p_options[y].Option.is_checked = true;
                          

                        }else{
                          ////console.log(p_options[y].Option.name + ' unchecked');
                          p_options[y].Option.is_checked = false;
                                                   
                        }
                      }


                    }
                  }

                }
              }

              if(options[j].Option.is_checked == false) {
                options[j].Option.add_extra = false;
              }

            }
        }
      }
    }
    
    let total = this.calculateTotalCost();
    
    if(total == 0 || isNaN(total)) {

      this.showAddToCart = false;
      this.dialogService.addDialog(MessageComponent, { title: 'Alert', message: 'This customization is not availabe!', buttonText: 'Continue', doReload: false }, { closeByClickingOutside:true }); 

    }else{
      this.showAddToCart = true;
      this.totalCost = total;
      this.item.originalItemCost = this.totalCost;

      if(this.item.Product.qty) {
          total = total*parseFloat(this.item.Product.qty);
      }
      this.item.totalItemCost = total;
    }

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

                  if(options[j].Option.OptionSuboption != undefined && options[j].Option.OptionSuboption.length > 0) {
                      
                        for(var n=0; n<options[j].Option.OptionSuboption.length; n++) {
                          if(n==0) {
                            options[j].Option.OptionSuboption[n].SubOption.is_active = true;
                          }else{
                            options[j].Option.OptionSuboption[n].SubOption.is_active = false;
                          }
                          
                        }
                      
                  }    
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

     
      let total = this.calculateTotalCost();
      this.totalCost = total;
      this.item.originalItemCost = this.totalCost;

      if(this.item.Product.qty) {
          total = total*parseFloat(this.item.Product.qty);
      }

      this.item.totalItemCost = total;
          

  }


  updateSubOption(mainPos, modOpPos, optionId, subOptionId) {
    ////console.log(this.item.ProductModifier, mainPos,modOpPos, optionId, subOptionId);
    for(var i=0; i<this.item.ProductModifier.length; i++) {
      if(i == mainPos) {
        let modOpt = this.item.ProductModifier[i].Modifier.ModifierOption;
        for(var j=0; j < modOpt.length; j++) {
          if(j == modOpPos) {
            let subOp = modOpt[j].Option.OptionSuboption;
            for(var k = 0; k < subOp.length; k++) {
              
              if(subOptionId == subOp[k].SubOption.id) {
                this.item.ProductModifier[i].Modifier.ModifierOption[j].Option.OptionSuboption[k].SubOption.is_active = true;
              }else{
                this.item.ProductModifier[i].Modifier.ModifierOption[j].Option.OptionSuboption[k].SubOption.is_active = false; 
              }
              if(this.item.ProductModifier[i].Modifier.ModifierOption[j].Option.is_checked == true) {
                this.item.ProductModifier[i].Modifier.ModifierOption[j].Option.send_code = 1;
              }
            }
            break;
          }
        }
        break;
      }
    }
  }



  calculateTotalCost() {

    let total = 0;
    let defaultSize = 'small';

    if(this.item.Product.category_id == 1) {

      let itemBasePrice = false;
      let itemSizePrice = '';
      let is_crust_size_price_added = false;

      if(this.item.ProductModifier.length > 0) {
        for(var i = 0; i < this.item.ProductModifier.length; i++) {
          let options = this.item.ProductModifier[i].Modifier.ModifierOption;
          for(var j = 0; j < options.length; j++) {
              
              if(options[j].Option.is_checked || options[j].Option.is_included_mod) {                
                if(options[j].Option.price) {
                  
                  let addPrice = 0;
                  if(!options[j].Option.is_included_mod && options[j].Option.is_checked) {
                    
                    if(typeof options[j].Option.price[defaultSize] == 'string') {
                      if(is_crust_size_price_added == true) {
                        console.log('x');
                        addPrice = parseFloat(options[j].Option.price[defaultSize]);
                        itemBasePrice = true;
                      }else if(itemSizePrice == 'true' || itemSizePrice == '') {

                        if(this.item.Product.plu_code != 999999) {
                          console.log('y');
                          addPrice = parseFloat(options[j].Option.price[defaultSize]);
                          itemBasePrice = true;
                        }else{
                            if(itemSizePrice != '' || options[j].Option.plu_code == 'I101') {
                              console.log('yx');
                              addPrice = parseFloat(options[j].Option.price[defaultSize]);
                              itemBasePrice = true;
                            }
                            
                          
                        }
                        
                      }else if((itemSizePrice == 'large' || itemSizePrice == 'medium' || itemSizePrice == 'small') && total != 0) {
                        console.log('z');
                        addPrice = parseFloat(options[j].Option.price[defaultSize]);
                        itemBasePrice = true;
                      }
                      // }else if(total != 0) {
                      //   addPrice = parseFloat(options[j].Option.price[defaultSize]);
                      //   itemBasePrice = true;
                      // }
                      
                      console.log('zero base', options[j].Option.price[defaultSize], typeof options[j].Option.price[defaultSize], itemBasePrice, itemSizePrice, is_crust_size_price_added, total);
                       
                    }else{
                      if(itemBasePrice && itemSizePrice != '' && !options[j].Option.is_included_mod && total == 0) {
                        console.log('add nhi karna');
                      }else{
                        console.log('f',options[j].Option.name, options[j].Option.is_included_mod, defaultSize, options[j].Option.price, itemBasePrice, 'size price', itemSizePrice);  
                        if(itemSizePrice != '') {
                          addPrice = parseFloat(options[j].Option.price);
                        }
                       
                      }
                    
                    }
                    
                  }else{

                    if((options[j].Option.plu_code == 'I100' || options[j].Option.plu_code == 'I101' || options[j].Option.plu_code == '91') && options[j].Option.is_checked) {
                      if(typeof options[j].Option.price[defaultSize] == 'string') {
                        addPrice = parseFloat(options[j].Option.price[defaultSize]);
                        itemBasePrice = true;
                        console.log('abc ho gya', options[j].Option.is_checked);
                      }
                    }
                    console.log('not included mod', options[j].Option.name, options[j].Option.is_checked);
                  }
                  
                  //console.log('initial add price', addPrice);
                  if(options[j].Option.price.small && options[j].Option.is_topping == undefined) {
                    //console.log('obj', options[j].Option);
                    
                    for(var x = 0; x < this.item.ProductModifier.length; x++) {
                      let p_op = this.item.ProductModifier[x].Modifier.ModifierOption;
                      for(var y = 0; y < p_op.length; y++) {
                        //console.log('new', p_op[y].Option);

                        if(p_op[y].Option.default_checked && p_op[y].Option.plu_code == 999991) {
                          defaultSize = 'small';
                        } else if(p_op[y].Option.default_checked && p_op[y].Option.plu_code == 999992) {
                          defaultSize = 'medium';
                        } else if(p_op[y].Option.default_checked && p_op[y].Option.plu_code == 999993) {
                          defaultSize = 'large';
                        }

                        if(options[j].Option.dependent_modifier_option_id == p_op[y].Option.id) {
                          if(p_op[y].Option.is_checked && options[j].Option.is_checked) {
                            
                            addPrice = parseFloat(options[j].Option.price[defaultSize]);
                            itemBasePrice = true;
                            if(options[j].Option.price[defaultSize] != 0) {
                                is_crust_size_price_added = true;
                              } 
                            
                            console.log('def',options[j].Option.price, options[j].Option.is_checked, defaultSize);
                          }
                          //console.log(defaultSize, options[j].Option.dependent_modifier_id, p_op[y].Option);
                        }

                        if(p_op[y].Option.is_checked && options[j].Option.is_checked && (options[j].Option.plu_code == 'I100' || options[j].Option.plu_code == 'I101')) {
                          
                          itemSizePrice = 'true';
                        }
                        
                        
                        if(p_op[y].Option.is_checked && p_op[y].Option.is_included_mod == false && options[j].Option.is_checked) {
                          if(p_op[y].Option.plu_code == 999991) {  //small

                            if(typeof options[j].Option.price.small == 'string') {
                              console.log('small', options[j].Option.price.small, options[j].Option.is_checked);
                              addPrice = parseFloat(options[j].Option.price.small);
                              itemSizePrice = 'small';
                              defaultSize = 'small';
                              if(options[j].Option.price.small == 0) {
                                is_crust_size_price_added = false;
                              }
                            }
                            
                          }else if(p_op[y].Option.plu_code == 999992) {
                            if(typeof options[j].Option.price.medium == 'string') {
                              console.log('med', options[j].Option.price.medium,  options[j].Option.name , options[j].Option.is_checked, options[j].Option.is_included_mod, p_op[y].Option.is_included_mod);
                              addPrice = parseFloat(options[j].Option.price.medium);
                              itemSizePrice = 'medium';
                              defaultSize = 'medium';
                              if(options[j].Option.price.medium == 0) {
                                is_crust_size_price_added = false;
                              } 
                            }
                            
                          }else if(p_op[y].Option.plu_code == 999993) {
                            if(typeof options[j].Option.price.large == 'string') {
                              console.log('large 123', options[j].Option.price.large);
                              addPrice = parseFloat(options[j].Option.price.large);
                              itemSizePrice = 'large';
                              defaultSize = 'large';
                              if(options[j].Option.price.large == 0) {
                                console.log('zero');
                                is_crust_size_price_added = false;
                              }                              
                            }
                            
                          }
                        }
                                                
                      }
                    }

                    //console.log('addPrice', addPrice);
                  }else if(options[j].Option.price.small && options[j].Option.is_topping != undefined && options[j].Option.is_included_mod == false && defaultSize != 'true' && is_crust_size_price_added == true){
                    
                    
                    addPrice = parseFloat(options[j].Option.price[defaultSize]);   
                    console.log('a', addPrice, itemSizePrice, defaultSize, options[j].Option.name, options[j].Option.is_checked, itemBasePrice);                 
                  }else if(options[j].Option.price != null && options[j].Option.is_included_mod == false && options[j].Option.price.small == undefined){
                    
                    addPrice = parseFloat(options[j].Option.price);   
                    console.log('a', addPrice);                 
                  }

                  if(options[j].Option.is_checked && options[j].Option.add_extra) {   
                      if(options[j].Option.price[defaultSize]) {
                        addPrice += parseFloat(options[j].Option.price[defaultSize]);   
                      }else{
                        addPrice += parseFloat(options[j].Option.price);   
                      }                           
                      console.log('b', addPrice, options[j].Option.price, defaultSize);               
                  }
                 
                  
                  if(options[j].Option.is_checked && options[j].Option.default_checked == false) {      
                         
                    options[j].Option.send_code = 1;                                  
                  }else if(options[j].Option.is_checked == false && options[j].Option.default_checked == true) {
                   
                    options[j].Option.send_code = 1;
                  }else if(options[j].Option.is_checked == true && options[j].Option.default_checked == true) {
                    
                    options[j].Option.send_code = 0;                    
                  }

                  if(options[j].Option.is_checked == false && options[j].Option.is_included_mod == true) {                   
                    options[j].Option.send_code = 1;
                  }

                  if(options[j].Option.is_checked == false && options[j].Option.is_included_mod == false) {                   
                    options[j].Option.send_code = 0;
                  }

                  if((options[j].Option.plu_code == '91' || options[j].Option.plu_code == 'I100' || options[j].Option.plu_code == 'I101')) {
                    if(options[j].Option.is_checked == true) {
                      options[j].Option.send_code = 1;
                    }else{
                      options[j].Option.send_code = 0;
                    }

                  }
                  
                  //console.log('last', addPrice);
                  console.log('total: ', total, addPrice, itemSizePrice, itemBasePrice);
                  if(this.item.Product.plu_code == 999999) {
                    if(!isNaN(addPrice)) {
                      console.log('addedy');
                      total += addPrice;
                    }
                    
                  }else{
                    
                    if(!isNaN(addPrice)) {
                      total += addPrice;
                    }
                  }
                                   
                }               
              }
          }
        }
      }

     
      if(this.item.Product.price && this.item.Product.price[defaultSize] != undefined) {
        //console.log('total', total);
        total += parseFloat(this.item.Product.price[defaultSize]); 
        console.log(234, defaultSize, this.item.Product.price, total);
      }

      if(!itemBasePrice && this.item.Product.plu_code == 999999) {
        console.log(123);
        total = 0;
      }

      if(this.item.Product.plu_code != 999999 && total == 10) {
        console.log(1234);
        total = 0;
      }

      console.log(itemBasePrice, itemSizePrice);
      if(this.item.Product.plu_code != 999999 && itemSizePrice == '') {
        //console.log(123);
        total = 0;
      }

      console.log('final', total);  

       ////console.log(defaultSize, this.item.Product.price[defaultSize], total);          

    }else{


        if(this.item.ProductModifier.length > 0) {
          for(var i = 0; i < this.item.ProductModifier.length; i++) {
            let options = this.item.ProductModifier[i].Modifier.ModifierOption;
            for(var j = 0; j < options.length; j++) {

                if(options[j].Option.is_checked && options[j].Option.default_checked == false) {              
                  options[j].Option.send_code = 1;
                  if(options[j].Option.is_included_mod == false) {
                    total += parseFloat(options[j].Option.price); 
                  }                                
                }else if(options[j].Option.is_checked == false && options[j].Option.default_checked == true) {
                  options[j].Option.send_code = 0;
                }else if(options[j].Option.is_checked == true && options[j].Option.default_checked == true) {
                  options[j].Option.send_code = 1;
                  if(options[j].Option.is_included_mod == false) {
                    total = total + parseFloat(options[j].Option.price); 
                  }                  
                }

                if(options[j].Option.add_extra) {                      
                  total += parseFloat(options[j].Option.price);                       
                }

            }
          }
        }
        total += parseFloat(this.item.Product.price);
    }

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
    
    total =  parseFloat(this.item.originalItemCost)*this.item.Product.qty;
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
   // //console.log(type, this.totalCost, this.items.Product.qty);
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
    console.log(this.item);
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
        // let userDetails = JSON.parse(this.dataService.getLocalStorageData('user-details'));
        // let userId = userDetails.id;
        // this.dataService.saveFavItem(userId, this.item)
        //   .subscribe(data => {
        //       //console.log(data);
        //   });

        this.dialogService.addDialog(FavmodalComponent, { item: this.item  }, { closeByClickingOutside:true });
      }
    }
  }



}
