import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.css']
})
export class RegisterConfirmationComponent extends DialogComponent<RegisterConfirmationModel, null> implements OnInit {

  constructor(dialogService: DialogService) { super(dialogService); }

  openModal(type) {
    let self = this;
    self.close();
    if(type == 'login') {
      this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
    }
  }
  ngOnInit() {

  }

  closePopup(){
    window.location.reload();
  }

}

export interface RegisterConfirmationModel {
  //title: string;
  //message: string;
}