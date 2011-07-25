(function(Vizard) {

	var $      = Vizard.jQuery
	  , UI     = Vizard.UI
	  , remove = $.fn.remove
	  , layers = $();

	$.fn.remove = function() {
		this.each(function() {
			var $$ = $( this )
			  , fn = $$.data('remove');

			if ( $$.is('.layer') ) {
				if ( layers.length == 1 ) {
					layers = $();
					$('body').removeClass('disabled');
				} else {
					layers = layers.not( $$.attr('id') );
				}

				if ( fn ) { fn.call( this ); }
			}
		});

		return remove.apply(this, arguments);
	};

	UI.layer = function( target, fn ) {
		if ( layers.length == 0 ) $('body').addClass('disabled');

		var layer = $('<DIV CLASS="vizard-ui-layer">');
		layer.attr( 'id', 'layer-' + layers.length ).data( 'remove', fn );
		$.window.resize(function() { layer.height( target.height() ); });
		layers = layers.add( layer );

		layer.height( target.height() ).appendTo('body');

		return layer;
	};

})(Vizard);
