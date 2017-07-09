import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent extends DialogComponent<ContactUsModel, null> implements OnInit{

  constructor(dialogService: DialogService) { super(dialogService); }

  ngOnInit() {
    
  }

}
export interface ContactUsModel {
  //title: string;
  //message: string;
}
