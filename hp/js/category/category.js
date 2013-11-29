
//jQuery.noConflict();
(function($) {
    
    var app = (typeof app !== "undefined" && app != null) ? app : {

        config : {
            imgPath     : 'http://h20386.www2.hp.com/AustraliaStore/images/AUOLS_R2/images/product/',
            currency    : "AU$",
            category    : null,
        },

        getProducts : function( urlhash ) {
            var config = this.config;
            
            
            //CLEANED THIS UP
            if (urlhash.indexOf('tablet-laptop') > -1) {
                config.category = 'tablet-laptop';
            } else if (urlhash.indexOf('printers') > -1) {
                config.category = 'printers';
            } else if (urlhash.indexOf('monitors') > -1) {
                config.category = 'monitors';
            } else if (urlhash.indexOf('desktop') > -1) {
                config.category = 'desktop';
            } else {
                config.category = 'desktop';
            }
            //END CLEAN UP
            
            return this.getXML("productCatalog.xml", config, urlhash);
        },

        getXML : function( xmlFile, config, urlhash ) {
            $.ajax({
                url: "xml/category/" + xmlFile,
                type: "GET",
                dataType: 'xml',
                success : function( data ) {
                    setTimeout(processXML(data, config, urlhash), 500);
                   
                    
                },
                error : function( error ) {
                    console.log( error );
                },
            });
        },
        
        _fixProductContainerHeight: function() {
			while(($children = $(':not(.parent) > .child:lt(2)')).length) {
			    $children.wrapAll($('<ul class="parent clearfix"></ul>'));
			}
			
            $(".tab-pane").each(function() {
                $(this).find('.product-item:even').each( function() {
                    var even_element = $(this).find('.product-container');
                    var odd_element = $(this).next('.product-item').find('.product-container');
                    
                    var even_height = even_element.height();
                    var odd_height = odd_element.height();
                    
                    if( even_height > odd_height ) {
                        odd_element.height( even_height );
                    } else {
                        even_element.height( odd_height );
                    }
                    
                });
            });
 			
        },
        
        _fixTabsWidth: function() {
            var ul = $("ul#tab-products"),
                ul_width = ul.width(),
                total_items = ul.find("li").length,
                margin = (total_items - 1) * 2;
        
            return ul.find("li").width( (ul_width - margin ) / total_items );
        },
        
        _setItemActive : function( hash ) {
            
            $(".headlineContent ul li").each( function() {
                $(this).removeClass('active');
                
                var current_hash = $(this).find("a").attr('data-slug');
                if( current_hash == hash.substring(1) ) {
                    $(this).addClass('active');
                }
            });
			$("#tab-products li a[href='#"+ hash.split('/')[1] +"']").tab('show');
			
        },
        _amountItemsCompare : function() {
            var amount = parseInt( $('.compare input[type="checkbox"]:checked').length );
            var button = $(".compare-info input");
            
            button.val("Compare ("+ amount +")");
            if( amount >= 2 ) {
                button.removeClass('btn-disabled').addClass('btn-primary');
            } else {
                button.removeClass('btn-primary').addClass('btn-disabled');
            }
        },
    }
    
    $(function() {

        $(window).hashchange(function() {
            var hash = location.hash;
            if ( !hash ) {
                hash = '#for-home-desktop'
            }
            return app.getProducts( hash );
        });
        
        $(window).hashchange();

        $(document).on('click', '.headlineContent ul li a', function(e) {
            e.preventDefault();
            location.hash = $(this).attr('data-slug');
            return;
        });
        
        $(document).on('click', '#tab-products li', function (e) {
            e.preventDefault();
            $(this).find("a").tab('show');
            app._fixProductContainerHeight();
        });
        
        $(document).on('click', '.compare input[type="checkbox"]', function (e) {
            var span = $(this).siblings("span");
            if( $(this).is(":checked") ) {
                span.removeClass().addClass("global-checkbox-checked");
            } else {
                span.removeClass().addClass("global-checkbox");
            }
            
            app._amountItemsCompare();
        });
        
        $(document).on('click', '.compare > span', function (e) {
            var checkbox = $(this).siblings('input[type="checkbox"]');
            var label = $(this).siblings("label");
            
            label.trigger("click");
            if( checkbox.is(":checked") ) {
                $(this).removeClass().addClass("global-checkbox-checked");
            } else {
                $(this).removeClass().addClass("global-checkbox");
            }
            
            app._amountItemsCompare();
        });
        $(document).on('click', '.tab-pane.active .view-more a', function (e) {
            e.preventDefault();
            $(this).parent().siblings(".product-item.hide").removeClass('hide');
            app._fixProductContainerHeight();
            $(this).hide();
        });
    });
})(jQuery);

