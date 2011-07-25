(function($, Vizard) {

	$.fn.vizard = function( href, handler ) {
		var args = arguments, result = this;

		this.each(function() {
			var vizard = $( this ).data('vizard');

			if ( vizard ) {
				if ( args.length > 0 ) {
					var funcName = arguments[0]
					  , funcArgs = Array.prototype['slice'].call(arguments, 1);

					result = vizard[ funcName ].apply( vizard, funcArgs );
				}

				result = vizard;
				return false;
			}

			new Vizard( this, href, handler );
			return true;
		});

		return result;
	};

})(jQuery, Vizard);
