(function(Vizard) {

	var $ = Vizard.jQuery;

	function display(id, eventHandler) {
		var $$, target;

		$$ = $('<iframe class="vizard-ui-display" frameborder="0">');
		$$.attr('id', id);

		$.window.resize(function() {
			$$.height( target.height() );
			$$.width( target.width() );
		});
		$$.load(function() { target = $( $$.contents().get(0).body ); });

		if ( eventHandler ) {
			$$.bind('readystatechange.Vizard', eventHandler);
		}

		return $$;
	}
	Vizard.UI.display = display;

})(Vizard);
