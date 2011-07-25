(function(Vizard) {

	var $ = Vizard.jQuery;

	function display(id, eventHandler) {
		var $$;

		$$ = $('<iframe class="vizard-ui-display" frameborder="0">');
		$$.attr('id', id);

		var target;
		$.window.resize(function() { $$.css( 'height', target.height() ); });
		$$.load(function() { target = $( $$.contents().get(0).body ); });

		if ( eventHandler ) {
			$$.bind('readystatechange.Vizard', eventHandler);
		}

		return $$;
	}
	Vizard.UI.display = display;

})(Vizard);
