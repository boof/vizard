var Vizard = (function($) {

$.window   = $( window );
$.document = $( document );

function Vizard( display, href, handler ) {
	var vizard  = this
	  , context = window.document
	  , document;

	display  = $( display );
	
	document = display.contents().get(0);
	document.open();
	document.close();

	vizard.display  = display;
	vizard.location = new Vizard.Location( href );
	vizard.href     = vizard.location.href;
	vizard.handler  = handler;

	vizard.inputFilter  = new Vizard.Filter.Chain();
	vizard.inputFilter.push(
		Vizard.Filter.assignDOCTYPE,
		Vizard.Filter.insertBASE,
		Vizard.Filter.disableSCRIPT
	);

	vizard.outputFilter = new Vizard.Filter.Chain();
	vizard.outputFilter.push(
		Vizard.Filter.enableSCRIPT,
		Vizard.Filter.removeBASE,
		Vizard.Filter.writeDOCTYPE
	);

	display.data('vizard', vizard).bind({
		load: function() {
			if ( vizard.readyState !== Vizard.LOADED ) { return; }

			vizard.document    = document = display.contents().get(0);
			vizard.styleSheets = document.styleSheets;

			display.css('display', 'block');
			vizard.setState( Vizard.INTERACTIVE );
		},
		'readystatechange.Vizard': function(e, state) {
			if ( typeof console == 'object' ) { console.log(state); }

			switch (state) {

				case Vizard.LOADED:
					document.open();
					document.write( vizard.source );
					document.close();
				break;

				case Vizard.INTERACTIVE:
					vizard.controls.remove();
					vizard.controls = Vizard.fn.controls;
					vizard.control( document.body );
					vizard.reset();

					vizard.setState( Vizard.COMPLETE );

					$.window.resize();
				break;

				default: break;
			}
		}
	});

	$.ajax( href, {
		dataType: 'text',
		success: function(source, status, jqXHR) {
			vizard.contentType = jqXHR.getResponseHeader('Content-Type');
			vizard.source      = vizard.inputFilter(source);
			vizard.setState( Vizard.LOADED );
		}
	});

	vizard.setState( Vizard.LOADING );

	return vizard;
}

$.ajaxSetup({
	cache: false,
	xhrFields: { 'withCredentials': true }
});
window.xhtmlFormatting = 'disabled';
Vizard.jQuery = $;

return Vizard;

})( jQuery.sub() );
