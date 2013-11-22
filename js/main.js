$(document).ready(function() {
  		MBP.scaleFix();
		MBP.hideUrlBar();
		whatPage();
		//MENU
		$('#menu-button').pageslide({direction: 'left'});
		$('#menu').on('click', '.table-of-contents a', function(e){
			e.preventDefault();
			$('.hidden-menu-item').toggle();
			$(this).toggleClass('red');
		});
		
		//OPEN FOOTNOTE
		$('#content').on('click', '.footnote', function(){
			var footnote = $(this).attr('data-note');
			var destination;
			if($(this).parent().parent('article').siblings().is(':visible')){
				destination = $('#footnotes');
			}else{
				destination = $('#mobile-footnotes');
			}
			createFootnotes(footnote, destination);
		});
		
		//CLOSE FOOTNOTE
		$('aside').on('click', '.close-me', function(){
			$(this).parent().remove();
			var position = $('article.first').position().top;
			$('html,body').animate({scrollTop: position});
		});


		//RESPONSIVE TABLES
	 var switched = false;
	  var updateTables = function() {
	    if (($(window).width() < 767) && !switched ){
	      switched = true;
	      $("table.responsive").each(function(i, element) {
	        splitTable($(element));
	      });
	      return true;
	    }
	    else if (switched && ($(window).width() > 767)) {
	      switched = false;
	      $("table.responsive").each(function(i, element) {
	        unsplitTable($(element));
	      });
	    }
	  };

	  $(window).load(updateTables);
	  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
	  $(window).on("resize", updateTables);


		function splitTable(original){
			original.wrap("<div class='table-wrapper' />");

			var copy = original.clone();
			copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
			copy.removeClass("responsive");

			original.closest(".table-wrapper").append(copy);
			copy.wrap("<div class='pinned' />");
			original.wrap("<div class='scrollable' />");

	    setCellHeights(original, copy);
		}

		function unsplitTable(original) {
	    original.closest(".table-wrapper").find(".pinned").remove();
	    original.unwrap();
	    original.unwrap();
		}

	  function setCellHeights(original, copy) {
	    var tr = original.find('tr'),
	        tr_copy = copy.find('tr'),
	        heights = [];

	    tr.each(function (index) {
	      var self = $(this),
	          tx = self.find('th, td');

	      tx.each(function () {
	        var height = $(this).outerHeight(true);
	        heights[index] = heights[index] || 0;
	        if (height > heights[index]) heights[index] = height;
	      });

	    });

	    tr_copy.each(function (index) {
	      $(this).height(heights[index]);
	    });
	  }
		
});
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement , fromIndex) {
    var i,
       	pivot = (fromIndex) ? fromIndex : 0,
        length;
    if (!this) {
      throw new TypeError();
    }

    length = this.length;

    if (length === 0 || pivot >= length) {
      return -1;
    }

    if (pivot < 0) {
      pivot = length - Math.abs(pivot);
    }

    for (i = pivot; i < length; i++) {
      if (this[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
}

var timeLine = function timeLineF(json, location){
	$.getJSON(json,
		function(data){
			var evens = [], odds = [];
			var leftOpen = '<div class="row clearfix"><div class="left-column"><span class="date left">';
			var leftMiddle = '</span></div><div class="right-column"><div class="text"><h3>';
			var closeText = '</h3><p>';
			var leftClose = '</p></div></div></div>';
			var rightOpen = '<div class="row clearfix"><div class="left-column"><div class="text"><h3>';
			var rightMiddle = '</p></div></div><div class="right-column"><span class="date left">';
			var rightClose = '</span></div></div>';
			$.each(data.events, function(key, value){
				if(key % 2 == 0){
					evens.push(leftOpen + value.date + leftMiddle + value.title + closeText + value.subtitle + leftClose);
				}else{
					odds.push(rightOpen + value.title + closeText + value.subtitle + rightMiddle + value.date + rightClose);
				}
			});
			var combined = zipTogether(evens, odds);
			$(location).html(combined);
		}
	);
};

var zipTogether = function zipTogetherF() {
   var merged = [], index = 0, cont, i;
   do {
      cont = false;
      for (var i=0; i<arguments.length; i++) {
         A = arguments[i];
         if (index < A.length) {   
            cont = true;
            merged.push(A[index]);
         }
      }
      index++;
   } while (cont);
   return merged;
};
var createFootnotes = function createFootnotesF(footnote, destination){
		var note = '<div class="footnote-callout" data-note="'+footnote+'"><div class="close-me">x</div>';
		$.getJSON('data/footnotes.json',
			function(data){
				$.each(data.footnotes, function(key, value){

					if(footnote == value.note){
						note += value.details;
					}
				});
				note += '</div>';
				var position = destination.position().top;
				destination.html(note);
				$('html, body').animate({scrollTop: position});
		});
};

var whatPage = function whatPageF(){
	var fullURL = window.location.pathname;
	var menuItem = $('body').attr('data-menu');
	$('#menu li[data-menu="'+menuItem+'"]').addClass('current');
	if(fullURL.indexOf('tapestry') > -1 || fullURL.indexOf('dooms') > -1){
		$('.cover-image').css('background-image','url(/img/backgrounds/card-back.jpg)');
	}else if(fullURL.indexOf('credits') > -1){
		$('.cover-image').css('background-image','url(/img/backgrounds/trapped.jpg)');
	}
};