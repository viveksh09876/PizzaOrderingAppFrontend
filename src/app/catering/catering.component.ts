import { Component, OnInit } from '@angular/core';
import { UtilService } from '../util.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.css']
})
export class CateringComponent implements OnInit {

  	constructor(private utilService: UtilService, private dataService: DataService) { }

	username = '';
	email = '';
	tel = '';
	location = '';
	date = '';
	noofuser = '';
	social = '';
	cateringRes = '';
	showLoading = false;
	showUserNameError = false;
	showEmailError = false;
	showTelError = false;
	showLocationError = false;

	error = { show: false, isSuccess:false, message: 'Sorry ! mail not send, please try again.'};

  	ngOnInit() {
     
  	}

	CateringApi() {
	  	this.showLoading = true;
		this.showUserNameError = false;
		this.showEmailError = false;
		this.showTelError = false;
		this.showLocationError = false;
		
		if(this.username == '') {
      		this.showUserNameError = true;
   		}else if(this.email == ''){
			this.showEmailError = true;
		}else if(this.tel == ''){
			this.showTelError = true;
		}else if(this.location == ''){
			this.showLocationError = true;
		}else{
			let CateringInfo = {
				username: this.username,
				email:this.email,
				tel:this.tel,
				location:this.location,
				date:this.date,
				noofuser:this.noofuser,
				social:this.social
			};

			this.dataService.sendCateringInfo(CateringInfo).subscribe(data => {
				this.error = data;
			});

		}
		this.showLoading = false;
	  }

}
