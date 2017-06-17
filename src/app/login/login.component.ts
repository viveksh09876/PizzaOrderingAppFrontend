import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends DialogComponent<LoginModal, null> {

  constructor(dialogService: DialogService) {
    super(dialogService);
   }

   openModal(type) {
     let self = this;
     self.close();
     //setTimeout(function(){
         self.dialogService.addDialog(RegisterComponent, {  }, { closeByClickingOutside:true });
     //}, 500);    
  }

 
}

export interface LoginModal {
  //title: string;
  //message: string;
}
