(function(Vizard) {

	var $ = Vizard.jQuery;

	function overlay(id, target) {
		var $$;

		$.window.resize(function() { $$.height( target.height() ); });

		$$ = $('<div class="vizard-ui-overlay">');
		$$.attr('id', id);

		return $$;
	}
	Vizard.UI.overlay = overlay;

})(Vizard);
