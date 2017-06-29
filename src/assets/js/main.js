
var country = 'UAE';
var lat = '25.040657';
var lng = '55.197286';
var map, places = [], cordinates, pos, contentString;
var zoom=3;




    /*Maps*/

var infowindow;
var markers = [];

function initSlider() {
   $("#home-slider").slick({
    	infinite: true,
    	dots: true,
    	prevArrow: false,
    	nextArrow: false
    });

}


$(document).ready(function(){

  //initSlider();
    $('#signinModal button.signup, #signupModal button[type="submit"]').click(function(){
        $('body').addClass('modalopen');
    });
    
   
    $("#menuButton").click(function(e){
    	e.preventDefault();
    	$("body").toggleClass("menu-open");
    });

    $(".custom-select").change(function(){
    	var targetOption = "#"+$(this).val();
    	var targetId = $($(this).attr("target"));
    	targetId.find("a[href="+targetOption+"]").trigger("click");
    });
    
    
    $('.items_Select .item').click(function(e){
        $(this).toggleClass('active');
    });
    
    /*Size radio*/
    $('.pizza-size .radio').click(function(){
        $(".cta-btn").removeClass("active");
        $(this).find('.cta-btn').addClass('active');
    });

    
    // $('.toppings .checkbox input').click(function(){
        
    //     if($('input[type=checkbox]:checked')){
    //         $(this).parent('.checkbox').addClass("extra").find('.cta-btn').text("Extra Added");
            
    //     }else{
    //          $(this).parent('.checkbox').rempoveClass("extra").find('.cta-btn').text("add extra");
    //     }
        
        
    // });
    
	//$('.scroller').mCustomScrollbar();



});





function addMarkers() {
    //adding markers
    setMapOnAll(null);
    var marker;
    
    for (var i = 0; i < places.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(cordinates[i][0], cordinates[i][1]),
            map: map,
            title: places[i],
            id: i,
            icon: 'assets/images/map-marker.png'
        });

        markers.push(marker);
    }
    //adding click event for info
    for (var j = 0; j < markers.length; j++) {
        var trgtMarker = markers[j];
        google.maps.event.addListener(trgtMarker, 'click', function () {
            infowindow.setOptions({
                content: contentString[this.id]
            });
            infowindow.open(map, markers[this.id]);
        });
    }

    var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }

    
    map.fitBounds(bounds);
    

    if(markers.length > 0) {
        //Info-Window Cutomisation
        google.maps.event.addListener(infowindow, 'domready', function() {

            // Reference to the DIV that wraps the bottom of infowindow
            var iwOuter = $('.gm-style-iw');
            iwOuter.siblings().css('visibility', 'hidden');

            // Moves the infowindow.
            iwOuter.parent().parent().css({left: '26px',top:'70px'});

            var closeBtn = $('#closeBtn').get();
            google.maps.event.addDomListener(closeBtn[0], 'click', function() {
                infowindow.close();
            });

            google.maps.event.addListener(map, "click", function(event) {
              infowindow.close();
          });

        });
    }
	
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function panTo(index) {
    map.panTo(new google.maps.LatLng(lat, lng));
}

var mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#d6cbb8"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];





function initialize() {

  $.get('https://mavin360.com/demo/nkd/dev/webservice/getip', function(resp){

      resp = JSON.parse(resp);
      
      country = resp.geoplugin_countryName;
      var mapText = 'Coming Soon nearby your location';

      $.get('https://mavin360.com/demo/nkd/dev/webservice/getCountryStores/'+country, function(res){
  
          var stData = JSON.parse(res);
          console.log(stData);
          if(stData.length > 0) {
            
            var coord = [];
            var cont = [];

            for(var p=0; p<stData.length; p++) {
              var ltlng = [];
              ltlng.push(stData[p].Store.latitude);
              ltlng.push(stData[p].Store.longitude); 

              coord.push(ltlng);

              var ct = '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-1.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">'+stData[p].Store.store_name+'</h4><p>'+stData[p].Store.store_address+'</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  11AM - 3AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>'+stData[p].Store.store_phone+'<span/></a></li></ul></div><div class="tail-wrapper"></div></div>';

              cont.push(ct);
              p++;              
            }

            coordinates = coord;
            contentString = cont;
            if(stData.length > 1) {
              var locText = ' locations';
            }else{
              var locText = ' location';
            }
            mapText = 'Currently open at <span>'+stData.length + locText + '</span> <strong>' + country + '</strong>';

          }

          lat = resp.geoplugin_latitude;
          lng = resp.geoplugin_longitude;

          //lat = 25.2667;
          //lng = 55.3167;


          //country = 'UAE';
          
          if(country == 'UAE' || country == 'United Arab Emirates') {

            cordinates = [[25.040657,55.197286],[25.074192,55.139092],[25.184279,55.263638]];
            places = ['Location 1','Location 2','Location 3'];
            contentString = [
                '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-1.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">NKD Pizza Motor City</h4><p>Shop 1, Kojak Bldg, Motor City - Dubai</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  10:30AMâ€“2AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>04 421 3734<span/></a></li></ul></div><div class="tail-wrapper"></div></div>',

                '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-2.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">Dubai Marina</h4><p>G05, West Avenue Bldg, <br>Dubai Marina-Dubai, UAE</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  10:30AMâ€“2AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>04 421 3734<span/></a></li></ul></div><div class="tail-wrapper"></div></div>',

                '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-3.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">Business Bay</h4><p>G02, Bayswater Bldg, <br>Business Bay-Dubai, UAE</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  10:30AMâ€“2AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>04 421 3734<span/></a></li></ul></div><div class="tail-wrapper"></div></div>'
            ];
            
            zoom = 12;
          }
          
          //console.log(contentString[0]);
          var mapCanvas = document.getElementById('mapCanvas');
            var mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            }
          // console.log(typeof lat, lng, country, mapOptions);
            map = new google.maps.Map(mapCanvas, mapOptions);

            
            if(places.length > 0) {
                infowindow = new google.maps.InfoWindow({
                  content: contentString[0],
                  maxWidth: 350
              });
            }

            if(places.length > 0) {
              addMarkers();
            }
            

          // Set the map's style to the initial value of the selector.
          var styleSelector = document.getElementById('style-selector');
          map.setOptions({styles: mapStyle});
          

          $('#mapText').html(mapText);

      });
      
       

    });    

}

