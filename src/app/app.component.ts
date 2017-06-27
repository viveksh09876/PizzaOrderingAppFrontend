import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from './login/login.component';
import { OrdernowmodalComponent } from './ordernowmodal/ordernowmodal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dialogService:DialogService,
                private route: ActivatedRoute,
                private router: Router,
                private dataService: DataService){

  }

  showFooter = true;
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
      let loc = window.location.href;
      let locArr = loc.split('/');

      if(locArr.indexOf('menu') > -1 || locArr.indexOf('item') > -1) {
        this.showFooter = false;
      }

      //check if user logged In
      let user = this.dataService.getLocalStorageData('isLoggedIn');
      if(user != undefined && user == 'true') {
        this.showLogin = false;
      }  

     
  }


}
