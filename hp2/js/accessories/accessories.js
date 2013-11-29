
//jQuery.noConflict();
(function($) {
    
    var app = (typeof app !== "undefined" && app != null) ? app : {

        config : {
            imgPath     : 'http://h20386.www2.hp.com/AustraliaStore/images/AUOLS_RS/custom/img/accessories/',
            currency    : "AU$",
            category    : null,
        },

        getProducts : function( urlhash ) {
            var config = this.config;
            
            
            //CLEANED THIS UP
            if (urlhash.indexOf('laptop') > -1) {
                config.category = 'laptops';
            } else if (urlhash.indexOf('desktop') > -1) {
                config.category = 'desktops';
            } else if (urlhash.indexOf('tablet') > -1) {
                config.category = 'tablets';
            } else if (urlhash.indexOf('printers') > -1) {
                config.category = 'printers';
            } else {
                config.category = 'laptops';
            }
            //END CLEAN UP
            
            return this.getXML("accessories.xml", config, urlhash);
        },

        getXML : function( xmlFile, config, urlhash ) {
            $.ajax({
                url: "/xml/accessories/" + xmlFile,
                type: "GET",
                dataType: 'xml',
                success : function( data ) {
                    
                    $(data).find('Accessories').each(function() {
                        categories = [];
                        sub_categories = new Object();
                        models = new Object();
                        $(this).find('Category').each(function(i) {
                            var group = $(this).attr('group');
                            var cName = $(this).attr('name');
                            var cSlug = $(this).attr('slug');

//                            if (group == config.category) {
                                categories[i] = {
                                    name: $(this).attr('name'), 
                                    slug: $(this).attr('slug') 
                                };
//                            }
                            
                            models[cSlug] = new Object();
                            sub_categories[cSlug] = [];
                            
                            var scCount = 0;
                            var arr = [];
                            $(this).find('SubCategory').each(function(j) {
                                scCount++;
                                var scName = $(this).attr('name');
                                var scSlug = $(this).attr('slug');
                                
                                
//                                if ( urlhash.indexOf('#' + cSlug) > -1 ) {
                                    if (scSlug != 'no-tab') {
                                        sub_categories[cSlug].push({
                                            category_slug       : cSlug,
                                            subcategory_slug    : scSlug,
                                            subcategory_name    : scName,
                                        });
                                    }
                                    
                                    $(this).find('Model').each( function(k) {
                                        var $this = $(this);
                                        arr.push({
                                            id : $this.attr('part'),
                                            subcategory : scSlug,
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
                                                    arr.push( config.imgPath + "acc_" + id + ".jpg" );
                                                } else {
                                                    arr.push( config.imgPath + "acc_" + id + ".jpg" );
                                                }
                                                
                                                return arr;
                                            }
                                        });
                                    });
                                    models[cSlug] = arr;
//                                }
                            });
                        });
                    });
                    
                    // Theming
                    $("#tab-products").html( _.template($("#template-tab-products").html(), categories) );
                    $("#tab-internal-content").html( _.template($("#template-tab-pane").html(), categories) );
                    
                    $('#tab-internal-content > div').each(function( i ) {
                        var current_category = $(this).attr('id');
                        products = models[current_category];
                        $(this).html( _.template($("#template-product-item").html(), products) );
                        
                        // Filters
                        filter_category = sub_categories[current_category];
                        $(this).find("div.filters ul").html( _.template($("#template-filters").html(), filter_category) );
                    });
                    
//                    app._fixProductContainerHeight();
                    app._fixTabsWidth();
                    app._setItemActive( urlhash );
                    
                    
        
                    var total_items = $(".product-item").length;
                    for( var i = 0; i < total_items; i++ ) {
                        if( i % 10 == 0 ) {
                            $(".product-item.item-" + i).addClass("extended");
                        }
                        var current_number = i.toString();
                        if( current_number.charAt( current_number.length - 1 ) == "6" ) {
                            $(".product-item.item-" + i).addClass("extended");
                        }
                    }
                    
                },
                error : function( error ) {
                    console.log( error );
                },
            });
        },
        
        _fixProductContainerHeight: function() {
            $(".tab-pane").each(function() {
                max_height = 0;
                $(this).find('.product-item').each( function() {
                    var container = $(this).find('.product-container');
                    var current_height = container.height();
                    
                    if( current_height > max_height ) {
                        max_height = current_height;
                    }
                });
                $(this).find('.product-item .product-container').height( max_height );
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
            $("#tab-products li a[href='"+ hash +"']").tab('show');
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
        
        _filterAccessories : function() {
            var filters = $(".tab-pane.active > div.filters input[type='checkbox']:checked");
            var viewmore_visible = $(".view-more a").is(":visible");
            
            if( filters.length == 0 ) {
                $(".tab-pane.active > .product-item.hide").removeClass("hide");
            } else {
                $(".tab-pane.active > .product-item.filter_show").removeClass("filter_show");
                filters.each(function( i ) {
                    var filter_id = $(this).val();
                    $(".tab-pane.active > .product-item.subcategory-"+filter_id).removeClass('hide').addClass('filter_show').removeClass('extended');
                });
                $(".tab-pane.active > .product-item:not(.filter_show)").addClass("hide");
            }
            $(".tab-pane.active > .view-more a").hide();
        },
    }
    
    $(function() {

        $(window).hashchange(function() {
            var hash = location.hash;
            if ( !hash ) {
                hash = '#laptops'
            }
            return app.getProducts( hash );
        });
        
        $(window).hashchange();

        
        $(document).on('click', '#tab-products li', function (e) {
            e.preventDefault();
            $(this).find("a").tab('show');
//            app._fixProductContainerHeight();
        });
        
        $(document).on('click', '.compare input[type="checkbox"], .tab-pane.active > div.filters input[type="checkbox"]', function (e) {
            var span = $(this).siblings("span");
            if( $(this).is(":checked") ) {
                span.removeClass().addClass("global-checkbox-checked");
            } else {
                span.removeClass().addClass("global-checkbox");
            }
            
            app._filterAccessories();
        });
        
        $(document).on('click', '.compare > span, .tab-pane.active > div.filters span[id^=filter]', function (e) {
            var checkbox = $(this).siblings('input[type="checkbox"]');
            var label = $(this).siblings("label");
            
            label.trigger("click");
            if( checkbox.is(":checked") ) {
                $(this).removeClass().addClass("global-checkbox-checked");
            } else {
                $(this).removeClass().addClass("global-checkbox");
            }
            
            app._filterAccessories();
        });
        
        $(document).on('click', '.tab-pane.active .view-more a', function (e) {
            e.preventDefault();
            $(this).parent().siblings(".product-item.hide").removeClass('hide');
//            app._fixProductContainerHeight();
            $(this).hide();
        });
    });
})(jQuery);