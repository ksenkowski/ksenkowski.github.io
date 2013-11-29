(function($) {
    $(function() {

        $(document).on('click', '#tab-products li, #main-banner-tabs li', function (e) {
            e.preventDefault();
            $(this).find("a").tab('show');
        });
        
    });
})(jQuery);