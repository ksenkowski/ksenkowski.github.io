if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( shadows, $, undefined ) { 
	'use strict';
	var json = $.getJSON('/posts.json', function(){
		shadows.autocomplete.home();
	});
	// These are private
	var masthead = $('#masthead');
	var container, value, regex, data, content, target, top;
	var currentArticle, id, nxt, prv, tocTitle, tocChild;
	var i = 0;
	var h = 0;
	var t = 0;
	var o = 0;
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
		shadows.accordion.init('#toc');
		$('#transition').transitions({
			navigation: true,
			slideSpeed: 300,
			paginationSpeed: 400,
			pagination : true,
			singleItem: true,
			paginationNumbers: true,
			autoHeight: true
		});
	};
	shadows.util = {
		init: function(){
			$('#throw-stones').on('change', 'select', function(){
				value = $(this).val();
				shadows.runes.throw(value);
			});
			search.on('keyup', function(e){
				value = $(this).val();
				shadows.autocomplete.search(value);
			});
			search.on('focus', function(){
				setTimeout(function(){
			//		shadows.articles.close();					
				}, 250);
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
		}
	};
	shadows.accordion = {
		init: function(element){
			$('.toc').on('click', 'a', function(e){
				e.preventDefault();
				container = $(this).attr('href');
				top = $(container).offset().top - 48;
				$('html,body').animate({scrollTop: top});
				element = $(this).parent('li');
				shadows.accordion.open(element);
				if(!$(this).parent().hasClass('parent')){
					$('#toc h4').trigger('click');					
				}
			});
			tocTitle = $('.parent');
			tocChild = $('.child');
			tocTitle.each(function(){
				i++;
				$(this).addClass('element-'+i);
			});
			tocChild.each(function(){
				o++;
				$(this).addClass('element-'+o);
			});
			$('.parent.element-1').addClass('open');
			$('#toc').on('click', 'h4', function(){
				var toc = $('.toc');
				if(toc.hasClass('is-visible')){
					$('.toc').removeClass('is-visible');					
					$(this).children('.toggle').removeClass('close').addClass('open');
				}else{
					$('.toc').addClass('is-visible');					
					$(this).children('.toggle').removeClass('open').addClass('close');					
				}
			});
		},
		open: function(element){
			tocChild = element.children('.child');			
			if(tocChild.is(':hidden')){
				$('.parent').removeClass('open');
				element.addClass('open');			
			}
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
	shadows.articles = {
		/* A modification of jQuery OwlCarousel v1.3.3
		 *
		 *  Copyright (c) 2013 Bartosz Wojciechowski
		 *  http://www.owlgraphic.com/owlcarousel/
		 *
		 *  Licensed under MIT
		 *
		 */
		init: function(options, element){
			var article = this;
			
			article.element = $(element);
			article.options = $.extend({}, $.fn.transitions.options, article.element.data(), options);
			
			article.userOptions = options;
			article.loadContent();
		},
		
		loadContent: function(){
			var article = this;
			
			article.element.data('transition-originalStyles', article.element.attr('style'));
			article.element.data('transition-originalClasses', article.element.attr('class'));
			
			article.element.css('opacity', 0);
			article.originalItems = article.options.items;
			article.checkBrowser();
			article.wrapperWidth = 0;
			article.checkVisible = null;
			article.setVars();
		},
		
		setVars: function(){
			var article = this;
			
			if(article.element.children().length === 0){
				return false;
			}
			
			article.baseClass();
			article.eventTypes();
			article.userItems = article.element.children();
			article.itemsAmount = article.userItems.length;
			article.wrapItems();
			article.transitionItems = article.element.find('.transition-item');
			article.transitionWrapper = article.element.find('.transition-wrapper');
			article.playDirection = 'next';
			article.prevItem = 0;
			article.prevArr = [0];
			article.currentItem = 0;
			article.customEvents();
			article.onStartup();
		},
		
		onStartup: function(){
			var article = this;
			
			article.updateItems();
			article.calculateAll();
			article.buildControls();
			article.updateControls();
			article.response();
			article.moveEvents();
			article.moveEvents();
			article.transitionStatus();
			
			if(article.options.transitionStyle !== false){
				article.transitionTypes(article.options.transitionStyle);
			}

			article.element.find('.transition-wrapper').css('display', 'block');
			
			if(!article.element.is(':visible')){
				article.watchVisibility();
			}else{
				article.element.css('opacity', 1);
			}
			article.onstartup = false;
			article.eachMoveUpdate();
			
			if(typeof article.options.afterInit === 'function'){
				article.options.afterInit.apply(this, [article.element]);
			}
		},
		
		eachMoveUpdate: function(){
			var article = this;
			
			if(article.options.lazyLoad === true){
				article.lazyLoad();
			}
			if(article.options.autoHeight === true){
				article.autoHeight();
			}
			
			article.onVisibleItems();
			
			if(typeof article.options.afterAction === 'function'){
				article.options.afterAction.apply(this, [article.element]);
			}
		},
		
		updateVars: function(){
			var article = this;
			
			if(typeof article.options.beforeUpdate === 'function'){
				article.options.beforeUpdate.apply(this, [article.element]);
			}
			
			article.watchVisibility();
			article.updateItems();
			article.calculateAll();
			article.updatePosition();
			article.updateControls();
			article.eachMoveUpdate();
			
			if(typeof article.options.afterUpdate === 'function'){
				article.options.afterUpdate.apply(this, [article.element]);
			}
		},
		
		reload: function(){
			var article = this;
			
			window.setTimeout(function(){
				article.updateVars();
			}, 0);
		},
		
		watchVisibility: function(){
			var article = this;
			
			if(article.element.is(':visible') === false){
				article.element.css('opacity',0);
				window.clearInterval(article.checkVisible);
			}else{
				return false;
			}
			
			article.checkVisible = window.setInterval(function(){
				if(article.element.is(':visible')){
					article.reload();
					article.element.animate({
						opacity: 1
					}, 200);
					window.clearInterval(article.checkVisible);
				}
			}, 500);
		},
		
		wrapItems: function(){
			var article = this;
			
			article.userItems.wrapAll('<div class="transition-wrapper">').wrap('<div class="transition-item"></div>');
			article.element.find('.transition-wrapper').wrap('<div class="transition-outer-wrapper">');
			article.wrapperOuter = article.element.find('.transition-outer-wrapper');
			article.element.css('display', 'block');
		},
		
		baseClass: function(){
			var article = this,
				hasBaseClass = article.element.hasClass(article.options.baseClass),
				hasThemeClass = article.element.hasClass(article.options.theme);
			
			if(!hasBaseClass){
				article.element.addClass(article.options.baseClass);
			}
			
			if(!hasThemeClass){
				article.element.addClass(article.options.theme);
			}
		},
		
		updateItems: function(){
			var article = this, width, i;
			
			if(article.options.responsive === false){
				return false;
			}
			
			if(article.options.singleItem === true){
				article.options.items = article.originalItems = 1;
				article.options.itemsCustom = false;
				article.options.itemsDesktop = false;
				article.options.itemsDesktopSmall = false;
				article.options.itemsTablet = false;
				article.options.itemsTabletSmall = false;
				article.options.itemsMobile = false;
				return false;
			}
			
			width = $(article.options.responsiveBaseWidth).width();
			
			if(width > (article.options.itemsDesktop[0] || article.orignalItems)){
				article.options.items = article.originalItems;
			}
			if(article.options.itemsCustom !== false){
				article.options.itemsCustom.sort(function(a,b){
					return a[0] - b[0];
				});
				
				for(i = 0; i < article.options.itemsCustom.length; i += 1){
					if(article.options.itemsCustom[i][0] <= width){
						article.options.items = article.options.itemsCustom[i][1];
					}
				}
			}else{
				if(width <= article.options.itemsDesktop[0] && article.options.itemsDesktop !== false){
					article.options.items = article.options.itemsDesktop[1];
				}
				
				if(width <= article.options.itemsDesktopSmall[0] && article.options.itemsDesktopSmall !== false){
					article.options.items = article.options.itemsDesktopSmall[1];
				}
				
                if(width <= article.options.itemsTablet[0] && article.options.itemsTablet !== false){
                    article.options.items = article.options.itemsTablet[1];
                }

                if(width <= article.options.itemsTabletSmall[0] && article.options.itemsTabletSmall !== false){
                    article.options.items = article.options.itemsTabletSmall[1];
                }

                if(width <= article.options.itemsMobile[0] && article.options.itemsMobile !== false){
                    article.options.items = article.options.itemsMobile[1];
                }
			}
            if(article.options.items > article.itemsAmount && article.options.itemsScaleUp === true){
                article.options.items = article.itemsAmount;
            }
		},
		
		response: function(){
			var article = this,
				smallDelay,
				lastWindowWidth;
				
			if(article.options.responsive !== true){
				return false;
			}
			
			lastWindowWidth = $(window).width();
			
			article.resizer = function(){
				if($(window).width() !== lastWindowWidth){
					window.clearTimeout(smallDelay);
					smallDelay = window.setTimeout(function(){
						lastWindowWidth = $(window).width();
						article.updateVars();
					}, article.options.responsiveRefreshRate);
				}
			};
			$(window).resize(article.resizer);
		},
		//REMOVE ME
		updatePosition: function(){
			var article = this;
			
			article.jumpTo(article.currentItem);
		},
		
		appendItemsSizes: function(){
			var article = this,
				roundPages = 0,
				lastItem = article.itemsAmount - article.options.items;
				
			article.transitionItems.each(function(index){
				var me = $(this);
				
				me.css('width', article.itemWidth).data('transition-item', Number(index));
				
				if(index % article.options.items === 0 || index === lastItem){
					if(!(index > lastItem)){
						roundPages += 1;
					}
				}
				me.data('transition-roundPages', roundPages);
			});
		},
		
		appendWrapperSizes: function(){
			var article = this,
				width = article.transitionItems.length * article.itemWidth;
			
			article.transitionWrapper.css({
				'width': width * 2,
				'left': 0
			});
			article.appendItemsSizes();
		},
		
		calculateAll: function(){
			var article = this;
			
			article.calculateWidth();
			article.appendWrapperSizes();
			article.loops();
			article.max();
		},
		
		calculateWidth: function(){
			var article = this;
			
			article.itemWidth = Math.round(article.element.width() / article.options.items);
		},

		max: function(){
			var article = this,
				maximum = ((article.itemsAmount * article.itemWidth) - article.options.items * article.itemWidth) * -1;
			
				if(article.options.items > article.itemsAmount){
					article.maximumItem = 0;
					maximum = 0;
					article.maximumPixels = 0;
				}else{
					article.maximumItem = article.itemsAmount - article.options.items;
					article.maximumPixels = maximum;
				}
				return maximum;
		},

		min: function(){
			return 0;
		},

		loops: function(){
			var article = this,
				prev = 0,
				elementWidth = 0,
				i, item, roundPageNum;
				
			article.positionsInArray = [0];
			article.pagesInArray = [];
			
			for(i = 0; i < article.itemsAmount; i += 1){
				elementWidth += article.itemWidth;
				article.positionsInArray.push(-elementWidth);
				
				if(article.options.scrollPerPage === true){
					item = $(article.transitionItems[i]);
					roundPageNum = item.data('transition-roundPages');
					if(roundPageNum !== prev){
						article.pagesInArray[prev] = article.positionsInArray[i];
						prev = roundPageNum;
					}
				}
			}	
		},

		buildControls: function(){
			var article = this;
				
			if(article.options.navigation === true || article.options.pagination == true){
				article.Controls = $('<div class="transition-controls">').toggleClass('clickable', !article.browser.isTouch).prependTo(article.element);
			}
			
			if(article.options.pagination == true){
				article.buildPagination();
			}
			
			if(article.options.navigation == true){
				article.buildButtons();
			}
		},

		buildButtons: function(){
			var article = this,
				buttonsWrapper = $('<div class="transition-buttons">');
			
			article.Controls.append(buttonsWrapper);
			
			article.buttonPrev = $('<div/>', {
				'class': 'transition-prev',
				'html': article.options.navigationText[0] || ''
			});
			
			article.buttonNext = $('<div/>', {
				'class': 'transition-next',
				'html': article.options.navigationText[1] || ''
			});
			
			buttonsWrapper.append(article.buttonPrev).append(article.buttonNext);
			
			buttonsWrapper.on('touchstart.Controls mousedown.Controls', 'div[class^="transition"]', function(e){
				e.preventDefault();
			});
			
			buttonsWrapper.on('touchend.Controls mouseup.Controls', 'div[class^="transition"]', function(e){
				e.preventDefault();
				if($(this).hasClass('transition-next')){
					article.next();
				}else{
					article.prev();
				}
			});
		},

		buildPagination: function(){
			var article = this;
			
			article.paginationWrapper = $('<div class="transition-pagination"/>');
			article.Controls.append(article.paginationWrapper);
			article.Controls.on('touchend mouseup', '.transition-pagination', function(e){
				e.preventDefault();
				$(this).toggleClass('revealed');
			});
			article.paginationWrapper.on('touchend.Controls mouseup.Controls', '.transition-page', function(e){
				e.preventDefault();
				if(Number($(this).data('transition-page')) !== article.currentItem){
					article.goTo(Number($(this).data('transition-page')), true);
				}
			});
		},

		updatePagination: function(){
			var article = this, counter, lastPage, lastItem, i, paginationButton, paginationButtonInner, nav;
			
			if(article.options.pagination === false){
				return false;
			}
			
			article.paginationWrapper.html('');
			
			counter = 0;
			lastPage = article.itemsAmount - article.itemsAmount % article.options.items;
			
			for(i = 0; i < article.itemsAmount; i+= 1){
				if(i % article.options.items == 0){
					counter += 1;
					nav = article.userItems.data('nav');
					
					if(lastPage === i){
						lastItem = article.itemsAmount - article.options.items;
					}
					
					paginationButton = $('<div/>', {
						'class': 'transition-page'
					});
					
					paginationButtonInner = $('<span></span>', {
						'text': article.options.paginationNumbers === true ? article.userItems[i].dataset.nav : '',
						'class': article.options.paginationNumbers === true ? 'transition-numbers' : ''
					});
					
					paginationButton.append(paginationButtonInner);
					
					paginationButton.data('transition-page', lastPage === i ? lastItem : i);
					paginationButton.data('transition-roundPages', counter);
					
					article.paginationWrapper.append(paginationButton);
				}
			}
			article.checkPagination();
		},

		checkPagination: function(){
			var article = this;
			
			if(article.options.pagination === false){
				return false;
			}
			
			article.paginationWrapper.find('.transition-page').each(function (){
				if($(this).data('transition-roundPages') === $(article.transitionItems[article.currentItem]).data('roundPages')){
					article.paginationWrapper.find('.transition-page').removeClass('active');
					$(this).addClass('active');
				}
			});
		},

		checkNavigation: function(){
			var article = this;
			
			if(article.options.navigation === false){
				return false;
			}
			
			if(article.options.rewindNav === false){
				if(article.currentItem === 0 && article.maximumItem === 0){
					article.buttonPrev.addClass('disabled');
					article.buttonNext.addClass('disabled');
				}else if(article.currentItem === 0 && article.maximumItem !== 0){
					article.buttonPrev.addClass('disabled');
					article.buttonNext.removeClass('disabled');					
				}else if(article.currentItem === article.maximumItem){
					article.buttonPrev.removeClass('disabled');
					article.buttonNext.addClass('disabled');
				}else if(article.currentItem !== 0 && article.currentItem !== articel.maximumItem){
					article.buttonPrev.removeClass('disabled');
					article.buttonNext.removeClass('disabled');
				}				
			}
		},

		updateControls: function(){
			var article = this;
			
			article.updatePagination();
			article.checkNavigation();
			if(article.Controls){
				if(article.options.items >= article.itemsAmount){
					article.Controls.hide();
				}else{
					article.Controls.show();
				}
			}
		},

		destroyControls: function(){
			var article = this;
			if(article.Controls){
				article.Controls.remove();
			}
		},

		next: function(speed){
			var article = this;
			if(article.isTransition){
				return false;
			}
			
			article.currentItem +=article.options.scrollPerPage === true ? article.options.items : 1;
			
			if(article.currentItem > article.maximumItem + (article.options.scrollPerPage === true ? (article.options.items -1) : 0)){
				if(article.options.rewindNav === true){
					article.currentItem = 0;
					speed = 'rewind';
				}else{
					article.currentItem = article.maximumItem;
					return false;
				}
			}
			article.goTo(article.currentItem, speed);
		},

		prev: function(speed){
			var article = this;
			
			if(article.isTransition){
				return false;
			}
			
			if(article.options.scrollPerPage === true && article.curentItem > 0 && article.currentItem < article.options.items){
				article.currentItem = 0;
			}else{
				article.currentItem -= article.options.scrollPerPage === true ? article.options.items :1;
			}
			if(article.currentItem < 0){
				if(article.options.rewindNav === true){
					article.currentItem = article.maximumItem;
					speed = 'rewind';
				}else{
					article.currentItem = 0;
					return false;
				}
			}
			article.goTo(article.currentItem, speed);
		},

		goTo: function(position, speed, drag){
			var article = this,
				goToPixel;
			
			if(article.isTransition){
				return false;
			}
			if(typeof article.options.beforeMove === 'function'){
				article.options.beforeMove.apply(this, [article.element]);
			}
			if(position >= article.maximumItem){
				position = article.maximumItem;
			}else if(position <= 0){
				position = 0;
			}
			
			article.currentItem = article.transition.currentItem = position;
			
			if(article.options.transitionStyle !== false && drag !== article.options.items === 1 & article.browser.support3d === true){
				article.swapSpeed(0);
				if(article.browser.support3d === true){
					article.transition3d(article.positionsInArray[position]);
				}else{
					article.css2slide(article.positionsInArray[position], -1);
				}
				article.afterGo();
				article.singleItemTransition();
				return false;
			}
			
			goToPixel = article.positionsInArray[position];
			
			if(article.browser.support3d === true){
				article.isCss3Finish = false;
				
				if(speed === true){
					article.swapSpeed('paginationSpeed');
					window.setTimeout(function (){
						article.isCss3Finish = true;
					}, article.options.paginationSpeed);
				}else if(speed === 'rewind'){
					article.swapSpeed(article.options.rewindSpeed);
					window.setTimeout(function(){
						article.isCss3Finish = true;
					}, article.options.rewindSpeed);
				}else{
					article.swapSpeed('slideSpeed');
					window.setTimeout(function(){
						article.isCss3Finish = true;
					}, article.options.slideSpeed);
				}
				article.transition3d(goToPixel);
			}else{
				if(speed === true){
					article.css2slide(goToPixel, article.options.paginationSpeed);
				}else if(speed === 'rewind'){
					article.css2slide(goToPixel, article.options.rewindSpeed);
				}else{
					article.css2slide(goToPixel, article.options.slideSpeed);
				}
			}
			article.afterGo();
		},

		jumpTo: function(position){
			var article = this,
				goToPixel;
				
			if(typeof article.options.beforeMove === 'function'){
				article.options.beforeMove.apply(this, [article.element]);
			}
			if(position >= article.maximumItem || position === -1){
				position = article.maximumItem;
			}else if(position <= 0){
				position = 0;
			}
			
			article.swapSpeed(0);
			
			if(article.browser.support3d === true){
				article.transition3d(article.positionsInArray[position]);
			}else{
				article.css2slide(article.positionsInArray[position], 1);
			}
			article.currentItem = article.transition.currentItem = position;
			article.afterGo();
		},

		afterGo: function(){
			var article = this;
			
			article.prevArr.push(article.currentItem);
			article.prevItem = article.transition.prevItem = article.prevArr[article.prevArr.length - 2];
			article.prevArr.shift(0);
			
			if(article.prevItem !== article.currentItem){
				article.checkPagination();
				article.checkNavigation();
				article.eachMoveUpdate();
			}
			if(typeof article.options.afterMove === 'function' && article.prevItem !== article.currentItem){
				article.options.afterMove.apply(this, [article.element]);
			}
		},

		stop: function(){
			var article = this;
			article.apStatus = 'stop';
		},

		swapSpeed: function(action){
			var article = this;
			
			if(action === 'slideSpeed'){
				article.transitionWrapper.css(article.addCssSpeed(article.options.slideSpeed));
			}else if(action === 'paginationSpeed'){
				article.transitionWrapper.css(article.addCssSpeed(article.options.paginationSpeed));
			}else if(typeof action !== 'string'){
				article.transitionWrapper.css(article.addCssSpeed(action));
			}
		},

		addCssSpeed: function(speed){
			return{
                '-webkit-transition': 'all ' + speed + 'ms ease',
                '-moz-transition': 'all ' + speed + 'ms ease',
                '-o-transition': 'all ' + speed + 'ms ease',
                'transition': 'all ' + speed + 'ms ease'	
			};
		},

		removeTransition: function(){
            return {
                '-webkit-transition': '',
                '-moz-transition': '',
                '-o-transition': '',
                'transition': ''
            };
		},

		doTranslate: function(pixels){
            return {
                '-webkit-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                '-moz-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                '-o-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                '-ms-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                'transform': 'translate3d(' + pixels + 'px, 0px,0px)'
            };
		},

		transition3d: function(value){
			var article = this;
			article.transitionWrapper.css(article.doTranslate(value));
		},

		css2move: function(value){
			var article = this;
			article.transitionWrapper.css('left', value);
		},

		css2slide: function(value, speed){
			var article = this;
			
			article.isCssFinish = false;
			article.transitionWrapper.stop(true, true).animate({
				'left': value
			},{
				duration: speed || article.options.slideSpeed,
				complete: function(){
					article.isCssFinish = true;
				}
			});
		},

		checkBrowser: function(){
			var article = this,
				translate3D = 'translate3d(0px, 0px, 0px)',
				tempElement = document.createElement('div'),
				regex, asSupport, support3d, isTouch;
			
			tempElement.style.cssText = '  -moz-transform:' + translate3D +
                                  		'; -ms-transform:'     + translate3D +
                                  		'; -o-transform:'      + translate3D +
                                  		'; -webkit-transform:' + translate3D +
                                  		'; transform:'         + translate3D;
			regex = /translate3d\(0px, 0px, 0px\)/g;
			asSupport = tempElement.style.cssText.match(regex);
			support3d = (asSupport !== null && asSupport.length === 1);
			isTouch = 'ontouchstart' in window || window.navigator.msMaxTouchPoints;
			
			article.browser = {
				'support3d': support3d,
				'isTouch': isTouch
			};
		},

		moveEvents: function(){
			var article = this;
			if(article.options.mouseDrag !== false || article.options.touchDrag !== false){
				article.gestures();
				article.disabledEvents();
			}
		},

		eventTypes: function(){
			var article = this,
				types = ['s', 'e', 'x'];
			
			article.ev_types = {};
			
			if(article.options.mouseDrag === true && article.options.touchDrag === true){
				types = [
					'touchstart.transition mousedown.transition',
					'touchmove.transition mousemove.transition',
					'touchend.transition touchcancel.transition mouseup.transition'
				];
			}else if(article.options.mouseDrag === false && article.options.touchDrag === true){
				types = [
					'touchstart.transition',
					'touchmove.transition',
					'touchend.transition touchcancel.transition'
				];
			}else if(article.options.mouseDrag === true && article.options.touchDrag === false){
				types = [
					'mousedown.transition',
					'mousedown.transition',
					'mouseup.transition'
				];
			}
			
			article.ev_types.start = types[0];
			article.ev_types.move = types[1];
			article.ev_types.end = types[2];
		},

		disabledEvents: function(){
			var article = this;
			
			article.element.on('dragstart.transition', function(e){
				e.preventDefault();
			});
			article.element.on('mousedown.disableTextSelect', function(e){
				return $(e.target).is('input, textarea, select, option');
			});
		},

		gestures: function(){
			var article = this,
				locals = {
					offsetX: 0,
					offsetY: 0,
					baseElWidth: 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
				};
				
			article.isCssFinish = true;
			
			function getTouches(e){
				if(e.touches !== undefined){
					return{
						x: e.touches[0].pageX,
						y: e.touches[0].pageY
					};
				}
				if(e.touches === undefined){
					if(e.pageX !== undefined){
						return{
							x: e.pageX,
							y: e.pageY
						};
					}
					if(e.pageX === undefined){
						return{
							x: e.clientX,
							y: e.clientY
						};
					}
				}
			}
			
			function swapEvents(type){
				if(type === 'on'){
					$(document).on(article.ev_types.move, dragMove);
					$(document).on(article.ev_types.end, dragEnd);
				}else if(type === 'off'){
					$(document).off(article.ev_types.move);
					$(document).off(article.ev_types.end);
				}
			}
			
			function dragStart(e){
				var event = e.originalEvent || e || window.e, position;
				
				if(event.which === 3){
					return false;
				}
				if(article.itemsAmount <= article.options.items){
					return;
				}
				if(article.isCssFinish === false && !article.options.dragBeforeAnimFinish){
					return false;
				}
				if(article.isCss3Finish === false && !article.options.dragBeforeAnimFinish){
					return false;
				}
				if(article.browser.isTouch !== true && !article.transitionWrapper.hasClass('grabbing')){
					article.transitionWrapper.addClass('grabbing');
				}
				
				article.newPosX = 0;
				article.newRelativeX = 0;
				
				$(this).css(article.removeTransition());
				
				position = $(this).position();
				locals.relativePos = position.left;
				
				locals.offsetX = getTouches(event).x - position.left;
				locals.offsetY = getTouches(event).y - position.top;
				
				swapEvents('on');
				
				locals.sliding = false;
				locals.targetElement = event.target || event.srcElement;
			}
			
			function dragMove(e){
				var event = e.originalEvent || e || window.e, minSwipe, maxSwipe;
				
				article.newPosX = getTouches(event).x - locals.offsetX;
				article.newPosY = getTouches(event).y - locals.offsetY;
				article.newRelativeX = article.newPosX - locals.relativePos;
				
				if(typeof article.options.startDragging === 'function' && locals.dragging !== true && article.newRelativeX !== 0){
					locals.dragging = true;
					article.options.startDragging.apply(article, [article.element]);
				}
				
				if((article.newRelativeX > 8 || article.newRelativeX < -8) && (article.browser.isTouch === true)){
					if(event.preventDefault !== undefined){
						event.preventDefault();
					}else{
						event.returnValue = false;
					}
					locals.sliding = true;
				}
				
				if((article.newPosY > 10 || article.newPosY < -10) && locals.sliding === false){
					$(document).off('touchmove.transition');
				}
				
				minSwipe = function(){
					return article.newRelativeX / 5;
				};
				
				maxSwipe = function(){
					return article.maximumPixels + article.newRelativeX / 5;
				};
				
				article.newPosX = Math.max(Math.min(article.newPosX, minSwipe()), maxSwipe());
				
				if(article.browser.suppert3d === true){
					article.transition3d(article.newPosX);
				}else{
					article.css2move(article.newPosX);
				}
			}
			
			function dragEnd(e){
				var event = e.orginalEvent || e || window.e, newPosition, handlers, transitionStopEvent;
				
				event.target = event.target || event.srcElement;
				
				locals.dragging = false;
				
				if(article.browser.isTouch !== true){
					article.transitionWrapper.removeClass('grabbing');
				}
				
				if(article.newRelativeX < 0){
					article.dragDirection = article.transition.dragDirection = 'left';
				}else{
					article.dragDirection = article.transition.dragDirection = 'right';
				}
				
				if(article.newRelativeX !== 0){
					newPosition = article.getNewPosition();
					article.goTo(newPosition, false, 'drag');
					if(locals.targetElement === event.target && article.browser.isTouch !== true){
						$(event.target).on('click.disable', function(event){
							event.stopImmediatePropagation();
							event.stopPropagation();
							event.preventDefault();
							$(event.target).off('click.disable');
						});
						handlers = $._data(event.target, 'events').click;
						transitionStopEvent = handlers.pop();
						handlers.splice(0, 0, transitionStopEvent);
					}
				}
				swapEvents('off');
			}
			
			article.element.on(article.ev_types.start, '.transition-wrapper', dragStart);
			
		},

		getNewPosition: function(){
			var article = this,
				newPosition = article.closestItem();
			
				if(newPosition > article.maximumItem){
					article.currentItem = article.maximumItem;
					newPosition = article.maximumItem;
				}else if(article.newPosX >= 0){
					newPosition = 0;
					article.currentItem = 0;
				}
				return newPosition;
		},

		closestItem: function(){
			var article = this,
				array = article.options.scrollPerPage === true ? article.pagesInArray : article.positionsInArray,
				goal = article.newPosX,
				closest = null;
				
			$.each(array, function(i, v){
				if(goal - (article.itemWidth / 20) > array[i + 1] && goal - (article.itemWidth / 20) < v && article.moveDirection() == 'left'){
					closest = v;
					if(article.options.scrollPerPage === true){
						article.currentItem = $.inArray(closest, article.positionsInArray);
					}else{
						article.currentItem = i;
					}
				}else if(goal + (article.itemWidth / 20) < v && goal + (article.itemWidth / 20) > (array[i + 1] || array[i] - article.itemWidth) && article.moveDirection() === 'right'){
					if(article.options.scrollPerPage === true){
						closest = array[i + 1] || array[array.length - 1];
						article.currentItem = $.inArray(closest, article.positionsInArray);
					}else{
						closest = array[i + 1];
						article.currentItem = i + 1;
					}
				}
			});
			return article.currentItem;
		},

		moveDirection: function(){
			var article = this,
				direction;
			
				if(article.newRelativeX < 0){
					direction = 'right';
					article.playDirection = 'next';
				}else{
					direction = 'left';
					article.playDirection = 'prev';
				}
				return direction;
		},

		customEvents: function(){
			var article = this;
			article.element.on('transition.next', function(){
				article.next();
			});
			article.element.on('transition.prev', function(){
				article.prev();
			});
			article.element.on('transition.goTo', function(event, item){
				article.goTo(item);
			});
			article.element.on('transition.jumpTo', function(event, item){
				article.jumpTo(item);
			});
		},

		lazyLoad: function(){
			var article = this,
				i, item, itemNumber, lazyImg, follow;
				
			if(article.options.lazyLoad === false){
				return false;
			}
			
			for(i = 0; i < article.itemsAmount; i +=1){
				item = $(article.transitionItems[i]);
				
				if(item.data('transition-loaded') === 'loaded'){
					continue;
				}
				
				itemNumber = item.data('item');
				lazyImg = item.find('.lazy');
				
				if(typeof lazyImg.data('src') !== 'string'){
					item.data('transition-loaded', 'loaded');
					continue;
				}
				
				if(item.data('transition-loaded') === undefined){
					lazyImg.hide();
					item.addClass('loading').data('transition-loaded', 'checked');
				}
				
				if(article.options.lazyFollow === true){
					follow = itemNumber >= article.currentItem;
				}else{
					follow = true;
				}
				if(follow && itemNumber < article.currentItem + article.options.items && lazyImg.length){
					article.lazyPreload(item, lazyImg);
				}
			}
		},

		lazyPreload: function(item, lazyImg){
			var article = this,
				iterations = 0,
				isBackgroundImg;
				
			if(lazyImg.prop('tagName') === 'DIV'){
				lazyImg.css('background-image', 'url(' + lazyImg.data('src') + ')');
				isBackgroundImg = true;
			}else{
				lazyImg[0].src = lazyImg.data('src');
			}
			
			function showImage(){
				item.data('transition-loaded', 'loaded').removeClass('loading');
				lazyImg.removeAttr('data-src');
				if(article.options.lazyEffect === 'fade'){
					lazyImg.fadeIn(400);
				}else{
					lazyImg.show();
				}
				if(typeof article.options.afterLazyLoad === 'function'){
					article.options.afterLazyLoad.apply(this, [article.element]);
				}
			}
			
			function checkLazyImage(){
				iterations += 1;
				if(article.completeImg(lazyImg.get(0)) || isBackgroundImg === true){
					showImage();
				}else if(interactions <= 100){
					window.setTimeout(checkLazyImage, 100);
				}else{
					showImage();
				}
			}
			checkLazyImage();
		},

		autoHeight: function(){
			var article = this,
				currentImg = $(article.transitionItems[article.currentItem]).find('img'),
				iterations;
				
			function addHeight(){
				var currentItem = $(article.transitionItems[article.currentItem]).height();
				article.wrapperOuter.css('height', currentItem + 'px');
				if(!article.wrapperOuter.hasClass('autoHeight')){
					window.setTimeout(function (){
						article.wrapperOuter.addClass('autoheight');
					}, 0);
				}
			}
			
			function checkImage(){
				iterations += 1;
				
				if(article.completeImg(currentImg.get(0))){
					addHeight();
				}else if(iterations <= 100){
					window.setTimeout(checkImage, 100);
				}else{
					article.wrapperOuter.css('height', '');
				}
			}
			
			if(currentImg.get(0) !== undefined){
				iterations = 0;
				checkImage();
			}else{
				addHeight();
			}
		},

		completeImg: function(img){
			var naturalWidthType;
			
            if(!img.complete){
                return false;
            }
			naturalWidthType = typeof img.naturalWidth;
			
			if(naturalWidthType !== 'undefined' && img.naturalWidth === 0){
				return false
			}
			return true;
		},

		onVisibleItems: function(){
			var article = this,
				i;
			
			if(article.options.addClassActive === true){
				article.transitionItems.removeClass('active');
			}
			
			article.visibleItems = [];
			
			for(i = article.currentItem; i < article.currentItem + article.options.items; i += 1){
				article.visibleItems.push(i);
				
				if(article.options.addClassActive === true){
					$(article.transitionItems[i].addClass('active'));
				}
			}
			article.transition.visibleItems = article.visibleItems;
		},

		transitionTypes: function(className){
			var article = this;			
			article.outClass = 'transition-' + className + '-out';
			article.inClass = 'transition-' + className + '-in';
		},

		singleItemTransition: function(){
			var article = this,
				outClass = article.outClass,
				inClass = article.inClass,
				currentItem = article.transitionItems.eq(article.currentItem),
				prevItem = article.transitionItems.eq(article.prevItem),
				prevPos = Math.abs(article.positionsInArray[article.currentItem]) + article.positionsInArray[article.prevItem],
				origin = Math.abs(article.positionsInArray[article.currentItem]) + article.itemWidth / 2,
				animEnd = 'webkitAnumationEnd oAnimationEnd MSAnimationEnd animationed';
				
			article.isTransition = true;
			
			article.transitionWrapper.addClass('transition-origin').css({
				'-webkit-transform-oring': origin + 'px',
				'-moz-perspective-origin': origin + 'px',
				'perspective-origin': origin + 'px'
			});
			
			function transStyles(prevPos){
				return{
					'position': 'relative',
					'left': prevPos + 'px'
				};
			}
			
			prevItem.css(transStyles(prevPos, 10)).addClass(outClass).on(animEnd, function(){
				article.endPrev = true;
				prevItem.off(animEnd);
				article.clearTransStyle(currentItem, inClass);
			});
		},

		clearTransStyle: function(item, classToRemove){
			var article = this;
			
			item.css({
				'position': '',
				'left': ''
			}).removeClass(classToRemove);
			
			if(article.endPrev && article.endCurrent){
				article.transitionWrapper.removeClass('transition-origin');
				article.endPrev = false;
				article.endCurrent = false;
				article.isTransition = false;
			}
		},

		transitionStatus: function(){
			var article = this;
			
			article.transition = {
				'userOptions': 		article.userOptions,
				'baseElement': 		article.element,
				'userItems': 		article.userItems,
				'transitionItems': 	article.transitionItems,
				'currentItem': 		article.currentItem,
				'prevItem': 		article.prevItem,
				'visibleItems': 	article.visibleItems,
				'isTouch': 			article.browser.isTouch,
				'browser': 			article.browser,
				'dragDirection': 	article.dragDirection
			};
		},

		clearEvents: function(){
			var article = this;
			
			article.element.off('.transition transition mousedown.disableTextSelect');
			$(document).off('.transition transition');
			$(window).off('resize', article.resizer);
		},

		unWrap: function(){
			var article = this;
			
			if(article.element.children().length !== 0){
				article.transitionWrapper.unwrap();
				article.userItems.unwrap().unwrap();
				if(article.transitionControls){
					article.transitionControls.remove();
				}
			}
			article.clearEvents();
			
			article.element.attr('style', article.element.data('transition-transitionStyles') || '').attr('class', article.element.data('transition-originalClass'));
		},

		destroy: function(){
			var article = this;
			window.clearInterval(article.checkVisible);
			article.unWrap();
			article.element.removeData();
		},

		reinit: function(){
			var article = this,
				options = $.extend({}, article.userOptions, newOptions);

			article.unWrap();
			article.init(options, article.element);
		},

		addItem: function(string, targetPosition){
			var article = this, position;
			
			if(!string){
				return false;
			}
			
			if(article.element.children().length === 0){
				article.element.append(string);
				article.setVars();
				return false;
			}
			
			article.unWrap();
			
			if(targetPosition === undefined || targetPosition === -1){
				position = -1;
			}else{
				position = targetPosition;
			}
			
			if(position >= article.transitionItems.length || position == -1){
				article.transitionItems.eq(-1).after(string);
			}else{
				article.transitionItems.eq(position).before(string);
			}
			article.setVars();
		},

		removeItem: function(){
			var article = this, position;
			
			if(article.element.children().length === 0){
				return false;
			}
			
			if(targetPosition === undefined || targetPosition === -1){
				position = -1;
			}else{
				position = targetPosition;
			}
			
			article.unWrap();
			article.transitionItems.eq(poistion).remove();
			article.setVars();
		}
	};
	
	
	$.fn.transitions = function(options){
		return this.each(function(){
			if($(this).data('transition-init') === true){
				return false;
			}
			$(this).data('transition-init', true);
			var articles = Object.create(shadows.articles);
			articles.init(options, this);
			$.data(this, 'transitions', articles);
		})
	};
	$.fn.transitions.options = {
        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "transition-articles",
        theme : "transition-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
		
	};
}( window.shadows = window.shadows || {}, jQuery ));