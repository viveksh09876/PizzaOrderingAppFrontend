import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item = null;
  totalCost = 0;
  selectedModifiers = [];

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

      this.route.params.subscribe(params => {
        
        if(params['slug'] && params['slug']!= '') {
          this.getItemData(params['slug']);
        }else{
          alert('Invalid Page Requested!');
        }

      });

  }

  getItemData(slug) {
     this.dataService.getItemData(slug)
          .subscribe(data => {
                
             if(data.ProductModifier.length == 0) {
                this.dataService.setLocalStorageData('item', JSON.stringify(data));
                this.dataService.setLocalStorageData('totalCost', data.Product.price);
                 this.router.navigate(['/order-review']);
             }else{
                this.item = data;
                this.getTotalCost();
             }
            
          });
  }

  getTotalCost() {

    let total = 0;
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
    this.totalCost = total;
    this.dataService.setLocalStorageData('item', JSON.stringify(this.item));
    this.dataService.setLocalStorageData('totalCost', this.totalCost);
  }

  updateModifier(option_id) {
    
    
    if(this.item.ProductModifier.length > 0) {
      for(var i = 0; i < this.item.ProductModifier.length; i++) {
        let options = this.item.ProductModifier[i].Modifier.ModifierOption;
        for(var j = 0; j < options.length; j++) {

            if(options[j].Option.id == option_id) {
              options[j].Option.is_checked = !options[j].Option.is_checked;
            }
        }
      }
    }
    
    let total = this.calculateTotalCost();
    this.totalCost = total;
    
    this.dataService.setLocalStorageData('item', JSON.stringify(this.item));
    this.dataService.setLocalStorageData('totalCost', this.totalCost);
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
    
    this.dataService.setLocalStorageData('item', JSON.stringify(this.item));

  }


  updateExtra(option_id, type) {
     
      //modifier    
      if(this.item.ProductModifier.length > 0) {
        for(var i = 0; i < this.item.ProductModifier.length; i++) {
          let options = this.item.ProductModifier[i].Modifier.ModifierOption;
          for(var j = 0; j < options.length; j++) {

              if(options[j].Option.id == option_id && type == 'modifier') {  
                options[j].Option.add_extra = !options[j].Option.add_extra;  
              
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
          
      this.dataService.setLocalStorageData('item', JSON.stringify(this.item));
      this.dataService.setLocalStorageData('totalCost', this.totalCost);

  }



  calculateTotalCost() {

      let total = 0;
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


  checkout() {    
    this.router.navigate(['/order-review']);
  }

}
