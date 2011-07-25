(function(Vizard) {

	var $ = Vizard.jQuery;

	function overlay(id, target) {
		var $$;

		$.window.bind('resize.Vizard', function(e, height) {
			$$.height( height );
		});

		$$ = $('<div class="vizard-ui-overlay">');
		$$.attr('id', id);

		return $$;
	}
	Vizard.UI.overlay = overlay;

})(Vizard);
