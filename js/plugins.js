// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}
$(function() {
	$('footer').on('click', 'nav a.open', function(e){
		e.preventDefault();
		var id = '.' + $(this).attr('data-container');
		var container = $('#menuContainer');
		if(container.height()<=0) {
				container.animate({
					height: '200px'});
				container.children().children().css('padding', '1.5em');	
				$(id).css({display: 'block'});
				$(id).siblings().css({display: 'none'});				
		}else{
			if($(id).is(':visible')){
				container.animate({
					height: '0px'}, function(){
						container.children().children().css('padding', '0px');
						
					});
			}else{
				$(id).css({display: 'block'});
				$(id).siblings().css({display: 'none'});
				
			}
		}
	});
	$('main').on('click', function(e){
		var container = $('#menuContainer');
		if(container.height()=== 200) {
			container.animate({
				height: '0px',
				padding: '0px'});
		}
	});
});
$( function(){
    var targets = $('[rel~=tooltip]'),
        target  = false,
        tooltip = false,
        title   = false;
 
    targets.on('mouseenter', function(){
		target = $( this );
        tip = target.attr('title');
        tooltip = $( '<div id="tooltip"></div>' );
 
        if(!tip || tip == ''){
            return false;
		}
 
        target.removeAttr('title');
        tooltip.css('opacity', 0).html(tip).appendTo('body');
 
        var init_tooltip = function(){
            if( $( window ).width() < tooltip.outerWidth() * 1.5 ){
                tooltip.css('max-width', $( window ).width() / 2 );
			}else{
                tooltip.css('max-width', 340 );
			}
 
            var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;
 
            if( pos_left < 0 ){
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            }else{
                tooltip.removeClass( 'left' );
			}
			if( pos_left + tooltip.outerWidth() > $( window ).width() ){
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            }else{
                tooltip.removeClass( 'right' );
			}
 
            if( pos_top < 0 ){
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }else{
                tooltip.removeClass( 'top' );	
			}
 
            tooltip.css( { left: pos_left, top: pos_top } ).animate( { top: '+=10', opacity: 1 }, 50 );
        };
 
        init_tooltip();
        $( window ).resize( init_tooltip );
 
        var remove_tooltip = function(){
            tooltip.animate( { top: '-=10', opacity: 0 }, 50, function(){
                $( this ).remove();
            });
			target.attr( 'title', tip );
        };
 
        target.on( 'mouseleave', remove_tooltip );
        tooltip.on( 'click', remove_tooltip );
    });
});

$( function(){
	var throwStones = function throwStonesF(number) {
		$('#rune-stone-results').empty();
		var arr = [ ];
		arr = ["F", "U", "W", "A", "R", "K", "X", "V", "H", "N", "I", "J", "Y", "P", "Z", "S", "T", "B", "E", "M", "L", "Q", "O", "D", "The Black Stone"];

	    var shuffled = arr.slice(0), i = arr.length, temp, index;
	    while (i--) {
	        index = Math.floor(i * Math.random());
	        temp = shuffled[index];
	        shuffled[index] = shuffled[i];
	        shuffled[i] = temp;
	    }
		var value = parseInt(number);
		shuffled =  shuffled.slice(0,value);
		var h = 0, t = 0;
		for(i = 0; i < shuffled.length; i++){

			var headTail = Math.floor(Math.random(2) * 2);
			if(headTail == 1){
				if(shuffled[i] == "The Black Stone"){
					$('#rune-stone-results').append('<li class="black-stone"></li>');
				}else{
					$('#rune-stone-results').append('<li class="futhark"><span>' + shuffled[i] + '</span></li>');
				}
				h = h + 1;
			}else{
				t = t + 1;
				if(shuffled[i] == "The Black Stone"){
					$('#rune-stone-results').append('<li class="black-stone"></li>');
				}else{
					$('#rune-stone-results').append('<li class="tails">' + shuffled[i] + '</li>');
				}
			} 
		}
	};
	$('#throw-stones').on('click', function(){
		var number = $('#number-of-stones').val();
		throwStones(number);
	});

});