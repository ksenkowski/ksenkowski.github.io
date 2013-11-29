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
});


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
                        $('.headlineContent ul').append('<li><a href="#" class="load-products" data-slug="#' + cSlug + '">' + cName + '</a></li>');
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

                            if (urlhash.indexOf(scSlug) > -1) {
                                $('.tab-content').append('<div class="clearfix ' + scSlug + ' tab-pane active"></div>');
                            } 
							
                            $(this).find('Model').each(function() {
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
								
								
								models += '<div class="product-item">';
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
            if ($('.hidden').length === $('.tabs').length) {
                $('.tabs:first').removeClass('hidden');
            }

        },
        error: function(errorThrown) {
            console.log(errorThrown);
        }

    });

};