import { Component, OnInit } from '@angular/core';
import { PipeTransform, Pipe } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from "ng2-bootstrap-modal";
import { OrdernowmodalComponent } from '../ordernowmodal/ordernowmodal.component';
import { SuggestionmodalComponent } from '../suggestionmodal/suggestionmodal.component';
import { MessageComponent } from '../message/message.component';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';

declare var jQuery: any;


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  constructor(private dialogService:DialogService,
              private dataService: DataService, 
                private utilService: UtilService, 
                     private route: ActivatedRoute, 
                        private router: Router) { }

  menuData = null;
  categories: Array<any>;
  subcategories: Array<any>;
  items = [];
  itemsQtyBeforeCart={};
  orderNowDetails=null;
  totalCost = 0;
  netCost = 0;
  showViewCart = false;
  showFooter = true;
  cmsApiPath = environment.cmsApiPath;
  currencyCode = null;
  selectedMenuCat = null;
  addedCategories = [];
  suggestionProducts = [];
  formattedItems = null;
  nutritionInfo={};
  //customizeDropdown={};
  
  ngOnInit() {
    
    this.dataService.setLocalStorageData('favItemFetched', null);
    this.dataService.setLocalStorageData('favOrdersFetched', null); 
    this.dataService.setLocalStorageData('confirmationItems', null); 
    this.dataService.setLocalStorageData('confirmationFinalOrder', null);

    this.currencyCode = this.utilService.currencyCode;
    this.getAllCategories(() => {
      this.getCartItems();        
    });
    this.orderNowDetails = JSON.parse(this.dataService.getLocalStorageData('order-now')); 
    if(this.orderNowDetails == null || this.orderNowDetails == 'null') {
      this.updateStoreAndTime('location');
    }
     console.log(this.orderNowDetails);
    
    
  }


  getCartItems() {
    let items = this.dataService.getLocalStorageData('allItems');
    let orderNowDetails = this.dataService.getLocalStorageData('order-now'); 
    if((items != null && items != 'null') || (orderNowDetails != null && orderNowDetails != 'null')) {
      
      if(items != 'null' && items != null) {
        this.items = JSON.parse(items);
        //console.log('deals', JSON.parse(this.dataService.getLocalStorageData('allDealsData')));
		    let formattedItemsData = this.dataService.formatCartData(this.items, 'menu');
            this.formattedItems = formattedItemsData;
           // console.log('formatted', this.formattedItems);
            //let getTCost = Number(this.utilService.calculateOverAllCost(this.items).toFixed(2));
            this.totalCost =  formattedItemsData.totalPrice;
            
            this.netCost = this.totalCost;
        
            if (isNaN(this.netCost)) {
              this.netCost = 0;
            }

            this.showViewCart = true;  
             
        //});

      }      
      
    }
  }

  loadAddedCategories() {
    let items = this.items;
    let catsArr = [];
    for (var i=0; i<items.length; i++) {
      if (catsArr.indexOf(items[i].Product.category_id) < 0 && items[i].Product.dealId == undefined) {
        catsArr.push(items[i].Product.category_id);
      }
    }
    
    this.addedCategories = catsArr;
    return catsArr;
    //this.prepareSuggestions(this.addedCategories);
  }



  getAllCategories(callback){

      let storeId = 1;
      let menuCountry = 'UAE';
      if(this.dataService.getLocalStorageData('nearByStore') != undefined && 
            this.dataService.getLocalStorageData('nearByStore') != '') { 

          let nearByStoreId = this.dataService.getLocalStorageData('nearByStore'); 
          menuCountry = this.dataService.getLocalStorageData('menuCountry');
      }

      this.dataService.getMenuData(storeId, menuCountry)
            .subscribe(data => {
                        
          this.menuData = data;
          //console.log(this.menuData[0].name);
          this.selectedMenuCat = this.menuData[0].name;  


          this.route.params.subscribe(params => { 
            if(params['slug'] && params['slug']!= '') {
              this.selectedMenuCat = params['slug'];
              this.dataService.setLocalStorageData('selectedMenuCat', this.selectedMenuCat);
            }
          });    
          
          this.dataService.getAllDeals().subscribe(data => {
            this.dataService.setAllDealsData(data);
            for (var i=0; i<this.menuData.length; i++) {
              if (this.menuData[i].type == 'deal') {
                  this.menuData[i].products = data;
              }
            }
            
            callback();
          });

      }); 

      
  }


  goToCustomize(slug, modCount,cType,modifer_selected,all_options) {

    // this.dialogService.addDialog(MessageComponent, { title: 'block', message: 'In Store pickup only. Online ordering will be active from October 2nd onwards.', buttonText: 'OK', doReload: false }, { closeByClickingOutside:true }); 
    
    let orderNow = this.dataService.getLocalStorageData('order-now');
    let menuCountry = this.dataService.getLocalStorageData('menuCountry');

    let fromObj = {
      modCount: modCount,
      slug: slug,
      menuCountry: menuCountry,
      selectedMenuCat: this.selectedMenuCat
    }

    if (orderNow == undefined || orderNow == null || orderNow == 'null') {
      //open order-now modal
      this.dialogService.addDialog(OrdernowmodalComponent, { fromObj: fromObj }, { closeByClickingOutside:true }).subscribe((isReloadCart)=>{ 
        if (isReloadCart) {
          this.getCartItems();
        }
      }); 

      

    } else {
      if (modCount > 0) { 
        if(cType){
         this.addToCartCustomizeItem(slug,menuCountry,cType,modifer_selected,all_options);
        }else{
        //navigate to customize page
        this.router.navigate(['/item', slug]);      
        }  
      } else {
         //add product to cart without page refresh
         
         this.dataService.getItemData(slug, menuCountry)
          .subscribe(data => {
               
                data.originalItemCost = data.Product.price;
                data.totalItemCost = data.Product.price;
                // code for add qty  
                if(this.itemsQtyBeforeCart['qty_'+data.Product.plu_code]){
                   data.Product.qty = this.itemsQtyBeforeCart['qty_'+data.Product.plu_code];
                   data.totalItemCost = data.Product.price*data.Product.qty;
                   data.totalItemCost=Number(parseFloat(data.totalItemCost).toFixed(2));
                   this.itemsQtyBeforeCart['qty_'+data.Product.plu_code]=1;
                }
                /// end 
                let temp = this.dataService.getLocalStorageData('allItems');
                
                if(temp == null || temp == 'null') {

                  let allItems = [];  
                  allItems.push(data);
                  this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 

                }else{

                  let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems')); 
                  let isExist = false;
                  for(var i=0; i<allItems.length; i++) {
                    if(allItems[i].Product.id == data.Product.id) {
                      allItems[i].Product.qty += data.Product.qty;
                      allItems[i].totalItemCost = parseFloat(allItems[i].Product.price)*allItems[i].Product.qty;
                      allItems[i].totalItemCost=Number(parseFloat(allItems[i].totalItemCost).toFixed(2));
                      isExist = true;
                      break;
                    }
                  }         
                  
                  if(!isExist) {
                    allItems.splice(0,0,data);
                  }
                    
                  this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 

                }

                this.getCartItems();
            
          });
      }
    }
   this.orderNowDetails = JSON.parse(this.dataService.getLocalStorageData('order-now')); 
  }


  updateQuantity(type, plu, index) {

    let total = 0;

    for(var i=0; i<this.items.length; i++) {
      if(this.items[i].Product.plu_code == plu && i == index) {

          //increase
          if(type == 1) {
            this.items[i].Product.qty += 1;      
          }else{
           
            this.items[i].Product.qty = this.items[i].Product.qty - 1;
            if(this.items[i].Product.qty <= 0) {
              this.items[i].Product.qty = 1;
            }
          }

          let getOICost = Number(parseFloat(this.items[i].originalItemCost).toFixed(2));
          total =  getOICost*this.items[i].Product.qty;
          this.items[i].totalItemCost = total;

          break;
      }
    }

    let formattedItemsData = this.dataService.formatCartData(this.items, 'menu');
      this.formattedItems = formattedItemsData;
      this.totalCost =  formattedItemsData.totalPrice;
      this.netCost = this.totalCost;
    //});    
    
  }


  updateQuantityBeforeCart(type, plu_code) {
       var qty_key='qty_'+plu_code; 
       if(!this.itemsQtyBeforeCart[qty_key]){
              this.itemsQtyBeforeCart[qty_key]=1;
          }
       if(type == 1) {
            this.itemsQtyBeforeCart[qty_key] += 1;    
          }else{
            this.itemsQtyBeforeCart[qty_key] = this.itemsQtyBeforeCart[qty_key] - 1;
            if(this.itemsQtyBeforeCart[qty_key] <= 0) {
              this.itemsQtyBeforeCart[qty_key] = 1;
            }
       }
      //this.dataService.setLocalStorageData('itemsQtyBeforeCart',  JSON.stringify(this.itemsQtyBeforeCart));
   }

  deleteItem(num, prod) {
    var y = confirm('Are you sure, you want to delete this item from order?');
      if(y) {
          let allItems = [];
          let item = this.items;
          this.items.splice(num, 1);
          allItems = this.items;
         
          if(allItems.length > 0) {
            
            this.items = allItems;
            this.dataService.setLocalStorageData('allItems', JSON.stringify(this.items));
            
            let formattedItemsData = this.dataService.formatCartData(this.items, 'menu');
              this.formattedItems = formattedItemsData;
              this.totalCost =  formattedItemsData.totalPrice;
              this.netCost = this.totalCost;
            //});    
            

          }else{
            this.items = [];
            this.dataService.setLocalStorageData('allItems', 'null');
            alert('No items remaining in your cart!');
          }
         
      }  
      
  }


  deleteDealItem(dealId, comboUniqueId) {
    var y = confirm('Are you sure, you want to delete this deal from order?');
    if(y) {
      let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems'));
      
      let remainingItems = [];

      for (var i=0; i<allItems.length; i++) {
        if (allItems[i].Product.dealId == undefined || (allItems[i].Product.dealId != dealId && allItems[i].Product.comboUniqueId != comboUniqueId)) {
          remainingItems.push(allItems[i]);
        }
      }

      if(remainingItems.length > 0) {
        this.items = remainingItems;    
        this.dataService.setLocalStorageData('allItems', JSON.stringify(this.items));
        let formattedItemsData = this.dataService.formatCartData(this.items, 'menu');
          this.formattedItems = formattedItemsData;
          this.totalCost =  formattedItemsData.totalPrice;
          this.netCost = this.totalCost;
        //});    
        
      } else {
        this.items = [];
        this.dataService.setLocalStorageData('allItems', 'null');
        alert('No items remaining in your cart!');
      }
    }

  }

  editItem(index, prod) {
      this.router.navigate(['/item/edit', index]);
  }

  changTab(val) {
    this.router.navigate(['/menu', val]);
  }

  checkout() {    
    let goFlag = this.getSuggestions();
    if (goFlag) { 
      this.dataService.setLocalStorageData('allItems', JSON.stringify(this.items));    
      this.dataService.setLocalStorageData('totalCost', this.totalCost); 
      this.router.navigate(['/order-review']);
    }
  }

  getSuggestions() {
    let addedCats = this.loadAddedCategories();
    if (addedCats.length > 3) {
      return true;
    } else {
      let suggestionProducts = this.prepareSuggestions(addedCats, [], []);
      
        if (suggestionProducts == true) {
          return true;
        }
    }
  }


  prepareSuggestions(addedCategories, prodArr, addedProducts) {
    let menuItems = this.menuData;
    let products = prodArr;
    let myCats = [];
    
    if (menuItems != null) {
      //get categories which are not added
      for (var i=0; i<menuItems.length; i++) {
        if (menuItems[i].type != 'deal' && addedCategories.indexOf(menuItems[i].id) < 0) {
          myCats.push(menuItems[i].id);
        }
      }
      
      for (var i=0; i<myCats.length; i++) {
        if (products.length < 4) {
          let item = this.getProductFromCat(myCats[i]);
          if (item != undefined && addedProducts.indexOf(item.id) < 0) {
            products.push(item);
            addedProducts.push(item.id);
          }          
        }
      }

      this.suggestionProducts = products;

      if (this.suggestionProducts.length < 4) {
        this.prepareSuggestions(addedCategories, products, addedProducts);
      } else {
        
        let orderNowDetails = this.dataService.getLocalStorageData('order-now'); 
        if (orderNowDetails != null && orderNowDetails != undefined && orderNowDetails != '') {
          orderNowDetails = JSON.parse(orderNowDetails);
    
          ////console.log('suggestions', this.suggestionProducts);
        let dservice = this.dialogService.addDialog(SuggestionmodalComponent, { 
                items: products }, { closeByClickingOutside:true 
            }).subscribe((isSkipped)=>{
              //We get dialog result
              if(isSkipped) {
                this.router.navigate(['/order-review']);
              }
          }); 
        } else {
          return true;
        }

      }
      
    }
    
  }


  getProductFromCat(catId) {
    let menuItems = this.menuData;
    for (var i=0; i<menuItems.length; i++) {
      if (menuItems[i].id ==  catId) {

        //for pizza we get items from subcategories 
        if (menuItems[i].subCatsName.length > 0) {
          var tmpList = Object.keys(menuItems[i].subCats);
          var randomPropertyName = tmpList[ Math.floor(Math.random()*tmpList.length) ];
          var itemArr = menuItems[i].subCats[randomPropertyName];
          let item = itemArr[Math.floor(Math.random()*itemArr.length)]; 
          item.products[0].qty = 0;
          return item.products[0];

        } else {

          let itemArr = menuItems[i].products;
          let item = itemArr[Math.floor(Math.random()*itemArr.length)]; 
          if (item != undefined) {
            item['qty'] = 0;
            return item;
          }
          
        
        }
      }
    }
  }


  goToDeal(dealId) {
	let comboUniqueId = this.utilService.generateUniqueId();   
    this.router.navigate(['/deals', dealId, comboUniqueId]);
  }
  
  clearCart() {
	  this.dataService.clearCart();
	  this.items = [];
	  this.showViewCart = false;
	  this.formattedItems.deals = [];
	  this.formattedItems.otherItems = [];
    this.netCost = 0;
  }

  updateStoreAndTime(whichEvn){
      // for check on modal which button was click on this page
      this.dataService.setLocalStorageData('timeselector-click', JSON.stringify(whichEvn));
      this.dialogService.addDialog(OrdernowmodalComponent, {}, { closeByClickingOutside:true }).subscribe((data)=>{ 
        if (data) {
                     this.getCartItems();
         }
      this.orderNowDetails = JSON.parse(this.dataService.getLocalStorageData('order-now')); 
      
    }); 
 
}


  addToCartCustomizeItem(slug,menuCountry,cType,modifer_selected,all_option){
    //selected_modifier=selected_modifier?selected_modifier:262;
    let list=modifer_selected.split('-');
    //these are like a radio for pizza 
    let Pizzalist=['999991','999992','999993','I100','I101','217'];
    // for keep default other modifers except selected dropdown
    let otherproductPLU=this.utilService.filterPlucode(all_option);
    //console.log(list);
    this.dataService.getItemData(slug, menuCountry)
         .subscribe(data => { 
              // code for set modifier values
               if(data.ProductModifier.length > 0) {
               for(var i = 0; i < data.ProductModifier.length; i++) {
                   var ModifierOption=data.ProductModifier[i]['Modifier']['ModifierOption'];
                   for(var j = 0; j < ModifierOption.length; j++) {
                     if(list.indexOf(ModifierOption[j]['Option']['plu_code']) !== -1){
                       ModifierOption[j]['Option']['is_checked']=true;
                       ModifierOption[j]['Option']['send_code']=1;
                       }else if(otherproductPLU.indexOf(ModifierOption[j]['Option']['plu_code']) !== -1 || Pizzalist.indexOf(ModifierOption[j]['Option']['plu_code']) !== -1){
                       ModifierOption[j]['Option']['is_checked']=false;
                       ModifierOption[j]['Option']['send_code']=0;
                      }
                         
                   } 
                  data.ProductModifier[i]['Modifier']['ModifierOption']=ModifierOption;
                  data.Product.modifer_selected=modifer_selected;
               }
               // update price and qty for cart
               let totalPriceOnBasisOfModifier=this.utilService.calculateTotalCost(data);
               data.originalItemCost = totalPriceOnBasisOfModifier;
               data.totalItemCost = totalPriceOnBasisOfModifier;
               // code for add qty  
               if(this.itemsQtyBeforeCart['qty_'+data.Product.plu_code]){
                  data.Product.qty = this.itemsQtyBeforeCart['qty_'+data.Product.plu_code];
                  data.totalItemCost = parseFloat(data.totalItemCost)*data.Product.qty;
                  this.itemsQtyBeforeCart['qty_'+data.Product.plu_code]=1;
               }

               /// end 
               let temp = this.dataService.getLocalStorageData('allItems');
               if(temp == null || temp == 'null') {
                 let allItems = [];
                 allItems.push(data);
                 this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 
               }else{
                 let allItems = JSON.parse(this.dataService.getLocalStorageData('allItems')); 
                 let isExist = false;
                 for(var i=0; i<allItems.length; i++) { 
                   // check product id and its modifier is already
                   if(allItems[i].Product.id == data.Product.id && allItems[i].Product.modifer_selected==modifer_selected) {
                     allItems[i].Product.qty += data.Product.qty;
                     var total=this.utilService.calculateTotalCost(allItems[i]);// for get pizza and ther iten price 
                     total = total*allItems[i].Product.qty;
                     allItems[i].totalItemCost = Number(total.toFixed(2));
                     isExist = true;
                     break;
                   }
                 }         
                 
                 if(!isExist) {
                   allItems.splice(0,0,data);
                 }
                   
                 this.dataService.setLocalStorageData('allItems', JSON.stringify(allItems)); 

               }

               this.getCartItems();
          } 
         });
       

 }

    validateDeal(allowDays,allowType){
      var currentDay= (new Date()).getDay()+1;
      var currentType='';
      if(!(this.orderNowDetails == null || this.orderNowDetails == 'null' || this.orderNowDetails.type == null)) {
        currentType=this.orderNowDetails.type;
      }

      if((allowType==currentType || allowType==0 || allowType==null) && (allowDays==0 ||allowDays==null || allowDays.search(currentDay)!=-1)){
        return true;
      }
      return false;
    }

    parseFloatCustome(price,price1,action){
        switch(action){
          case 'add':
          return (parseFloat(price)+parseFloat(price1)).toFixed(2);
        }
    }

    }
