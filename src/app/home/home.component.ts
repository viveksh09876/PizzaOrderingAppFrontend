import { Component, ElementRef, OnInit, AfterContentInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { RegisterComponent } from '../register/register.component';
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
  latestFbFeeds = null;
  latestIgFeeds = '';
  countryName = '';
  storeList = [];
  store = null;

  constructor(private dataService: DataService,private utilService: UtilService, private dialogService: DialogService) {
       
  }

  openModal(type) {
    
     this.dialogService.addDialog(RegisterComponent, {  }, { closeByClickingOutside:true });   
  }

  ngOnInit() {
    this.dataService.getIp()
        .subscribe(data => {
            let countryName = data.geoplugin_countryName;
            this.countryName = this.utilService.formatCountryName(countryName);
            this.dataService.setLocalStorageData('userCountry', this.countryName);
            this.setStore();
            if(countryName == 'Bahrain'){
              this.getFbFeeds('nkdpizzabh');
              this.getIgFeeds('nkdpizzabh');
            }else{
              this.getFbFeeds('nkdpizza');
              this.getIgFeeds('nkdpizzauae');
            }
        });

    this.getSlideImages();
    
    //loadScript();

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

  setStore() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.dataService.getStoresFromLatLong(position.coords.latitude, position.coords.longitude)
              .subscribe(data => {      
                    this.storeList = data.stores;  
                     
                    if(this.storeList.length > 0) {
                      this.dataService.setLocalStorageData('menuCountry', this.countryName);
                      this.store = this.utilService.findNearbyStore(this.storeList, position.coords.latitude, position.coords.longitude);
                      
                      this.dataService.setLocalStorageData('nearByStore', this.store.Store.id);
                    }else{
                      this.dataService.setLocalStorageData('menuCountry', 'UAE');
                    }                 
                }); 
        });

    } else {
        console.log("Geolocation is not supported by this browser.");
        this.dataService.getIp()
            .subscribe(data => {
                let countryName = data.geoplugin_countryName;                 
               
                this.dataService.getCountryStore(countryName)
                    .subscribe(data => {
                        this.storeList = data;
                        if(this.storeList.length > 0) {
                          this.dataService.setLocalStorageData('menuCountry', this.countryName);
                          this.store = this.utilService.findNearbyStore(this.storeList, data.geoplugin_latitude, data.geoplugin_longitude);
                          this.dataService.setLocalStorageData('nearByStore', this.store.Store.id); 
                        } else{
                          this.dataService.setLocalStorageData('menuCountry', 'UAE');
                        }                        
                    });
                
            });
    }
  }


  getTwitterFeeds(name) {
     this.dataService.getTwitterFeeds(name)
        .subscribe(data => {
            this.latestTweet = data[0];
        })
  }

  getFbFeeds(name) {
     this.dataService.getFbFeeds(name)
        .subscribe(data => {
            this.latestFbFeeds = data[0];
        });
  }

  getIgFeeds(name) {
     this.dataService.getIgFeeds(name)
        .subscribe(data => {
          this.latestIgFeeds = data;
        });
  }

  getSlideImages() {
       this.dataService.getSlides(1)
          .subscribe(data => {
            
              let slides = data;

              if(slides.length > 0) {
                for(var i=0; i<slides.length; i++) {
                  slides[i].Slide.image = this.domain + '/img/admin/slides/' + slides[i].Slide.image;
                  if(slides[i].Slide.text_image==''){
                    slides[i].Slide.textImage = '';
                  }else{
                    slides[i].Slide.textImage = this.domain + '/img/admin/slides/' + slides[i].Slide.text_image;
                  }
                }
              }

              this.slideArr = slides; 
                                          
              setTimeout(function(){
                  jQuery("#home-slider").slick({
                    infinite: true,
                    autoplay:true,
                    dots: true,
                    prevArrow: false,
                    nextArrow: false
                  });
              }, 2000);
               
          });
  }



  


}
