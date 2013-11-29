$(document).ready(function() {
    $(window).hashchange(function() {
        var hash = location.hash;
        if (!hash) {
            hash = '#for-home-desktop'
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
    var imgPath = 'http://h20386.www2.hp.com/HongKongStore/images/HKOLS_R2/images/product/';
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
        url: 'productCatalog.xml',
        type: "GET",
        dataType: 'xml',
        success: function(data) {
            $('#products-menu, .sub-categories, .models').empty();
            $(data).find('ProductCatalog').each(function() {

                $(this).find('Category').each(function() {
                    var group = $(this).attr('group');
                    var cName = $(this).attr('name');
                    var cSlug = $(this).attr('slug');

                    //Creates the Main Nav for the top of the page 
                    if (group == category) {
                        $('#products-menu').append('<span class="load-products" data-slug="#' + cSlug + '">' + cName + '</span>');
                    }

                    $(this).find('SubCategory').each(function() {
                        scCount++;
                        var scName = $(this).attr('name');
                        var scSlug = $(this).attr('slug');

                        if (urlhash.indexOf('#' + cSlug) > -1) {

                            //Creates Tab/Slider Sub Menu Thing

                            //SORTED OUT CONDITIONAL FOR SUBTABS
                            if (scSlug == 'no-tab') {

                            } else {
                                $('.sub-categories').append('<p><a href="#' + cSlug + '/' + scSlug + '" data-slug="#' + cSlug + '/' + scSlug + '" class="load-products">' + scName + '</a></p>');
                            }
                            //END SORTED OUT CONDITIONAL FOR SUBTABS

                            if (urlhash.indexOf(scSlug) > -1) {
                                $('.models').append('<div id="tab' + scCount + '" class="' + scSlug + ' tabs"></div>');
                            } else {
                                $('.models').append('<div id="tab' + scCount + '" class="' + scSlug + ' tabs hidden"></div>');
                            }
                            $(this).find('Model').each(function() {
                                var slug = '#' + cSlug;
                                var modelName = $(this).attr('name');
                                var gallery = $(this).attr('gallery');
                                var imageBase = $(this).attr('prodimg');


                                //Adds the Models to "tabs" 

                                $('.' + scSlug).append('<div><p>' + modelName + '</p></div>');

                                if (gallery == '3') {
                                    //Create the mini-gallery here. Only some products have a gallery
                                    //Images follow the following pattern
                                    // imgPath + imageBase + _pm.png (for primary image), + 1_pm.png (for next thumb), + 2_pm.png (for last thumb)
                                } else {
                                    //just output single image


                                }
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