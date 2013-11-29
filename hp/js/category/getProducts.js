$(document).ready(function() {
    $(window).hashchange(function() {
        var hash = location.hash;
        if (!hash) {
            hash = '#for-home-desktop/aio'
        }
        getProducts(hash);
    });

    $(window).hashchange();
    $('#products-menu').on('click', '.load-products', function(e) {
        e.preventDefault();
        var data = $(this).attr('data-slug');
        location.hash = data;
        getProducts(data);
        return false;
    });
    $(document).on('click', '.compare input[type="checkbox"]', function (e) {
         var span = $(this).siblings("span");
         if( $(this).is(":checked") ) {
             span.removeClass().addClass("global-checkbox-checked");
         } else {
             span.removeClass().addClass("global-checkbox");
         }
         
         amountItemsCompare();
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
         
         amountItemsCompare();
     });
     $(document).on('click', '.tab-pane.active .view-more a', function (e) {
         e.preventDefault();
         $(this).parent().siblings(".product-item.hide").removeClass('hide');
         app._fixProductContainerHeight();
         $(this).hide();
     });
});


var getProducts = function getProductsF(urlhash) {
    //These two change for each country
    var imgPath = 'http://h20386.www2.hp.com/AustraliaStore/images/AUOLS_R2/images/product/';
    var currency = "HK$";
    var category;
    var scCount = 0;

    //CLEANED THIS UP
    if (urlhash.indexOf('tablet-laptop') > -1) {
        category = 'tablet-laptop';
    } else if (urlhash.indexOf('printers') > -1) {
        category = 'printers';
    } else if (urlhash.indexOf('monitors') > -1) {
        category = 'monitors';
    } else if (urlhash.indexOf('desktop') > -1) {
        category = 'desktop';
    } else {
        category = 'desktop';
    }
    //END CLEAN UP
	
    $.ajax({
        url: 'xml/category/productCatalog.xml',
        type: "GET",
        dataType: 'xml',
        success: function(data) {
            $('.headlineContent ul, #tab-products, .tab-content').empty();
            $(data).find('ProductCatalog').each(function() {
				$(this).find('GroupTitle').each(function(){
					var title = $(this).attr('name');
					var groupTitle = $(this).attr('group');
					if(groupTitle == category){
						$('.headlineContent h1').text(title);
					}
				});
				
                $(this).find('Category').each(function() {
                    var group = $(this).attr('group');
                    var cName = $(this).attr('name');
                    var cSlug = $(this).attr('slug');
                   //Creates the Main Nav for the top of the page 
                    if (group == category) {
                        $('.headlineContent ul').append('<li><a href="#' + cSlug + '">' + cName + '</a></li>');
                    }
					
                    $(this).find('SubCategory').each(function() {
                        scCount++;
                        var scName = $(this).attr('name');
                        var scSlug = $(this).attr('slug');
						
						
                        if (urlhash.indexOf('#' + cSlug) > -1) {
                            //Creates Tab/Slider Sub Menu Thing
							var tabs = '';
                            //SORTED OUT CONDITIONAL FOR SUBTABS
                            if (scSlug == 'no-tab') {

                            } else {
								tabs += '<li';
								
								if(urlhash == '#' + cSlug + '/' + scSlug){
									tabs += ' class="active"';
								}else{
									
								}
								tabs += '><a href="#' + cSlug + '/' + scSlug + '" data-slug="#' + cSlug + '/' + scSlug + '" class="load-products">' + scName + '</a></li>';
                                $('#tab-products').append(tabs);
								//add check if there is no active class on the li to add one to the first.
                            }
                            //END SORTED OUT CONDITIONAL FOR SUBTABS

                                $('.tab-content').append('<div class="clearfix ' + scSlug + ' tab-pane active"></div>');
							
                            $(this).find('Model').each(function(i) {
								var models = '';
                                var slug = '#' + cSlug;
                                var modelName = $(this).attr('name');
                                var gallery = $(this).attr('gallery');
                                var imageBase = $(this).attr('prodimg');
								var usualPrice = $(this).find('usualprice').text();
								var productPrice = $(this).find('price').text();
								var top = $(this).find('top').attr('rate');
								var topValue = $(top).text();
								var id = $(this).attr('part');
								var features = $(this).find('top').text();
								var fullSpec = $(this).find('fullspec');
								var fullSpecText = $(fullSpec).attr('text');
								var fullSpecURL = $(fullSpec).text();
                                //Adds the Models to "tabs" 
								var fullSpec = $(this).find('fullspec');
								var fullSpecText = $(fullSpec).attr('text');
								var fullSpecURL = $(fullSpec).text();
								var wishlist = $(this).find('wishlist');
								var wishlistText = $(wishlist).attr('text');
								var wishlistURL = $(wishlist).text();
								var buynow = $(this).find('buynow');
								var buynowText = $(buynow).attr('text');
								var buynowURL = $(buynow).text();
								var features = $(this).find('features').children();
								
								if(i >3){
									models += '<div class="product-item hide">';
								}else{
									models += '<div class="product-item">';
								}
								
								models += '<div class="product-container">';
								if(top == 'true'){
									models += '<div class="global-ribbon-top-voted">'+topValue+'</div>';
								}
								models += '<div class="compare">';
								models += '<label for="compare-'+id+'">Compare</label>';
								models += '<span class="global-checkbox" id="checkbox-'+id+'"></span>';
								models += '<input class="compare" type="checkbox" id="compare-'+id+'" name="compare[]" value="'+id+'">';
								models += '</div>';
								
								models += '<div id="carousel-'+id+'" class="carousel slide">';
								models += '<div class="carousel-inner">';
   								
                                if (gallery == '3') {
                                    //Create the mini-gallery here. Only some products have a gallery
                                    //Images follow the following pattern
                                    // imgPath + imageBase + _pm.png (for primary image), + 1_pm.png (for next thumb), + 2_pm.png (for last thumb)
 									models += '<div class="item active"><img src="'+imgPath+imageBase+'_pm.png" alt="'+modelName+'"/></div>';
									models += '<div class="item"><img src="'+imgPath+imageBase+'1_pm.png" alt="'+modelName+'"/></div>';
									models += '<div class="item"><img src="'+imgPath+imageBase+'2_pm.png" alt="'+modelName+'"/></div></div>';
									models += '<a class="global-arrow-left controls" href="#carousel-'+id+'" data-slide="prev"></a>';
			                        models += '<a class="global-arrow-right controls" href="#carousel-'+id+'" data-slide="next"></a>';
                               } else {
                                    //just output single image
									models += '<div class="item active"><img src="'+imgPath+imageBase+'_pm.png" alt="'+modelName+'"/></div>';
                               }
								models += '</div></div>';
								
								models += '<h3>'+modelName+'</h3><ul>';
								//Add Features Here
								$(features).each(function(key,value){
									var feature = $(value).text();
									models += '<li class="child">'+feature+'</li>';
								});
								models += '</ul>'
								
								models += '<div class="clearfix"></div></div>';
								models += '<div class="product-price">';
								models += '<div class="price">';
									if(usualPrice != ''){
										models += '<span class="legend">Starting at <strong class="line-through">'+currency + usualPrice + '</strong></span>';
									}
								models += '<span class="currency">'+currency+'</span>';
								models += '<span class="amount">'+productPrice.split('.')[0]+'</span>';
								if(!productPrice.split('.')[1]){
									models += '<span class="decimal">00</span>';
									
								}else{
									models += '<span class="decimal">'+productPrice.split('.')[1]+'</span>';									
								}
								models += '</div>';
								models += '<div class="links-product">';
								models += '<a href="'+fullSpecURL+'">'+fullSpecText+'</a>';
								models += '<a href="'+wishlistURL+'">'+wishlistText+'</a></div></div>';
								models += '<div class="product-add-cart"><a href="'+buynowURL+'">'+buynowText+'</a></div>';
								
                             $('.' + scSlug).append(models);

                            });

                        }

                    });
                });
            });
			var length = $('.product-item').length;
			var viewMore = '<div class="view-more"><a href="#" class="link-more">View all <span class="global-view-all"></span></a></div>';
			if (length > 4){
				$('.tab-pane').append(viewMore);
			}
 		setTimeout(fixProductContainerHeight,250);	
        },
        error: function(errorThrown) {
            console.log(errorThrown);
        }

    });

};

var fixProductContainerHeight =  function fixProductContainerHeightF() {
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
	setTimeout(fixTabsWidth,250);
};
var fixTabsWidth = function fixTabsWidthF() {
    var ul = $("ul#tab-products"),
        ul_width = ul.width(),
        total_items = ul.find("li").length,
        margin = (total_items - 1) * 2;

    return ul.find("li").width( (ul_width - margin ) / total_items );
};

var setItemActive = function setItemActiveF( hash ) {
    
    $(".headlineContent ul li").each( function() {
        $(this).removeClass('active');
        
        var current_hash = $(this).find("a").attr('data-slug');
        if( current_hash == hash.substring(1) ) {
            $(this).addClass('active');
        }
    });
	$("#tab-products li a[href='#"+ hash.split('/')[1] +"']").tab('show');
	
};
var amountItemsCompare = function amountItemsCompareF() {
    var amount = parseInt( $('.compare input[type="checkbox"]:checked').length );
    var button = $(".compare-info input");
    
    button.val("Compare ("+ amount +")");
    if( amount >= 2 ) {
        button.removeClass('btn-disabled').addClass('btn-primary');
    } else {
        button.removeClass('btn-primary').addClass('btn-disabled');
    }
};
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
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

