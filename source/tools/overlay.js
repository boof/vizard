(function(fn) {
	fn.overlay = function() {
		var element = this
		  , d       = $(document);

		$(window)
		.resize(function() {
			element.height( d.height() );
			element.width( d.width() );
		})
		.resize();

		return this;
	};
})(jQuery.fn);
