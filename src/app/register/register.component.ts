import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends DialogComponent<RegisterModal, null> {

  constructor(dialogService: DialogService) {
    super(dialogService);
   }

   

 
}

export interface RegisterModal {
  //title: string;
  //message: string;
}