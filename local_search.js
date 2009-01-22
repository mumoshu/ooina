// Ignore "console.log" if Firebug is not running.
if(!(typeof console == "object" && typeof console.firebug != "undefined")) {
    var dummy = function(){};
    console = {log: dummy, debug: dummy};
}

search_spots = function (centerPoint, query, onSearchComplete) {
    var localSearch = new google.search.LocalSearch();
    localSearch.setNoHtmlGeneration();
    localSearch.setResultSetSize(GSearch.LARGE_RESULTSET);
    var spots = [];
    console.debug("query", query);
    localSearch.setSearchCompleteCallback
    (
     null, 
     function () {
	 var cursor = localSearch.cursor;
	 var nextPageIndex;
	 console.debug("localSearch",localSearch);
	 spots = spots.concat(localSearch.results);
	 if (!(cursor && cursor.pages[nextPageIndex = cursor.currentPageIndex + 1])) {
	     console.debug(cursor,nextPageIndex);
	     console.debug("No more search results.");
	     onSearchComplete(centerPoint,spots);
	     return;
	 }
	 localSearch.gotoPage(nextPageIndex);
     }
     );
    localSearch.setCenterPoint(centerPoint);
    localSearch.execute(query);
};

//get_markers = function (spots) {
//    return $(spots).map(function() {
//	    var m = new GMarker(new GLatLng(this.lat, this.lng), {title: this.titleNoFormatting, icon: pinIcon});
//	    console.debug('marker create');
//
//	    return m;
//	});
//};

get_address = function (center, onGet) {
    new GClientGeocoder().getLocations
    (
     center, 
     function(addresses) {
	 console.log("get_address", addresses);
	 if (addresses.Status.code == 200) {
	     onGet(addresses);
	 }
     }
     );
};

get_address_str = function (center, onGet) {
    get_address(center, function(result) {
      console.log("get_address_str", result);
      if (result.Placemark[3]) {
	  onGet(result.Placemark[3].address);
      }
    });
};

get_address_latlng = function (center, onGet) {
    get_address(center, function(result) {
	    console.log("get_address_latlng", result);
	    var coord = result.Placemark[0].Point.coordinates;
	    var lat = coord[1];
	    var lng = coord[0];
	    var latlng = new GLatLng(lat,lng);
	    onGet(latlng);
    });
};

getAnchors = function (bounds, splitter) {
    var lat_span = bounds.toSpan().lat() / splitter;
    var lng_span = bounds.toSpan().lng() / splitter;
    
    var a = new Array();
    for(var j=1; j<=splitter; j++) {
	for(var i=1; i<=splitter; i++) {
	    var lat = bounds.getSouthWest().lat() - (lat_span / 2) + (lat_span * i);
	    var lng = bounds.getSouthWest().lng() - (lng_span / 2) + (lng_span * j);
	    a.push(new GMarker(new GLatLng(lat,lng), {title: "anchor" + i + "-" + j, icon: blackPin}));
	}
    }
    return a;
};
