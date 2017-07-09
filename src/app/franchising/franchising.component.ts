import { Component, OnInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-franchising',
  templateUrl: './franchising.component.html',
  styleUrls: ['./franchising.component.css']
})
export class FranchisingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  changTab(val) {
	    let targetOption = "#"+val;
	    let targetId = jQuery('#tabSwitch');
	    targetId.find("a[href=\""+targetOption+"\"]").trigger("click");    
	  }
}
