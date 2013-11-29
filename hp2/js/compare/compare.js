
//jQuery.noConflict();
(function($) {

    var app = (typeof app !== "undefined" && app != null) ? app : {
        config: {
            imgPath: 'http://h20386.www2.hp.com/AustraliaStore/images/AUOLS_R2/images/product/',
            currency: "AU$",
            category: null,
            xmlFile : '/xml/category/productCatalog.xml',
        },
        
        loadProducts : function() {
            var config = this.config;
            
            return this._getXML( config.xmlFile );
        },
        
        _getXML: function( xmlFile ) {
            $.ajax({
                url: xmlFile,
                type: "GET",
                dataType: 'xml',
                success: function(data) {
                    var products_ids = app._getProductIdsUrl();
                    products = [];
                    main_category = "";
                    global = [];
                    
                    $(data).find('Model').each( function( i ) {
                        var $this = $(this);
                        var current_id = $this.attr('part');
                        
                        if( $.inArray(current_id, products_ids) != -1 ) {
                            var current_category = $this.parents('Category').attr('group');
                            
                            if( main_category == "" ) {
                                main_category = $this.parents('Category').attr('group');
                                global['compressed_specs'] = ( main_category == 'monitors' || main_category == 'printers' );
                            }
                            
                            if( current_category != main_category ) {
                                return;
                            }
                            
                            this.price = function() {
                                var price = $this.find('price').text().split('.');
                                return price[0];
                            }
                            this.decimals = function() {
                                var price = $this.find('price').text().split('.');
                                return typeof price[1] === 'undefined' ? "00" : price[1];
                            }
                            this.os = function () {
                                var os = $this.find('feature.os').text().split('(');
                                return os[0];
                            }
                            this.os_text = function () {
                                var os = $this.find('feature.os').text().split('(');
                                if( typeof os[1] != "undefined" ) {
                                    return "(" + os[1];
                                }
                            }
                            this.hard_disk = function () {
                                var hdd = $this.find('feature.hdd').attr('size');
                                if( hdd >= 1000 ) {
                                    return (hdd / 1000) + "TB";
                                } else {
                                    return hdd + "GB";
                                }
                            }
                            this.screen = function () {
                                var screen = $this.find('feature.screen').attr('size');
                                if( typeof screen == "undefined" ) {
                                    console.log("here");
                                    return "";
                                } else {
                                    return screen + '"';
                                }
                            }
                            
                            products.push(this);
                        }
                    });
                    
                    $(".carousel-inner").html( _.template( $("#template-carousel-products").html(), products ));
                    $(".products-specs").html( _.template( $("#template-products-specs").html(), products, global ));
                    
                    app._wrapItemsCarousel();
                    app._carouselInfoNumbers();
                    app._cloneItems();
                    app._setActiveSpecs();
                    app._setStatusFilters();
                },
                error: function( error ) {
                    console.log( error );
                },
            });

        },
        
        _setStatusFilters : function() {
            if( global.compressed_specs ) {
                $("div.options").find("input[name^='cpu'], input[name^='hdd'], input[name^='memory'], input[name^='screen']").each(function() {
                    $(this).attr('disabled', 'disabled');
                    $(this).next('label').addClass('disabled');
                });
            }
        },
        
        _wrapItemsCarousel : function () {
            var divs = $(".product-item");
            for( var i = 0; i < divs.length; i += 3 ) {
                divs.slice(i, i+3).wrapAll("<div class='item'></div>");
            }
            
            $(".item:first").addClass('active');
        },
        
        _cloneItems : function() {
            $('.carousel .item:last').each(function() {
                var $this = $(this);
                var childrens = $this.children().length;
                if (childrens < 3) {
                    var amount_items = 3 - childrens;
                    var items = $this.prev().find('.product-item').slice(-amount_items);

                    $(items.get().reverse()).each(function() {
                        $(this).clone().addClass('cloned-item').prependTo($this);
                    });
                }
            });
        },
        
        _carouselInfoNumbers : function () {
            $("#span-total-items").text( $(".product-item").length );
            $("#span-current-item").text( $(".product-item:visible").length );
        },
        
        _getProductIdsUrl: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++)
            {
                if( i <= 3 ) {
                    hash = hashes[i].split('=');
                    if (hash[0] == 'compare[]') {
                        vars.push(hash[1]);
                    }
                }
            }
            
            return vars;
        },
        
        _setActiveSpecs : function () {
            $("li[class^='specs-']").removeClass('active');
            
            $(".product-item:visible").each(function() {
                var current_id = $(this).attr('id').substring(5);
                $("li.specs-"+current_id).addClass('active');
            });
        },
        
        _filterProducts : function() {
            var is_hdd = false,
                is_memory = false,
                is_screen = false,
                is_cpu = false;
            
            $("span[data-type='hdd']").removeClass('filter-active disabled');
            $("span[data-type='memory']").removeClass('filter-active disabled');
            $("span[data-type='cpu']").removeClass('filter-active disabled');
            $("span[data-type='screen']").removeClass('filter-active disabled');
            $("div.product-info:visible").removeClass('filter-active');
            
            $('input[id^="checkbox-filter"]:checked').each(function() {
                if( $(this).attr('name').indexOf('hdd') > -1 ) {
                    is_hdd = true;
                    var hdd_filter = $(this).val();
                    $("span[data-type='hdd']:visible").each(function() {
                        var hdd_value = $(this).attr('data-value');
                        if( hdd_filter == "-250" && ( hdd_value <= 250 ) ) {
                            $(this).addClass('filter-active');
                        }
                        if( hdd_filter == "250-320" && (hdd_value > 250 && hdd_value <= 320) ) {
                            $(this).addClass('filter-active');
                        }
                        if( hdd_filter == "500-750" && (hdd_value >= 500 && hdd_value <= 750) ) {
                            $(this).addClass('filter-active');
                        }
                        if( hdd_filter == "+1000" && (hdd_value >= 1000) ) {
                            $(this).addClass('filter-active');
                        }
                    });
                }
                if( $(this).attr('name').indexOf('memory') > -1 ) {
                    is_memory = true;
                    var memory_filter = $(this).val();
                    $("span[data-type='memory']:visible").each(function() {
                        var memory_value = $(this).attr('data-value');
                        if( memory_filter == "-1" && ( memory_value == 1 ) ) {
                            $(this).addClass('filter-active');
                        }
                        if( memory_filter == "2" && (memory_value == 2) ) {
                            $(this).addClass('filter-active');
                        }
                        if( memory_filter == "+4" && (memory_value >= 4) ) {
                            $(this).addClass('filter-active');
                        }
                    });
                }
                if( $(this).attr('name').indexOf('cpu') > -1 ) {
                    is_cpu = true;
                    var cpu_filter = $(this).val();
                    $("span[data-type='cpu']:visible").each(function() {
                        var cpu_value = $(this).attr('data-value');
                        if( cpu_filter == "-1.6" && ( cpu_value <= 1.6 ) ) {
                            $(this).addClass('filter-active');
                        }
                        if( cpu_filter == "1.6-1.8" && (cpu_value > 1.6 && cpu_value <= 1.8) ) {
                            $(this).addClass('filter-active');
                        }
                        if( cpu_filter == "2.13-2.53" && (cpu_value >= 2.13 && cpu_value <= 2.53) ) {
                            $(this).addClass('filter-active');
                        }
                        if( cpu_filter == "+2.56" && (cpu_value >= 2.56) ) {
                            $(this).addClass('filter-active');
                        }
                    });
                }
                if( $(this).attr('name').indexOf('screen') > -1 ) {
                    is_screen = true;
                    var screen_filter = $(this).val();
                    $("span[data-type='screen']:visible").each(function() {
                        var screen_value = $(this).attr('data-value');
                        if( screen_filter == "-12" && ( screen_value < 12 ) ) {
                            $(this).addClass('filter-active');
                        }
                        if( screen_filter == "12-14.5" && (screen_value >= 12 && screen_value <= 14.5) ) {
                            $(this).addClass('filter-active');
                        }
                        if( screen_filter == "15-15.6" && (screen_value >= 15 && screen_value <= 15.6) ) {
                            $(this).addClass('filter-active');
                        }
                        if( screen_filter == "+17" && (screen_value >= 17) ) {
                            $(this).addClass('filter-active');
                        }
                    });
                }
                if( $(this).attr('name').indexOf('price') > -1 ) {
                    var price_filter = $(this).val();
                    $("div.product-info:visible").each(function() {
                        var price_value = parseInt($(this).find(".price span.amount").text().replace(/,/g, "") + $(this).find(".price span.decimal").text());
                        if( price_filter == "-1000" && ( price_value < 1000 ) ) {
                            $(this).addClass('filter-active');
                        }
                        if( price_filter == "1000-1499.99" && (price_value >= 1000 && price_value <= 1499.99) ) {
                            $(this).addClass('filter-active');
                        }
                        if( price_filter == "1500-1999.99" && (price_value >= 1500 && price_value <= 1999.99) ) {
                            $(this).addClass('filter-active');
                        }
                        if( price_filter == "+2000" && (price_value >= 2000) ) {
                            $(this).addClass('filter-active');
                        }
                    });
                }
            });
            
            if( is_hdd ) { $("span[data-type='hdd']:not(.filter-active)").addClass('disabled'); }
            if( is_memory ) { $("span[data-type='memory']:not(.filter-active)").addClass('disabled'); }
            if( is_cpu ) { $("span[data-type='cpu']:not(.filter-active)").addClass('disabled'); }
            if( is_screen ) { $("span[data-type='screen']:not(.filter-active)").addClass('disabled'); }
        },
        
        _removeItem : function( obj ) {
            var item = obj.parents('.product-item');
            var is_clone = item.hasClass('cloned-item');
            
            if( is_clone ) {
                var obj_id = item.attr('id');
                $("#" + obj_id ).remove();
            }
            
            item.remove();
            $(".product-item.cloned-item").remove();
            
            if( $('.item.active').children().length > 1 ) {
                $(".item:not(.active)").children().clone().insertAfter( $('.item.active').children().last() );
                $(".item:not(.active)").remove();
            } else {
                $(".carousel-controls.left").trigger('click');
                $(".item.active").children().clone().insertAfter( $(".item:not(.active)").children().last() );
                $(".item.active").remove();
            }
            
            app._carouselInfoNumbers();
            app._setActiveSpecs();
        }
    }

    $(function() {
        $(document).on('click', 'input[id^="checkbox-filter"]', function(e) {
            var span = $(this).siblings("span");
            if ($(this).is(":checked")) {
                span.removeClass().addClass("global-checkbox-checked");
            } else {
                span.removeClass().addClass("global-checkbox");
            }
            
            app._filterProducts();
        });

        $(document).on('click', 'span[id^="filter-"]', function(e) {
            var checkbox = $(this).siblings('input[type="checkbox"]');
            var label = $(this).siblings("label");

            label.trigger("click");
            if (checkbox.is(":checked")) {
                $(this).removeClass().addClass("global-checkbox-checked");
            } else {
                $(this).removeClass().addClass("global-checkbox");
            }
            
            app._filterProducts();
        });

        $(document).on('click', ".header-text a.link-more", function(e) {
            var $this = $(this);
            e.preventDefault();
            $(".filters-options").slideToggle(function() {
                if ($(this).is(":visible")) {
                    $this.find("span.text").text("Hide features");
                    $this.find("span[class^='global-']").removeClass().addClass('global-link-more-top');
                } else {
                    $this.find("span.text").text("Show features");
                    $this.find("span[class^='global-']").removeClass().addClass('global-link-more-bottom');
                }
            });
        });

        $(document).on('click', ".reset-link a", function(e) {
            e.preventDefault();
            $("span.global-checkbox-checked").trigger('click');
        });

        $("#compare-products").carousel({
            interval: false,
        });
        
        $("#compare-products").bind('slid', function() {
            app._setActiveSpecs();
            app._filterProducts();
        });
        
        $(document).on('click', ".close-product span.global-close", function(e) {
            app._removeItem( $(this) );
        });
        
        app.loadProducts();
    });
})(jQuery);
window.onload = function() {
};
