(function($) {
    $(function() {
		$('#faq').on('click', '.lightbox', function(e){
			e.preventDefault();
			var data = $(this).attr('data-details');	
			$('body').append('<div id="overlay"></div><div class="modal"><div class="close-me">X</div>'+data+'</div>');	
			$('.modal').on('click', '.close-me', function(){
				$('#overlay, .modal').remove();
			});	
		});
    });
})(jQuery);