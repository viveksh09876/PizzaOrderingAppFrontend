
var country = 'UAE';
var lat = '25.040657';
var lng = '55.197286';
var map, places = [], cordinates, pos, contentString, coordinates;
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

mapboxgl.accessToken = 'pk.eyJ1IjoicHVzaHBlbmRyYXJhaiIsImEiOiJjajRwYzFtOTYxeWd0MzJwbDdsaGNzOTZiIn0.a9BUA890Vtyeqy21AaLClQ';
$(document).ready(function(){
  if(window.location.host=='localhost:4200'){
    $.get('https://mavin360.com/demo/nkd/dev/webservice/getip', function(resp){
        resp = JSON.parse(resp);
        country = resp.geoplugin_countryName;
        if(country=='United States'){
          country = 'usa';
        }

        var mapText = 'Coming Soon nearby your location';

        // inittialize map
        lat = resp.geoplugin_latitude;
        lng = resp.geoplugin_longitude;
        var mapCanvas = new mapboxgl.Map({
            container: 'mapCanvas',
            style: 'mapbox://styles/mapbox/light-v9',
            center: [lng,lat],
            zoom: 1
        });

         country = 'UAE';
        if(country == 'UAE' || country == 'United Arab Emirates') {
            cordinates = [[25.040657,55.197286],[25.074192,55.139092],[25.184279,55.263638]];
            //alert(cordinates.length);
            for(var u=0; u<cordinates.length; u++) { 
              console.log(cordinates[u][0]);
            }
            places = ['Location 1','Location 2','Location 3'];
            contentString = [
                '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-1.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">NKD Pizza Motor City</h4><p>Shop 1, Kojak Bldg, Motor City - Dubai</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  10:30AMâ€“2AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>04 421 3734<span/></a></li></ul></div><div class="tail-wrapper"></div></div>',

                '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-2.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">Dubai Marina</h4><p>G05, West Avenue Bldg, <br>Dubai Marina-Dubai, UAE</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  10:30AMâ€“2AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>04 421 3734<span/></a></li></ul></div><div class="tail-wrapper"></div></div>',

                '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-3.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">Business Bay</h4><p>G02, Bayswater Bldg, <br>Business Bay-Dubai, UAE</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  10:30AMâ€“2AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>04 421 3734<span/></a></li></ul></div><div class="tail-wrapper"></div></div>'
            ];
            
            zoom = 12;      
        }

        $.get('https://mavin360.com/demo/nkd/dev/webservice/getCountryStores/'+country, function(res){
                var stData = JSON.parse(res);
                if(stData.length > 0) {      
                    for(var p=0; p<stData.length; p++) { 
                        var latitude = stData[p].Store.latitude;
                        var longitude = stData[p].Store.longitude;

                        var infoWindowText = '<div class="infoWrapper"><a class="close-btn" id="closeBtn"></><a href="#" class="custom-button"><span>order now</span></a><div class="image-container"><img src="assets/images/pickup-delivery/img-1.jpg" class="img-responsive" alt="Map Image"/></div><div class="content-container"><div class="media"><div class="media-body"><h4 class="media-heading">'+stData[p].Store.store_name+'</h4><p>'+stData[p].Store.store_address+'</p></div><div class="media-right"><a href="#"><img class="media-object" src="assets/images/direction-btn.jpg" alt="Directions"></a></div></div><ul class="list-inline"><li><a><img src="assets/images/time-icon.jpg"/><span>Open now:  11AM - 3AM<span/></a></li><li><a><img src="assets/images/phone-icon.jpg"/><span>'+stData[p].Store.store_phone+'<span/></a></li></ul></div><div class="tail-wrapper"></div></div>';

                            // create a DOM element for the marker
                            var el = document.createElement('div');
                            el.className = 'marker';
                            el.style.backgroundImage = 'url(https://mavin360.com/demo/nkd/web/assets/images/map-marker.png)';
                            el.style.width = '40px';
                            el.style.height = '40px';

                            // create the popup
                            var popup = new mapboxgl.Popup({offset: 25})
                                .setHTML(infoWindowText)

                            // create DOM element for the marker
                            var em = document.createElement('div');
                            em.className = 'popup';

                            // add marker to map
                            new mapboxgl.Marker(el, {offset: [-40 / 2, -40 / 2]})
                                .setLngLat([longitude,latitude])
                                .setPopup(popup)
                                .addTo(mapCanvas);

                        p++;              
                    }

                    if(stData.length > 1) {
                      var locText = ' locations';
                    }else{
                      var locText = ' location';
                    }

                    mapText = 'Currently open at <span>'+stData.length + locText + '</span> <strong>' + country + '</strong>';

                    $('#mapText').html(mapText);
                }   
        });
  });

  }
  
});


