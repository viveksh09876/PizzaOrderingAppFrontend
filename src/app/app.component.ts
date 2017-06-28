import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from './login/login.component';
import { OrdernowmodalComponent } from './ordernowmodal/ordernowmodal.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataService } from './data.service';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showFooter = true;

  constructor(private dialogService:DialogService,
                private route: ActivatedRoute,
                private router: Router,
                private dataService: DataService){

        this.router.events.subscribe((e) => {
          if (e instanceof NavigationEnd) {
            let urlArr = e.url.split('/');
            if(urlArr.indexOf('menu') > -1 || urlArr.indexOf('item') > -1) {
              this.showFooter = false;
            }else{
              this.showFooter = true;
            } 
            console.log(e.url);
          }
        });         

  }

  
  showLogin = true;

  openModal(type) {

    //console.log(type);
    if(type == 'login') {
      this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
    }else if(type == 'ordernow') {
      this.dialogService.addDialog(OrdernowmodalComponent, {  }, { closeByClickingOutside:true });
    }
    
  }

  ngOnInit() {      
      //check if user logged In
      let user = this.dataService.getLocalStorageData('isLoggedIn');
      if(user != undefined && user == 'true') {
        this.showLogin = false;
      }    
  }

  navigateMenu(page) {
    let pageLink = '/'+page;
    jQuery("body").toggleClass("menu-open");
    this.router.navigate([pageLink]);
  }


}
