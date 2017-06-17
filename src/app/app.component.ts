import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dialogService:DialogService){

  }

  openModal(type) {
    this.dialogService.addDialog(LoginComponent, {  }, { closeByClickingOutside:true });
 
  }

  ngOnInit() {
     
  }


}
