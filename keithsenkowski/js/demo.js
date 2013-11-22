$(document).ready(function () {
    flipper('.one');
});

var flipper = function flipperF(current) {
    var current = $(current);
    var nextItem = current.next();
    var margin = $(current).height() / 2;
    var height = $(current).height();
    var width = $(current).width();
    $(current).animate({
        height: '0px',
        width: width + 'px',
        marginTop: margin + 'px',
     	}, 500, function () {
        	if ($(nextItem).length > 0) {
            	flipper(nextItem);
        	};
    });
};

function success(position) {
  var s = document.querySelector('#status');
  
  if (s.className == 'success') {
    // not sure why we're hitting this twice in FF, I think it's to do with a cached result coming back    
    return;
  }
  
  s.innerHTML = "found you!";
  s.className = 'success';
  
  
	var stuff = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=false';
	$.getJSON(stuff, 
		function(data){
			//console.log(data);
			
		}
		);
	
 }

function error(msg) {
  var s = document.querySelector('#status');
  s.innerHTML = typeof msg == 'string' ? msg : "failed";
  s.className = 'fail';
  
  // console.log(arguments);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}
