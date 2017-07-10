import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends DialogComponent<RegisterModal, null> {

  constructor(dialogService: DialogService, 
								private dataService: DataService,
									private route: ActivatedRoute, 
                    private router: Router) {
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
	
	maxDate = new Date().getFullYear()-18;
	showLoading = false;
	
	error = { show:false, isSuccess:false, message: ''};
	callback = this.callback;

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
							if(data.isSuccess == 'true') {
									this.error = data;

									setTimeout(function(){
										window.location.reload();
									},3000);
							}else{
								this.error = data;
								setTimeout(function(){
									window.location.reload();
								},3000);
							}        
						
					});
	}
 
}



export interface RegisterModal {
  callback: string;
  //message: string;
}