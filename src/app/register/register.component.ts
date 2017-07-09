import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { DataService } from '../data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends DialogComponent<RegisterModal, null> {

  constructor(dialogService: DialogService, private dataService: DataService) {
    super(dialogService);
  }

	userData = [];

	user = {
		email:'',
		fname: '',
		lname:'',
		dob:'',
		zip: '',
		location: ''
	};

	account = {
		username:'',
		emailisusername: '',
		password:'',
		cpassword:'',
		over:true
	};

	prefrence = {
		question:[],
		enrolling:'',
		privacy: ''
	};

	questionAns = {

	};

	firstStepForm = true;
	secondStepForm = false;
	thirdStepForm = false;

	showStoreLoading = false;
	storeList = [];
	prefreces = [];
	userCountryName = '';
  userCountryCode = '';
	PersonalInfo = '';
	curDate = new Date();
	showLoading = false;
	
	ngOnInit() {
    this.getUserIp();
		 this.dataService.getPrefreces()
          .subscribe(data => {
              this.prefreces = data;
          });
  }
  
	getUserIp() {
    this.dataService.getIp()
          .subscribe(data => {
              this.userCountryName = data.geoplugin_countryName;
							this.getStores(this.userCountryName);
          });
  }

	getStores(CountryName) {
    if(CountryName.length > 0) {
      this.dataService.getCountryStore(CountryName)
            .subscribe(data => {
                this.storeList = data;
            });
    }
  }

	secondStep(isSubmit){
		if(isSubmit){
			this.userData.push(this.user);
			this.firstStepForm = false;
			this.secondStepForm = true;
		}else{
			this.firstStepForm = true;
			this.secondStepForm = false;
		}	
	}

	thirdStep(isSubmit){
		if(isSubmit){
			this.userData.push(this.account);
			this.secondStepForm = false;
			this.thirdStepForm = true;
		}else{
			this.secondStepForm = true;
			this.thirdStepForm = false;
		}	
	}

	setAnswer(questionId,answerId){
		let QAarr = [];
		QAarr[questionId] = {'questionId':questionId,'answerId':answerId};
		this.prefrence.question.push(QAarr);
	}
	submit(){
		this.userData.push(this.prefrence);
		this.showLoading = true;
		this.dataService.registerUser(this.userData)
				.subscribe(data => {
							console.log(data);
							if(data.Status == 'Error') {
								
							}else if(data.Status == 'OK') {

								// let user = {
								// 	id: data.id,
								// 	firstName : data.FirstName,
								// 	lastName: data.LastName,
								// 	email: this.username
								// }

								// this.dataService.setLocalStorageData('user-details', JSON.stringify(user));
								// this.dataService.setLocalStorageData('isLoggedIn', true);                
								// this.openMessageModal('Welcome '+user.firstName + '!');
							}        
						
					});
	}
 
}



export interface RegisterModal {
  //title: string;
  //message: string;
}