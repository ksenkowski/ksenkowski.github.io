(function( shadows, $, undefined ) { 
	'use strict';
	var json = $.getJSON('/posts.json', function(){
		shadows.autocomplete.home();
		shadows.articles.pagination();
	});
	// These are private
	var masthead = $('#masthead');
	var container, value, regex, data, content;
	var currentArticle, id, nxt, prv;
	var i = 0;
	var h = 0;
	var t = 0;
	var currentIndex, temporaryValue, randomIndex;
	var search = $('.search');
	var array = [];
	// This will be executed at ready event
	$(document).ready(function() {
		bind(); 
	});
	// private Method 
	// (it doesn't need to be public, since the ready 
	// handler shares the same scope)
	function bind() {
		// Bind jQuery click and page events
		shadows.util.init();
	};
	shadows.util = {
		init: function(){
			$('#throw-stones').on('change', 'select', function(){
				value = $(this).val();
				shadows.runes.throw(value);
			});
			search.on('keyup', function(e){
				value = $(this).val();
				console.log(value);
				shadows.autocomplete.search(value);
			});
			search.on('focus', function(){
				setTimeout(function(){
					shadows.articles.close();					
				}, 250);
			});
			$("img").unveil(200, function() {
			  $(this).load(function() {
			    this.style.opacity = 1;
			  });
			});
			$(window).scroll(function(){
				if ($(this).scrollTop() > 100) {
					$('.to-the-top').fadeIn();
				} else {
					$('.to-the-top').fadeOut();
				}
			});
			$('nav').on('click', 'a', function(e){
				e.preventDefault();
				container = $(this).attr('href');
				$('html,body').animate({scrollTop: $(container).offset().top});
			})
			$('main').on('click','.to-the-top', function(){
				$('html,body').animate({scrollTop: 0});
			});
		},
		isEmpty: function(item){
			return !$.trim(item.html());
		},
		shuffle: function(array){
			currentIndex = array.length, temporaryValue, randomIndex;
			while(0 !== currentIndex){
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		}
	};
	shadows.articles = {
		pagination: function(){
			currentArticle = $('article').attr('data-current');
			data = json.responseJSON;
			console.log(currentArticle);
			$.each(data, function(k,v){
				if(v.href == currentArticle){
					id = v.id;
					}
			});
			$.each(data, function(k,v){
				if(id + 1 == v.id){
					console.log(v.id);	
					nxt = v.href;
				}else if(id - 1 == v.id){
					prv = v.href;
				}
				console.log(nxt+', '+prv);
			})
		}
	};
	shadows.runes = {
		throw: function(value){
			container = $('#rune-stone-results');
			container.empty();
			array = ["F", "U", "W", "A", "R", "K", "X", "V", "H", "N", "I", "J", "Y", "P", "Z", "S", "T", "B", "E", "M", "L", "Q", "O", "D", "The Black Stone"];
			array = shadows.util.shuffle(array)
			value = parseInt(value);
			array = array.slice(0,value);
			
			for(i = 0; i < array.length; i++){
				content = Math.floor(Math.random(2) * 2);
				if(content == 1){
					if(array[i] == 'The Black Stone'){
						container.append('<li class="blackstone"></li>');
					}else{
						container.append('<li class="futhark"><span>'+array[i]+'</span></li>');
					}
					h = h + 1;
				}else{
					t = t + 1;
					if(array[i] == 'The Black Stone'){
						container.append('<li class="blackstone"></li>');
					}else{
						container.append('<li class="tails"></li>');					
					}
				}
			}
		}
	};
	shadows.autocomplete = {
		search: function(value){
			container = $('#results ul');
			data = json.responseJSON;
			container.empty();
				$.each(data, function(k,v){
					regex = new RegExp(value, 'i');
					if(v.tag.search(regex) != -1){
						content = '<li><a class="" href="'
						+v.href+
						'"><h3>'
						+v.title+
						'</h3><p>'
						+v.excerpt+
						'</p><p class="text-uppercase small"><strong>Categories:</strong> '
						+v.tag+
						'</p></a></li>';
						container.append(content);				
					}
				});
				if(value.length >= 1){
					container.parent().addClass('show');
				}else{
					container.parent().removeClass('show');
				}
		},
		home: function(){
			container = $('.archive section');
			data = json.responseJSON;
			data = shadows.util.shuffle(data);
			$.each(data, function(k,v){
				if(v.title != null || typeof v.title != 'undefined'){
					array += '<li class="tags" data-tags="'+v.tag+'"><h3><a href="'+v.href+'">'+v.title+'</a></h3></li> ';
				}
			});
			container.append('<ul id="all-titles" class="unstyled inline text-center">'+array+'</ul>');
		}
	};
}( window.shadows = window.shadows || {}, jQuery ));