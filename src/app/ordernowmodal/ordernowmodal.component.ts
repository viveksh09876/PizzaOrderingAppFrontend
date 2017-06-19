import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-ordernowmodal',
  templateUrl: './ordernowmodal.component.html',
  styleUrls: ['./ordernowmodal.component.css']
})
export class OrdernowmodalComponent extends DialogComponent<OrdernowModal, null>{

  constructor(dialogService: DialogService) {
    super(dialogService);
   }

   

}

export interface OrdernowModal {

}
