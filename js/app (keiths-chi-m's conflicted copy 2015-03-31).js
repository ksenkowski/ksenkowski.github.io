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
		$('#example').articles();
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
		init: function(options, item){
			var base = this;
			
			base.element = $(item);
			base.options = $.extend({}, $.fn.articles.options, base.element.data(), options);
			
			base.userOptions = options;
			base.loadContent();
		},
		loadContent: function(){
			var base = this;
			
			base.element.data('article-styles', base.element.attr('style'));
			base.element.data('article-classes', base.element.attr('class'));
			
			base.element.css({opacity: 0});
			base.originalItems = base.options.items;
			base.checkBrowser();
			base.wrapperWidth = 0;
			base.checkVisible = null;
			base.setVars();
		},
		setVars: function(){
			var base = this;
			
			if(base.element.children().length === 0){
				return false;
			}
			
			base.baseClass();
			base.eventTypes();
			base.userItems = base.element.children();
			base.itemAmount = base.userItems.length;
			base.wrapItems();
			base.articleItems = base.element.find('.item');
			base.articleWrapper = base.element.find('.wrapper');
			base.Direction = 'next';
			base.prevItem = 0;
			base.prevArr = [0];
			base.currentItem = 0;
			base.customEvents();
			base.onStartUp();
		},
		onStartUp: function(){
			var base = this;
			
			base.updateItems();
			base.calculateAll();
			base.buildControls();
			base.updateControls();
			base.response();
			base.moveEvents();
			base.articleStatus();
			
			if(base.options.transitionStyle !== false){
				base.transitionTypes(base.options.transitionStyle);
			}
			
			base.element.find('.wrapper').css('display', 'block');
			
			if(!base.element.is(':visible')){
				base.watchVisibility();
			}else{
				base.element.css({opacity: 1});
			}
			
			base.onstartup = false;
			base.eachMoveUpdate();
			
			if(typeof base.options.afterInit === 'function'){
				base.options.afterInit.apply(this, [base.element]);
			}
		},
		
		eachMoveUpdate: function(){
			var base = this;
			
			if(base.options.lazyLoad === true){
				base.lazyLoad();
			}
			if(base.options.autoHeight === true){
				base.autoHeight();
			}
			
			base.onVisibleItems();
			
			if(typeof base.options.afterAction === 'function'){
				base.options.afterAction.apply(this, [base.element]);
			}
		},
		
		updateVars: function(){
			var base = this;
			
			if(typeof base.options.beforeUpdate === 'function'){
				base.options.beforeUpdate.apply(this, [base.element]);
			}
			
			base.watchVisbility();
			base.updateItems();
			base.calculateAll();
			base.updatePosition();
			base.updateControls();
			base.eachMoveUpdate();
			
			if(typeof base.options.afterUpdate === 'function'){
				base.options.afterUpdate.apply(this, [base.element]);
			}
		},
		
		reload: function(){
			var base = this;
			
			window.setTimeout(function(){
				base.updateVars();
			}, 0);
		},
		
		watchVisibility: function(){
			var base = this;
			
			if(base.element.is(':visible') === false){
				base.element.css({opacity: 0});
				window.clearInterval(base.checkVisibile);
			}else{
				return false;
			}
			
			base.checkVisible = window.setInterval(function(){
				if(base.element.is(':visible')){
					base.reload();
					base.element.animate({opacity: 1}, 200);
					window.clearInterval(base.checkVisible);
				}
			}, 500);	
		},
		
		wrapItems: function(){
			var base = this;
			
			base.userItems.wrapAll('<div class="wrapper">').wrap('<div class="item"></div>');
			base.element.find('.wrapper').wrap('<div class="outer-wrapper">');
			base.outerWrapper = base.element.find('.outer-wrapper');
			base.element.css('display', 'block');
		},
		
		baseClass: function(){
			var base = this,
				hasBaseClass = base.element.hasClass(base.options.baseClass),
				hasThemeClass = base.element.hasClass(base.options.theme);
				
				if(!hasBaseClass){
					base.element.addClass(base.options.baseClass);
				}
				if(!hasThemeClass){
					base.element.addClass(base.options.theme);
				}
		},
		
		updateItems: function(){
			var base = this, width, i;
			
			if(base.options.responsive === false){
				return false;
			}
			if(base.options.singleItem === true){
				base.options.items = base.originalItems = 1;
				base.options.itemsCustom = false;
				base.options.itemsDesktop = false;
				base.options.itemsDesktopSmall = false;
				base.options.itemsTablet = false;
				base.options.itemsTabletSmall = false;
				base.options.itemsMobile = false;
				return false;
			}
			
			width = $(base.options.responsiveBaseWidth).width();
			
			if(width > (base.options.itemsDesktop[0] || base.originalItems)){
				base.options.items = base.originalItems;
			}
			if(base.options.itemsCustom !== false){
				base.options.itemCustom.sort(function(a, b){
					return a[0] - b[0];
				});
				
				for(i = 0; i < base.options.itemsCustom.length; i +=1){
					if(base.options.itemCustom[i][0] <= width){
						base.options.items = base.options.itemsCustom[i][1];
					}
				}
			}else{
				
				if(width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false){
					base.options.items = base.options.itemsDesktop[1];
				}
				
                if(width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false){
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if(width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false){
                    base.options.items = base.options.itemsTablet[1];
                }

                if(width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false){
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if(width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false){
                    base.options.items = base.options.itemsMobile[1];
                }				
			}
			
			if(base.options.items > base.itemsAmount && base.options.itemsScaleUp === true){
				base.options.items = base.itemsAmount;
			}
		},
		
		response: function(){
			var base = this,
				smallDelay,
				lastWindowWidth;
				
			if(base.options.responsive !== true){
				return false;
			}
			
			lastWindowWidth = $(window).width();
			
			base.resizer = function(){
				if($(window).width() !== lastWindowWidth){
					window.clearTimeout(smallDelay);
					smallDelay = window.setTimeout(function(){
						lastWindowWidth = $(window).width();
						base.updateVars();
					}, base.options.responsiveRefreshRate);
				}
			};
			$(window).resize(base.resizer);
		},
		
		updatePosition: function(){
			var base = this;
			base.jumpTo(base.currentItem);
		},
		
		appendItemSizes: function(){
			var base = this,
				roundPages = 0,
				lastItem = base.itemsAmount - base.options.items;
				
			base.articleItems.each(function(index){
				var me = $(this);
				me.css({'width': base.itemWidth}).data('article-item', Number(index));
				
				if(index % base.options.items === 0 || index === lastItem){
					if(!(index > lastItem)){
						roundPages += 1;
					}
				}
				me.data('article-roundPages', roundPages);
			});
		},
		
		appendWrapperSizes: function(){
			var base = this,
				width = base.articleItems.length * base.itemWidth;
			base.articleWrapper.css({
				'width': width * 2,
				'left': 0
			});
			base.appendItemSizes();
		},
		
		calculateAll: function(){
			var base = this;
			
			base.calculateWidth();
			base.appendWrapperSizes();
			base.loops();
			base.max();
		},
		
		calculateWidth: function(){
			var base = this;
			
			base.itemWidth = Math.round(base.element.width() / base.options.items);
		},
		
		max: function(){
			var base = this,
				maximum = ((base.itemAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
			
				if(base.options.items > base.itemsAmount){
					base.maximumItem = 0;
					maximum = 0;
					base.maximumPixels = 0;
				}else{
					base.maximumItem = base.itemsAmount - base.options.items;
					base.maximumPixels = maximum;
				}
				return maximum;
		},
		
		min: function(){
			return 0;
		},
		
		loops: function(){
			var base = this,
				prev = 0,
				elementWidth = 0,
				i,
				item,
				roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elementWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.articleItems[i]);
                    roundPageNum = item.data('roundPages');
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }	
		},
		
        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.controls = $('<div class="controls"/>').toggleClass('clickable', !base.browser.isTouch).appendTo(base.element);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $('<div class="buttons"/>');
            base.controls.append(buttonsWrapper);

            base.buttonPrev = $('<div/>', {
                'class' : 'prev',
                'html' : base.options.navigationText[0] || ""
            });

            base.buttonNext = $('<div/>', {
                'class' : 'next',
                'html' : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on('touchstart.controls mousedown.controls', 'div[class^="art"]', function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on('touchend.controls mouseup.controls', 'div[class^="art"]', function (event) {
                event.preventDefault();
                if ($(this).hasClass('next')) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $('<div class="pagination"/>');
            base.controls.append(base.paginationWrapper);

            base.paginationWrapper.on('touchend.controls mouseup.controls', '.page', function (event) {
                event.preventDefault();
                if (Number($(this).data('page')) !== base.currentItem) {
                    base.goTo(Number($(this).data('page')), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html('');

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $('<div/>', {
                        'class' : 'page'
                    });
                    paginationButtonInner = $('<span></span>', {
                        'text': base.options.paginationNumbers === true ? counter : '',
                        'class': base.options.paginationNumbers === true ? 'numbers' :''
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data('page', lastPage === i ? lastItem : i);
                    paginationButton.data('roundPages', counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find('.page').each(function () {
                if ($(this).data('roundPages') === $(base.articleItems[base.currentItem]).data('roundPages')) {
                    base.paginationWrapper
                        .find('.page')
                        .removeClass('active');
                    $(this).addClass('active');
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass('disabled');
                    base.buttonNext.addClass('disabled');
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass('disabled');
                    base.buttonNext.removeClass('disabled');
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass('disabled');
                    base.buttonNext.addClass('disabled');
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass('disabled');
                    base.buttonNext.removeClass('disabled');
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.controls) {
                if (base.options.items >= base.itemsAmount) {
                    base.controls.hide();
                } else {
                    base.controls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.controls) {
                base.controls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = 'rewind';
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = 'rewind';
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === 'function') {
                base.options.beforeMove.apply(this, [base.element]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.art.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== 'drag' && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed('paginationSpeed');
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === 'rewind') {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed('slideSpeed');
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === 'rewind') {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === 'function') {
                base.options.beforeMove.apply(this, [base.element]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.art.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.art.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

            }
            if (typeof base.options.afterMove === 'function' && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.element]);
            }
        },
		
        stop : function () {
            var base = this;
            base.apStatus = "stop";
        },
		
        swapSpeed : function (action) {
            var base = this;
            if (action === 'slideSpeed') {
                base.articleWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === 'paginationSpeed') {
                base.articleWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== 'string') {
                base.articleWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                '-webkit-transition': 'all ' + speed + 'ms ease',
                '-moz-transition': 'all ' + speed + 'ms ease',
                '-o-transition': 'all ' + speed + 'ms ease',
                'transition': 'all ' + speed + 'ms ease'
            };
        },

        removeTransition : function () {
            return {
                '-webkit-transition': '',
                '-moz-transition': '',
                '-o-transition': '',
                'transition': ''
            };
        },

        doTranslate : function (pixels) {
            return {
                '-webkit-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                '-moz-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                '-o-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                '-ms-transform': 'translate3d(' + pixels + 'px, 0px, 0px)',
                'transform': 'translate3d(' + pixels + 'px, 0px,0px)'
            };
        },

        transition3d : function (value) {
            var base = this;
            base.articleWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.articleWrapper.css({'left' : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.articleWrapper.stop(true, true).animate({
                'left' : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = 'translate3d(0px, 0px, 0px)',
                tempElem = document.createElement('div'),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = '  -moz-transform:' + translate3D +
                                  '; -ms-transform:'     + translate3D +
                                  '; -o-transform:'      + translate3D +
                                  '; -webkit-transform:' + translate3D +
                                  '; transform:'         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = 'ontouchstart' in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                'support3d' : support3d,
                'isTouch' : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ['s', 'e', 'x'];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    'touchstart.art mousedown.art',
                    'touchmove.art mousemove.art',
                    'touchend.art touchcancel.art mouseup.art'
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    'touchstart.art',
                    'touchmove.art',
                    'touchend.art touchcancel.art'
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    'mousedown.art',
                    'mousemove.art',
                    'mouseup.art'
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.element.on('dragstart.art', function (event) { event.preventDefault(); });
            base.element.on('mousedown.disableTextSelect', function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === 'on') {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === 'off') {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.browser.isTouch !== true && !base.articleWrapper.hasClass('grabbing')) {
                    base.articleWrapper.addClass('grabbing');
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents('on');

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === 'function' && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.element]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off('touchmove.art');
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    stopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.articleWrapper.removeClass('grabbing');
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.art.dragDirection = 'left';
                } else {
                    base.dragDirection = base.art.dragDirection = 'right';
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, 'drag');
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on('click.disable', function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off('click.disable');
                        });
                        handlers = $._data(ev.target, 'events').click;
                        stopEvent = handlers.pop();
                        handlers.splice(0, 0, stopEvent);
                    }
                }
                swapEvents('off');
            }
            base.element.on(base.ev_types.start, '.wrapper', dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === 'left') {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === 'right') {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = 'right';
                base.playDirection = 'next';
            } else {
                direction = 'left';
                base.playDirection = 'prev';
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.element.on('art.next', function () {
                base.next();
            });
            base.element.on('art.prev', function () {
                base.prev();
            });
            base.element.on('art.goTo', function (event, item) {
                base.goTo(item);
            });
            base.element.on('art.jumpTo', function (event, item) {
                base.jumpTo(item);
            });
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.articleItems[i]);

                if ($item.data('article-loaded') === 'loaded') {
                    continue;
                }

                itemNumber = $item.data('article-item');
                $lazyImg = $item.find('.lazy');

                if (typeof $lazyImg.data('src') !== 'string') {
                    $item.data('loaded', 'loaded');
                    continue;
                }
                if ($item.data('article-loaded') === undefined) {
                    $lazyImg.hide();
                    $item.addClass('loading').data('article-loaded', 'checked');
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop('tagName') === 'DIV') {
                $lazyImg.css('background-image', 'url(' + $lazyImg.data('src') + ')');
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data('src');
            }

            function showImage() {
                $item.data('article-loaded', 'loaded').removeClass('loading');
                $lazyImg.removeAttr('data-src');
                if (base.options.lazyEffect === 'fade') {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === 'function') {
                    base.options.afterLazyLoad.apply(this, [base.element]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.articleItems[base.currentItem]).find('img'),
                iterations;

            function addHeight() {
                var $currentItem = $(base.articleItems[base.currentItem]).height();
                base.wrapperOuter.css('height', $currentItem + 'px');
                if (!base.wrapperOuter.hasClass('autoHeight')) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass('autoHeight');
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css('height', ''); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== 'undefined' && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.articleItems.removeClass('active');
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.articleItems[i]).addClass("active");
                }
            }
            base.art.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: 'fade', 'backSlide', 'goDown', 'fadeUp'
            base.outClass = 'art-' + className + '-out';
            base.inClass = 'art-' + className + '-in';
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.articleItems.eq(base.currentItem),
                $prevItem = base.articleItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.articleWrapper
                .addClass('origin')
                .css({
                    '-webkit-transform-origin' : origin + 'px',
                    '-moz-perspective-origin' : origin + 'px',
                    'perspective-origin' : origin + 'px'
                });
            function transStyles(prevPos) {
                return {
                    'position' : 'relative',
                    'left' : prevPos + 'px'
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                'position' : '',
                'left' : ''
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.articleWrapper.removeClass('origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        articleStatus : function () {
            var base = this;
            base.art = {
                'userOptions'   : base.userOptions,
                'baseElement'   : base.element,
                'userItems'     : base.userItems,
                'articleItems'  : base.articleItems,
                'currentItem'   : base.currentItem,
                'prevItem'      : base.prevItem,
                'visibleItems'  : base.visibleItems,
                'isTouch'       : base.browser.isTouch,
                'browser'       : base.browser,
                'dragDirection' : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.element.off(".art art mousedown.disableTextSelect");
            $(document).off(".art art");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.element.children().length !== 0) {
                base.articleWrapper.unwrap();
                base.userItems.unwrap().unwrap();
                if (base.controls) {
                    base.controls.remove();
                }
            }
            base.clearEvents();
            base.element
                .attr("style", base.element.data("article-styles") || "")
                .attr("class", base.element.data("article-classes"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.element.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.element);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.element.children().length === 0) {
                base.element.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.userItems.length || position === -1) {
                base.userItems.eq(-1).after(htmlString);
            } else {
                base.userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.element.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.userItems.eq(position).remove();
            base.setVars();
        }
	};
	
	
	$.fn.articles = function(options){
		return this.each(function(){
			if($(this).data('articles-init') === true){
				return false;
			}
			$(this).data('articles-init', true);
			shadows.articles.init(options, this);
			$.data(this, 'magazine', shadows.articles);
		});
	};
	$.fn.articles.options = {
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

        baseClass : "base",
        theme : "theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

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