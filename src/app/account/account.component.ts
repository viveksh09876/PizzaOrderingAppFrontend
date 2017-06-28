import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private dataService: DataService,
                private utilService: UtilService) { }
  name = '';

  ngOnInit() {
    let user = JSON.parse(this.dataService.getLocalStorageData('user-details'));
    this.name = user.firstName + ' ' + user.lastName; 
  }

}
