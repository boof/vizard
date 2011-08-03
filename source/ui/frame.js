(function(Vizard) {

	var $  = Vizard.jQuery
	  , UI = Vizard.UI;

	UI.addStyle('.vizard-ui-frame', {
		'overflow-x': 'scroll',
		'overflow-y': 'hidden',
		'position': 'absolute'
	});

	return UI.frame = function(element) {
		var $$    = $( element )
		  , frame = $('<div class="vizard-ui-frame">', element);

		$.window.resize(function() {
			// RADAR frame.parent().scrollTop()
			frame.width( $$.width() ).offset({
				left: $$.offset().left
			});
		});

		return frame.offset( $$.offset() ).width( $$.width() );
	};

})(Vizard);
