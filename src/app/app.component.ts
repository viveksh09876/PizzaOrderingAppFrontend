import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrdernowmodalComponent } from './ordernowmodal/ordernowmodal.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataService } from './data.service';
import { UtilService } from './util.service';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showFooter = true;
  showLocationTab = true;

  constructor(private dialogService:DialogService,
                private route: ActivatedRoute,
                private router: Router,
                private dataService: DataService,
                private utilService: UtilService){

        this.router.events.subscribe((e) => {
          if (e instanceof NavigationEnd) {
            let urlArr = e.url.split('/');
            if(urlArr.indexOf('menu') > -1 || urlArr.indexOf('item') > -1) {
              this.showFooter = false;
            }else{
              this.showFooter = true;
            } 

            if(urlArr[1] == ''){
              this.showLocationTab = true;
            }else{
              this.showLocationTab = false;
            }
            //console.log(urlArr);
          }
        });         

  }

  
  showLogin = true;
  orderUrl = '';

  openModal(type) {
    if(type == 'login') {
      this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
    }else if(type == 'ordernow') {
      this.dialogService.addDialog(OrdernowmodalComponent, {  }, { closeByClickingOutside:true });
    }else if(type=='contact'){
      this.dialogService.addDialog(ContactUsComponent, {  }, { closeByClickingOutside:true });
    }
    
  }

  ngOnInit() {      
      //check if user logged In
      let user = this.dataService.getLocalStorageData('isLoggedIn');
      if(user != undefined && user == 'true') {
        this.showLogin = false;
      }  


      this.dataService.getIp()
        .subscribe(data => {
            let countryName = data.geoplugin_countryName;
            let userCountryCode = data.geoplugin_countryCode;

            if(countryName.toLowerCase() == 'bahrain'){
              this.orderUrl = 'http://www.nkdpizza.com/order-bh.html';
            }else if(countryName.toLowerCase() == 'united states' || countryName.toLowerCase() == 'usa'){
              this.orderUrl = 'https://www.toasttab.com/nkd-pizza-sterling-heights/v2/online-order';
            }else{
              this.orderUrl = '';
            }

            countryName = this.utilService.formatCountryName(countryName);
            this.dataService.setLocalStorageData('userCountry', countryName);
            this.dataService.setLocalStorageData('userCountryCode', userCountryCode);
        })

      // jQuery("header.navigation ul.links li a").on('click', function(event) {
      //  if (this.hash !== "") {
      //         event.preventDefault();
      //         var hash = this.hash;
      //       jQuery('html, body').animate({
      //         scrollTop: jQuery(hash).offset().top-80
      //         }, 800, function(){
      //       window.location.hash = hash;
      //     });
      //   }
      // });
  }

  navigateMenu(page) {
    let pageLink = '/'+page;
    jQuery("body").toggleClass("menu-open");
    this.router.navigate([pageLink]);
  }

  logout(){
    this.dataService.clearLocalStorageData();
    window.location.href = '/beta/';
    window.location.reload();
  }


  goToFav() {
    let isLoggedIn = this.dataService.getLocalStorageData('isLoggedIn');
      if(isLoggedIn == undefined || isLoggedIn == 'false') {
         this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
      }else{
        this.router.navigate(['/account']); 
      }
  }

  goToOrderNow() {
    let isLoggedIn = this.dataService.getLocalStorageData('isLoggedIn');
      if(isLoggedIn == undefined || isLoggedIn == 'false') {
         this.dialogService.addDialog(LoginComponent, { }, { closeByClickingOutside:true });
      }else{
        this.dialogService.addDialog(OrdernowmodalComponent, { }, { closeByClickingOutside:true }); 
      }

  }

}
