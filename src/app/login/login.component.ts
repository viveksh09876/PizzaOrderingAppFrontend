import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { RegisterComponent } from '../register/register.component';
import { MessageComponent } from '../message/message.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends DialogComponent<LoginModal, null> {
  
  constructor(dialogService: DialogService, private dataService: DataService) {
    super(dialogService);
   }

  username = '';
  password = ''; 
  showLoading = false;
  error = { show: false, message: 'Invalid username or password!'};

  openModal(type) {
     let self = this;
     self.close();
     self.dialogService.addDialog(RegisterComponent, {  }, { closeByClickingOutside:true });   
  }

  openMessageModal(messageText) {
     let self = this;
     self.close();
     self.dialogService.addDialog(MessageComponent, { title: 'Welcome', message: messageText, buttonText: 'Start Ordering' }, { closeByClickingOutside:true });   
  }


  loginApi() {

    this.showLoading = true;
    this.dataService.login(this.username,this.password)
         .subscribe(data => {
              
              if(data.Status == 'Error') {
                this.error.show = true;
              }else if(data.Status == 'OK') {

                let user = {
                  id: data.Id,
                  firstName : data.FirstName,
                  lastName: data.LastName,
                  email: this.username
                }

                this.dataService.setLocalStorageData('user-details', user);
                this.openMessageModal('Welcome '+user.firstName + '!');
              }        
             
          });
  }

 
}

export interface LoginModal {
  //title: string;
  //message: string;
}
