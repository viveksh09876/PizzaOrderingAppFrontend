import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { MessageComponent } from '../message/message.component';
import { RegisterConfirmationComponent } from '../register-confirmation/register-confirmation.component';
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
		phone:'',
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
	html = '';
	error = { show:false, isSuccess:false, message: ''};
	callback = this.callback;

	openModal(type) {
		let self = this;
    self.close();
    if(type == 'confirm') {
      	this.dialogService.addDialog(RegisterConfirmationComponent, { }, { closeByClickingOutside:false });
    }
  }

	openMessageModal(messageText) {
     let self = this;
     //self.close();
		 self.dialogService.addDialog(MessageComponent, { title: 'Error', message: messageText, buttonText: 'GO TO HOME', doReload: false }, { closeByClickingOutside:false });  
		 this.showLoading = false; 
  }

	ngOnInit() {
    this.getUserIp();
		 this.dataService.getPrefreces()
          .subscribe(data => {
              this.prefreces = data;
          });
  }

	add(email){
		this.account.username = email;
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
			this.user.dob = String (this.user.dob);
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

	 setAnswer(questionId,answerId,$event,qIndex,iIndex){ 
      var checkbox = $event.target;
      if(checkbox.checked){
				this.prefreces[qIndex].QuestionOption[iIndex].checked = 1;
      }else{
				this.prefreces[qIndex].QuestionOption[iIndex].checked = 0;
      }
  }

	submit(){
		this.prefrence.question = this.prefreces;
		this.userData.push(this.prefrence);
		this.showLoading = true;
		this.dataService.registerUser(this.userData)
				.subscribe(data => {
							if(data.isSuccess) {
								let userId = data.id;
								this.dataService.getProfile(userId).subscribe(pdata => {
									let user = {
                    id: pdata.Id,
                    firstName : pdata.FirstName,
                    lastName: pdata.LastName,
                    email: pdata.Email,
                    phone: pdata.Phone,
                    dob: pdata.DOB,
                    zip: pdata.PostalCode,
                    favloc: pdata.FavLocation
                  }
									this.dataService.setLocalStorageData('user-details', JSON.stringify(user));
									this.dataService.setLocalStorageData('isLoggedIn', true);
									this.error = data;
									this.openModal('confirm');
								});

							}else{
								this.error = data;
								this.showLoading = false; 
							//	this.openMessageModal(this.error.message);
							}        
						
					});
	}
 
}



export interface RegisterModal {
  callback: string;
  //message: string;
}