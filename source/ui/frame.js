(function(Vizard) {

	var $  = Vizard.jQuery
	  , UI = Vizard.UI;

	function frame(element) {
		var $$ = $( element );

		return $('<div class="vizard-ui-frame">', element).
			offset( $$.offset() ).
			width( $$.width() );
	}

	UI.addStyle('.vizard-ui-frame', 'overflow-x: scroll; overflow-y: hidden; position: absolute;');

	return UI.frame = frame;

})(Vizard);
