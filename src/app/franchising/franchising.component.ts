import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { ContactUsComponent } from '../contact-us/contact-us.component';


declare var jQuery: any;

@Component({
  selector: 'app-franchising',
  templateUrl: './franchising.component.html',
  styleUrls: ['./franchising.component.css']
})
export class FranchisingComponent implements OnInit {

   constructor(private dialogService: DialogService) {
   
   }

  ngOnInit() {
  }

   openModal(type) {
      this.dialogService.addDialog(ContactUsComponent, {  }, { closeByClickingOutside:true });
  }

  changTab(val) {
      let targetOption = "#"+val;
      let targetId = jQuery('#tabSwitch');
      targetId.find("a[href=\""+targetOption+"\"]").trigger("click");    
    }
}