var processXML = function processXMLF(data, config, urlhash){
	 $(data).find('ProductCatalog').each(function() {
            categories = [];
            sub_categories = [];
            models = [];
			$(this).find('GroupTitle').each(function(){
				var title = $(this).attr('name');
				var groupTitle = $(this).attr('group');
				if(groupTitle == config.category){
					$('.headlineContent h1').text(title);
				}
			});
            $(this).find('Category').each(function(i) {
                var group = $(this).attr('group');
                var cName = $(this).attr('name');
                var cSlug = $(this).attr('slug');

                if (group == config.category) {
                    categories[i] = {
                        name: $(this).attr('name'), 
                        slug: $(this).attr('slug') 
                    };
                }
                
              
                $(this).find('SubCategory').each(function(j) {
                    var scName = $(this).attr('name');
                    var scSlug = $(this).attr('slug');
                    
                    if ( urlhash.indexOf('#' + cSlug) > -1 ) {
                        if (scSlug != 'no-tab') {
                            sub_categories[j] = {
                                category_slug       : cSlug,
                                subcategory_slug    : scSlug,
                                subcategory_name    : scName,
                            };
                        }
                        var arr = [];
						
							$(this).find('Model').each( function(k) {
                                var $this = $(this);

                                arr.push({
                                    id : $this.attr('part'),
                                    name : $this.attr('name'),
                                    is_top : $this.find('top').attr('rate') != "false",
                                    features : $this.find('features > feature'),
                                    buynow : $this.find('buynow').text(),
                                    fullspec : $this.find('fullspec').text(),
                                    wishlist : $this.find('wishlist').text(),
                                    usualprice : $this.find('usualprice').text(),
                                    price : function() {
                                        var price = $this.find('price').text().split('.');
                                        return price[0];
                                    },
                                    decimals : function() {
                                        var price = $this.find('price').text().split('.');
                                        return typeof price[1] === 'undefined' ? "00" : price[1];
                                    },
                                    gallery : function() {
                                        var gallery_type = $this.attr('gallery'),
                                            id = $this.attr('part'),
                                            arr = [];

                                        if( gallery_type == 3 ) {
                                            arr.push( config.imgPath + id + "_pm.png" );
                                            arr.push( config.imgPath + id + "1_pm.png" );
                                            arr.push( config.imgPath + id + "2_pm.png" );
                                        } else {
                                            arr.push( config.imgPath + id + "_pm.png" );
                                        }

                                        return arr;

                                    }
                                });
                            });

                            models[scSlug] = arr;

                    }
                });
            });
        });
        
        // Theming
		setTimeout(appendToPage(categories, sub_categories, models), 500);
		//setTimeout(app._fixProductContainerHeight,750)
        
        
        //app._fixTabsWidth();
        //app._setItemActive( urlhash );
};

var appendToPage = function appendToPage(categories, sub_categories, models){
	$("div.headlineContent ul").html( _.template($("#template-headline").html(), categories) );
    $("#tab-products").html( _.template($("#template-tab-products").html(), sub_categories) );
    $("#tab-internal-content").html( _.template($("#template-tab-pane").html(), sub_categories) );
     
	setTimeout(addProducts(models), 500);  
    
};

var addProducts = function addProducts(models){
	$('#tab-internal-content > div').each(function( i ) {
		products = models[$(this).attr('id')];
		$(this).html( _.template($("#template-product-item").html(), products) );  								                  
    });
	
};
