import { Component, ElementRef, OnInit, AfterContentInit } from '@angular/core';
import { DataService } from '../data.service';
import { Http, Response, Jsonp  } from '@angular/http';

declare var window: any;
declare var mapboxgl:any;
//declare var mapCanvas:any;
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  constructor(private dataService: DataService,private http: Http) { }

 country = 'UAE';
 selectedCountry='';
 countryName = 'All';
 lat = '25.040657';
 lon = '55.197286';
 map = [];
 places = [];
 zoomLabel=10;
 data:any;
 storeList:any;
 allStores:any;
mapCanvas:any;
searchTxt='';
  ngOnInit() {		
	this.allStoresGmap();
  }

 allStoresGmap(){
	   mapboxgl.accessToken = 'pk.eyJ1IjoicHVzaHBlbmRyYXJhaiIsImEiOiJjajRwYzFtOTYxeWd0MzJwbDdsaGNzOTZiIn0.a9BUA890Vtyeqy21AaLClQ';
	   //let domain = 'http://localhost/nkdDev';
	  let directionUrl = 'http://maps.google.com/';
	 let domain='https://nkdpizza.com/dev';
	 let domain2='https://nkdpizza.com/uk/dev';
	  //let domain2='http://localhost/nkdDev';
	  this.selectedCountry='';
      this.countryName = 'All';
		 this.mapCanvas = new mapboxgl.Map({
				container: 'mapcanvas',
				style: 'mapbox://styles/pushpendraraj/cj4ugee221cri2rpmymcpg3yw',
				center: [this.lon,this.lat],
				zoom: 1
			});
			 this.mapCanvas.scrollZoom.disable();
			 this.mapCanvas.dragRotate.disable();
			 this.mapCanvas.addControl(new mapboxgl.NavigationControl(),'bottom-right');
			 this.mapCanvas.addControl(new mapboxgl.FullscreenControl(),'bottom-right');
			 
			this.http.get(domain + '/webservice/getCountryStores/uae')
                    .map( (res: Response) => res.json()).subscribe(data => {
						//console.log(data);
							this.storeList = data;
							let stData=data;
							let allStores=data;
				this.http.get(domain2 + '/webservice/getCountryStores/uk')
                    .map( (res: Response) => res.json()).subscribe(data => {
						//console.log(data);
							this.storeList = this.storeList.concat(data);
								//let stData=this.storeList;
								let stData1=data;
								
							//console.log(this.storeList);
							if(stData.length >0){
								for(var p=0; p<stData.length; p++) {
								  var latitude = stData[p].Store.latitude;
								  var longitude = stData[p].Store.longitude;
							
								  var infoWindowText = '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="'+ domain +'/' + stData[p].Store.store_image +'" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">'+stData[p].Store.store_name+'</h4><p>'+stData[p].Store.store_address+'</p></div><div class="media-right"><a href="'+ directionUrl + '&daddr=' + latitude + ',' + longitude  +'" target="_blank"><i class="icon icon-directions"></i> Direction</a></div></div><ul class="list-inline"><li><a><i class="icon icon-time"></i><span>Open now: 10:30AM–2:00AM<span/></a></li><li><a href="tel:'+stData[p].Store.store_phone+'"><i class="icon icon-phone"></i><span>'+stData[p].Store.store_phone+'<span/></a></li></ul></div><div class="tail-wrapper"></div></div>';

									  // create a DOM element for the marker
									  var el = document.createElement('div');
									  el.className = 'marker';
									  el.style.backgroundImage = 'url('+ domain +'/img/map-marker.png)';
									  el.style.width = '40px';
									  el.style.height = '40px';

									  // create the popup
									  var popup = new mapboxgl.Popup({offset: 25})
										  .setHTML(infoWindowText)

									  // create DOM element for the marker
									  var em = document.createElement('div');
									  em.className = 'popup';
									  // add marker to map
									 var marker= new mapboxgl.Marker(el, {offset: [-20, -20]})
										  .setLngLat([longitude,latitude])
										  .setPopup(popup)
										  .addTo(this.mapCanvas);
										  
								el.addEventListener('click', function() {
									//mapCanvas.flyTo({center:[longitude, latitude]});
								});		  
									 this.mapCanvas.setCenter([longitude, latitude]);				
							  }
							  
						}
							if(stData1.length >0){
								for(var p=0; p<stData1.length; p++) {
								allStores.push(stData1[p]);
								
								  var latitude = stData1[p].Store.latitude;
								  var longitude = stData1[p].Store.longitude;
							
								  var infoWindowText = '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="'+ domain2 +'/' + stData1[p].Store.store_image +'" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">'+stData1[p].Store.store_name+'</h4><p>'+stData1[p].Store.store_address+'</p></div><div class="media-right"><a href="'+ directionUrl + '&daddr=' + latitude + ',' + longitude  +'" target="_blank"><i class="icon icon-directions"></i> Direction</a></div></div><ul class="list-inline"><li><a><i class="icon icon-time"></i><span>Open now: 10:30AM–2:00AM<span/></a></li><li><a href="tel:'+stData1[p].Store.store_phone+'"><i class="icon icon-phone"></i><span>'+stData1[p].Store.store_phone+'<span/></a></li></ul></div><div class="tail-wrapper"></div></div>';

									  // create a DOM element for the marker
									  var el = document.createElement('div');
									  el.className = 'marker';
									  el.style.backgroundImage = 'url('+ domain +'/img/map-marker.png)';
									  el.style.width = '40px';
									  el.style.height = '40px';

									  // create the popup
									  var popup = new mapboxgl.Popup({offset: 25})
										  .setHTML(infoWindowText)

									  // create DOM element for the marker
									  var em = document.createElement('div');
									  em.className = 'popup';
									  // add marker to map
									 var marker= new mapboxgl.Marker(el, {offset: [-20, -20]})
										  .setLngLat([longitude,latitude])
										  .setPopup(popup)
										  .addTo(this.mapCanvas);
										  
								el.addEventListener('click', function() {
									//mapCanvas.flyTo({center:[longitude, latitude]});
								});		  
									 this.mapCanvas.setCenter([longitude, latitude]);				
							  }
							  this.allStores=allStores;
						}
							
					});		
							
					});							
			 
			
			 
			 
 }
   cur_store(){
		this.dataService.getIp()
            .subscribe(data => {
				let lat=data.geoplugin_latitude;
				let lon=data.geoplugin_longitude;
				let geocountry = data.geoplugin_countryName;
				let countryCode=geocountry;
				
				if (geocountry.toLowerCase() == 'united kingdom') {
					countryCode='uk';
					 this.countryName = 'UK';
				}else if(geocountry == 'UAE' || geocountry == 'United Arab Emirates') {
					  countryCode = 'UAE';
					  this.countryName = 'Dubai';
				}else{
					 countryCode = geocountry;
					 this.countryName = data.geoplugin_countryName;;
				}
				this.selectedCountry=countryCode;
				this.gmap(lat,lon,countryCode);
			});
   }

  gmap(lat,lon,country){
	  mapboxgl.accessToken = 'pk.eyJ1IjoicHVzaHBlbmRyYXJhaiIsImEiOiJjajRwYzFtOTYxeWd0MzJwbDdsaGNzOTZiIn0.a9BUA890Vtyeqy21AaLClQ';
	  //let domain = 'http://localhost/nkdDev';
	  let directionUrl = 'http://maps.google.com/';
	  let domain='https://nkdpizza.com/dev';
	  
	  this.mapCanvas = new mapboxgl.Map({
				container: 'mapcanvas',
				style: 'mapbox://styles/pushpendraraj/cj4ugee221cri2rpmymcpg3yw',
				center: [lon,lat],
				zoom: this.zoomLabel
			});
			 this.mapCanvas.scrollZoom.disable();
			 this.mapCanvas.dragRotate.disable();
			 this.mapCanvas.addControl(new mapboxgl.NavigationControl(),'bottom-right');
			 this.mapCanvas.addControl(new mapboxgl.FullscreenControl(),'bottom-right');
			
		if (country.toLowerCase() == 'uk') {
				domain='https://nkdpizza.com/uk/dev';
		}else if(country == 'UAE') {
			  domain='https://nkdpizza.com/dev';
        }else{
			domain='https://nkdpizza.com/dev';
		}
			
		this.http.get(domain + '/webservice/getCountryStores/'+country)
                    .map( (res: Response) => res.json()).subscribe(data => {
						//console.log(data);
							this.storeList = data;
							let stData=data;
							//console.log(this.storeList);
							if(stData.length >0){
								for(var p=0; p<stData.length; p++) {
							
								  var latitude = stData[p].Store.latitude;
								  var longitude = stData[p].Store.longitude;
							
								  var infoWindowText = '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="'+ domain +'/' + stData[p].Store.store_image +'" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">'+stData[p].Store.store_name+'</h4><p>'+stData[p].Store.store_address+'</p></div><div class="media-right"><a href="'+ directionUrl + '&daddr=' + latitude + ',' + longitude  +'" target="_blank"><i class="icon icon-directions"></i> Direction</a></div></div><ul class="list-inline"><li><a><i class="icon icon-time"></i><span>Open now: 10:30AM–2:00AM<span/></a></li><li><a href="tel:'+stData[p].Store.store_phone+'"><i class="icon icon-phone"></i><span>'+stData[p].Store.store_phone+'<span/></a></li></ul></div><div class="tail-wrapper"></div></div>';

									  // create a DOM element for the marker
									  var el = document.createElement('div');
									  el.className = 'marker';
									  el.style.backgroundImage = 'url('+ domain +'/img/map-marker.png)';
									  el.style.width = '40px';
									  el.style.height = '40px';

									  // create the popup
									  var popup = new mapboxgl.Popup({offset: 25})
										  .setHTML(infoWindowText)

									  // create DOM element for the marker
									  var em = document.createElement('div');
									  em.className = 'popup';
									  // add marker to map
									 var marker= new mapboxgl.Marker(el, {offset: [-20, -20]})
										  .setLngLat([longitude,latitude])
										  .setPopup(popup)
										  .addTo(this.mapCanvas);
										  
								el.addEventListener('click', function() {
									//mapCanvas.flyTo({center:[longitude, latitude]});
								});		  
									 this.mapCanvas.setCenter([longitude, latitude]);				
                      }
				}
		});
  }
  
  storeLoc(data){
		let latitude = data.Store.latitude;
		let longitude = data.Store.longitude;
		this.mapCanvas.flyTo({center:[longitude, latitude],zoom:17});
  }
  
	changeCountry(selectedCountry){
		let lat;
		let lon;
		if(selectedCountry==''){
			this.allStoresGmap();
		}
		if (selectedCountry.toLowerCase() == 'uk') {
			lat='51.5144';
			lon='-0.0941';
			this.countryName = 'UK';
		}
		if(selectedCountry == 'UAE') {
			lat = '25.040657';
			lon = '55.197286';
			this.countryName = 'Dubai';
        }
		this.gmap(lat,lon,selectedCountry);
	}
	
	storeSearch(){
		// EH10 5LY
		let searchVal = this.searchTxt.toLowerCase();
		
		if(searchVal){
			let url='https://maps.googleapis.com/maps/api/geocode/json?address='+searchVal;
			this.http.get(url)
						.map( (res: Response) => res.json()).subscribe(data => {
							if(data.status=='OK'){
								let results = [];
								let searchField_1 = "city";
								let searchField_2 = "state";
								let searchField_3 = "country";
								let searchField_4 = "zip";
								if(data.results[0].types=='postal_code'){
									searchVal=data.results[0].address_components[2].long_name.toLowerCase();
								}else if(data.results[0].types[0]=='country'){
									searchVal=searchVal;
								}else if(data.results[0].types[0]=='locality'){
									searchVal=data.results[0].address_components[0].long_name.toLowerCase();
								}else{
									searchVal=data.results[0].address_components[1].long_name.toLowerCase();
								}
								if(searchVal){
									for (let i=0 ; i < this.allStores.length ; i++)
									{
										if (this.allStores[i].Store[searchField_1].toLowerCase() == searchVal || this.allStores[i].Store[searchField_2].toLowerCase() == searchVal || this.allStores[i].Store[searchField_3].toLowerCase() == searchVal || this.allStores[i].Store[searchField_4].toLowerCase() == searchVal){
											results.push(this.allStores[i]);
										}
									}
									this.storeList=results;
								}
							}
					});
		}else{
			this.storeList=this.allStores;
		}
		
		
	}
}
