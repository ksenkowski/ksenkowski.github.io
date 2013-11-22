function playSound(audioUrl) {
	console.log($(this));
	$("#playAudio").jPlayer( {
	  ready: function() { // The $.jPlayer.event.ready event
	    $(this).jPlayer("setMedia", { // Set the media
	      mp3: audioUrl
	    }).jPlayer("play"); // Attempt to auto play the media
	  },
	  ended: function() { // The $.jPlayer.event.ended event
	    $(this).jPlayer("play"); // Repeat the media
	  },
	  supplied: "mp3",
		swfPath: "http://www.jplayer.org/2.0.0/js",
		wmode: "window"
	});	
};

$(document).ready(function(){	
	$('.play-mp3').on('click', function(){
		playSound('12358134679101112.mp3');
	});
	
});
