// Icons

var pinIcon = new GIcon();
pinIcon.image  = "mm_20_orange.png";
pinIcon.shadow = "mm_20_shadow.png";
pinIcon.iconSize   = new GSize(12, 20);
pinIcon.shadowSize = new GSize(22, 20);
pinIcon.iconAnchor = new GPoint(6, 20);
pinIcon.infoWindowAnchor = new GPoint(5, 1);

var blackPin = new GIcon();
blackPin.image  = "mm_20_black.png";
blackPin.shadow = "mm_20_shadow.png";
blackPin.iconSize   = new GSize(12, 20);
blackPin.shadowSize = new GSize(22, 20);
blackPin.iconAnchor = new GPoint(6, 20);
blackPin.infoWindowAnchor = new GPoint(5, 1);

// Initializations

google.load("search", "1");

function load() {
    //local search configurations
    //    localSearch = new google.search.LocalSearch();

    //map configurations
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map"));
        map.addControl(new GLargeMapControl());
        //map.setCenter(new GLatLng(37.4419, -122.1419), 13);
	map.setCenter(new GLatLng(35.616955, 139.7080794), 13);
        //get_address_latlng("品川区大崎", function (latlng) {
        //  map.setCenter(latlng, 13);
        //});
        
    }
    onSubmit = function () {
	console.log("query: " + $("#keyword").get(0).value);
	var anchors = getAnchors(map.getBounds(), parseInt($("#accuracy").get(0).value));
	var areas = {};
	var uniq_spots = new Array();

	var proc_anchor = function(anchors,i) {
	    if(i + 1 >= anchors.length) {
		return;
	    }
	    var anchor = anchors[i];
	    get_address_str(
			    anchor.getLatLng(),
			    function (address) {
				// 
				search_spots
				(
				 address,
				 $("#keyword").get(0).value,
				 function(address,spots) {
				     //			     map.addOverlay(anchor);
				     $("#stat").get(0).innerHTML += "<div>" + address + ": " + spots.length  + "</div>";
				     console.log("onSubmit: spots: ", spots);
				     $(spots).each(function() {
					     if(!uniq_spots[this.titleNoFormatting]) {
						 uniq_spots[this.titleNoFormatting] = this;
						 var m = new GMarker(new GLatLng(this.lat, this.lng), {title: this.titleNoFormatting, icon: pinIcon});
						 var spot = this;
						 GEvent.addListener(m, 'click', function() {
							 console.debug('click');
							 this.openInfoWindowHtml('<a href="' + spot.url + '">' + spot.title + '</a>');
						     });
						 map.addOverlay(m);
					     }
					 });
				     proc_anchor(anchors, i + 1);
				 }
				 );
				//
			    });
	};
	proc_anchor(anchors,0);
    };

    onGoButtonClick = function () {
        var address = $("#address").get(0).value;
        console.log(address);
        get_address_latlng(
			   address,
			   function (result) {
			       console.log("onGoButtonClick",result);
			       map.setCenter(result);
			   }
			   );
    };
    GEvent.addListener(map, 'moveend', function() {
	    get_address_str(
			map.getCenter(),
			function (result) {
			    $("#address").get(0).value = result;
			}
			);
	});
}
