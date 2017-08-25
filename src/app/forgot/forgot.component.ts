import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { DataService } from '../data.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent extends DialogComponent<ForgotModal, null>  {

  constructor(dialogService: DialogService, private dataService: DataService) { super(dialogService); }

  user = {
    useremail:''
  };

  showLoading = false;
  error = { show: false, message: 'User does not exists!'};

  ngOnInit() {

  }

  forgotPassword(){
    this.showLoading = true;
    // console.log(this.user.useremail);
    this.dataService.forgotPassword(this.user)
    .subscribe(data => {
      if(data.Status == 'Error') {
        this.error.show = true;
      }else if(data.Status == 'OK') {

      }
    });
  }

}

export interface ForgotModal {
  callback: string;
  //message: string;
}