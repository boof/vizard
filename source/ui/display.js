(function(Vizard) {

	var $  = Vizard.jQuery,
	    UI = Vizard.UI;

	function display(eventHandler) {
		var $$;

		$$ = $('<iframe class="vizard-ui-display" frameborder="0">');

		if ( eventHandler ) {
			$$.bind('readystatechange.Vizard', eventHandler);
		}

		return $$;
	}

	UI.addStyle('.vizard-ui-display',
		'display: none; border: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;'
	);


	UI.display = display;

})(Vizard);
