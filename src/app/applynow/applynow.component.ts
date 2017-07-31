import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { DataService } from '../data.service';

@Component({
  selector: 'app-applynow',
  templateUrl: './applynow.component.html',
  styleUrls: ['./applynow.component.css']
})
export class ApplynowComponent extends DialogComponent<ApplyNowModel, null> implements OnInit {

  constructor(dialogService: DialogService, private dataService: DataService) { super(dialogService); }

  showLoading = false;
  apply = {
		name:'',
		email:'',
		tel:'',
		feedback: ''
	};

  error = { show:false, isSuccess:false, message: ''};

  ngOnInit() {
  }

  submit(){
    this.showLoading = true;
		let ApplyInfo = {
			fname: this.apply.name,
			email:this.apply.email,
			tel:this.apply.tel,
			feedback:this.apply.feedback
		};
	
		this.dataService.sendApplyInfo(ApplyInfo).subscribe(data => {
			this.error = data;
			setTimeout(function(){
				window.location.reload();
			}, 5000);
    });
  }
}

export interface ApplyNowModel {
  //title: string;
  //message: string;
}