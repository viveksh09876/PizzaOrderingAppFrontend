import { Component, OnInit } from '@angular/core';
import { UtilService } from '../util.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent implements OnInit {

  constructor(private utilService: UtilService, private dataService: DataService) { }

  career = {
		fname:'',
		lname:'',
		email:'',
		tel:'',
		position:'',
		lkdin:'',
		resume:'',
  };
  
  showLoading = false;
  error = { show: false, isSuccess:false, message: 'Sorry ! mail not send, please try again.'};

  ngOnInit() {
     
  }

  Submit(){
    console.log(this.career);
    this.showLoading = true;
		let CareerInfo = {
      fname: this.career.fname,
      lname: this.career.lname,
			email:this.career.email,
			tel:this.career.tel,
			position:this.career.position,
			lkdin:this.career.lkdin,
			resume:this.career.resume
		};
	
		this.dataService.sendCareerInfo(CareerInfo).subscribe(data => {
			this.error = data;
			setTimeout(function(){
				window.location.reload();
			}, 3000);
		});
  }

}
