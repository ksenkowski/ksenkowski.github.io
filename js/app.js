if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function (shadows, $, undefined) { 
	'use strict';
	// These are private
	var container, value, data, content, page, target, currentIndex, temporaryValue, randomIndex, list, listItems;
	var h = 0, i = 0, t = 0;
	var array = [];
	var minValue = 0;
	var maxValue = 10;
	var prototcol = '//';
	var host = window.location.host;
	var pathname = window.location.pathname;
	var search = window.location.search;
	var counter = $('.counter');
	var next = $('.next');
	var prev = $('.prev');
	var pageNav = $('.page-nav');
	var jsonProd = 'http://conspiracyofshadows.com/posts.json';
	var jsonLocal = 'posts.json';
	
	
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
			$("img").unveil(200, function() {
			  $(this).load(function() {
			    this.style.opacity = 1;
			  });
			});
			$('main').on('click', '.toggle-font', function(e){
				e.preventDefault();
				data = $(this).attr('data-font');
				target = $(this).attr('data-target');
					shadows.util.toggleFont(data, target);
			});
			shadows.util.sitemap();
		},
		isEmpty: function(item){
			return !$.trim(item.html());
		},
		toggleFont: function(font, element){
			$(element).toggleClass(font);
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
		},
		sitemap: function(){
			$.ajax({
				url: jsonProd,
				data: data
			}).done(function(data){
				content = data.sitemap.posts;
				$.each(content, function(k,v){
					array += '<li><h5><a href="'+
								v.href+'">"'+v.title
								+'</a></h5><small>'+
								v.excerpt
								+'<br/><strong>Category:</strong> <em><a href="/'+
								v.category
								+'.html">'+
								v.category
								+'</a></em></small></li>';
				});
				console.log(data.sitemap.posts);
				$('#sitemap').append(array);
			}).error(function(error){
				console.log(error);
			});
		}
	};
	shadows.pagination = {
		init: function(){			
		
		},
		goGet: function(){
			return i;
		},
		goSet: function(val){
			i = val;
		},
		setBorders: function(min, max){
			minValue = min;
			maxValue = max;
		},
		plus: function(){
			page = (i < maxValue) ? ++i : i = minValue;
			counter.html(page);
			setHash(page);
			show(page);
			activeState(page);
		},
		minus: function(){
			page = (i < minValue) ? --i : i = maxValue;
			counter.html(page);
			setHash(page);
			show(page);
			activeState(page);
		},
		setHash: function(hash){
			window.location = protocol + host + pathname + search + '#' + hash;
		},
		getHash: function(){
			return window.location.hash.replace('#', '');
		},
		nav: function(){
			list = '#pager';
			listItems = '';
			
			for(i = 1; i <= maxValue; i +=1){
				listItems += '<li><a href="#"' + i + '">' + i + '</a></li>';
			}
			$(listItems).appendTo($(list).appendTo(counter));
		},
		show: function(page){
			
		},
		initialPage: function(){
			var h = getHash();
			return (h === '') ? initValue : h;
		},
		activeState: function(p){
			
		},
		pageEvent: function(e){
			e.preventDefault();
			page = this.hash.replace('#', '');
			setHash(page);
			gotSet(page);
			counter.html(page);
			show(page);
			activeState(page);
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
						container.append('<li class="tails futhark"><span>'+array[i]+'</span></li>');					
					}
				}
			}
		}
	};
}( window.shadows = window.shadows || {}, jQuery ));