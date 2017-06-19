import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from './login/login.component';
import { OrdernowmodalComponent } from './ordernowmodal/ordernowmodal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dialogService:DialogService){

  }

  openModal(type) {

    console.log(type);
    if(type == 'login') {
      this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
    }else if(type == 'ordernow') {
      this.dialogService.addDialog(OrdernowmodalComponent, {  }, { closeByClickingOutside:true });
    }
    
  }

  ngOnInit() {
     
  }


}
