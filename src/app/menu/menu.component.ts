import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private dataService: DataService) { }

  menuData = null;
  categories: Array<any>;
  subcategories: Array<any>;

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories(){
      this.dataService.getMenuData(1)
          .subscribe(data => {
             //console.log(data);               
              this.menuData = data;
          });
  }


}
