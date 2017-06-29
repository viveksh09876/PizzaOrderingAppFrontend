import { Component, ElementRef, OnInit, AfterContentInit } from '@angular/core';
import { DataService } from '../data.service';
import { UtilService } from '../util.service';
import { environment } from '../../environments/environment';


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
  domain = environment.cmsApiPath;
  latestTweet = '';

  constructor(private dataService: DataService,
                private utilService: UtilService) { }


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

    this.getTwitterFeeds('NKDPizzaUSA');

  }

  ngAfterContentInit() {
    
  }

  getTwitterFeeds(name) {
     this.dataService.getTwitterFeeds(name)
        .subscribe(data => {
            this.latestTweet = data[0];
        })
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
                            
              setTimeout(function(){
                  jQuery("#home-slider").slick({
                    infinite: true,
                    dots: true,
                    prevArrow: false,
                    nextArrow: false
                  });
              }, 1000);
               
          });
  }



  


}
