(function($, Vizard) {

	$.fn.vizard = function( href, handler ) {
		this.each(function() {
			var vizard = $( this ).data('vizard');

			if ( vizard ) {
				if ( arguments.length > 0 ) {
					var funcName = arguments[0]
					  , funcArgs = Array.prototype['slice'].call(arguments, 1);

					return vizard[ funcName ].apply( vizard, funcArgs );
				}

				return vizard;
			}

			return new Vizard( this, href, handler );
		});

		return this;
	};

})(jQuery, Vizard);
