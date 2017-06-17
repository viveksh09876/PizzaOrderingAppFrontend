import { Component, ElementRef, OnInit, AfterContentInit } from '@angular/core';
import { DataService } from '../data.service';

//import * as $ from 'jquery';
declare var jQuery: any;
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentInit {

  slideArr = [];
  domain = 'http://mavin360.com/demo/nkd/dev';

  constructor(private dataService: DataService) { }


  ngOnInit() {


    this.getSlideImages();
    loadScript();

    function loadScript() {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1AfGsJjddCUaaUZ1z8a6V5-wzdKZcju8&' +
          'callback=initialize';
      document.body.appendChild(script);
    }


  }

  ngAfterContentInit() {
    
  }


  getSlideImages() {
       this.dataService.getSlides(1)
          .subscribe(data => {
            
              let slides = data;

              if(slides.length > 0) {

                for(var i=0; i<slides.length; i++) {
                  slides[i].Slide.image = this.domain + '/img/admin/slides/' + slides[i].Slide.image;
                }
              }

              this.slideArr = slides; 
              console.log(this.slideArr);
              
              
               jQuery("#home-slider").slick({
                infinite: true,
                dots: true,
                prevArrow: false,
                nextArrow: false
              });
          });
  }



  


}
