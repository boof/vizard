var Vizard = (function($) {

$.window   = $( window );
$.document = $( document );

function Vizard( display, href, handler ) {
	var vizard  = this
	  , context = window.document
	  , document;

	display  = $( display );
	
	document = display.contents().get(0);

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

	display.data('vizard', vizard).one('load', function() {
		vizard.document    = document;
		vizard.styleSheets = document.styleSheets;

		display.show();
		vizard.setState( Vizard.INTERACTIVE );

		vizard.control( document.body );
		vizard.reset();

		$.window.resize();

		vizard.setState( Vizard.COMPLETE );
	});

	var sheet = $('<style type="text/css">').appendTo('head').get(0).sheet;
	vizard.styleSheet = sheet;

	vizard.addStyle('body', 'overflow: hidden;');
	vizard.addStyle('.control', 'display: block; position: absolute;');

	$.ajax( href, {
		dataType: 'text',
		success: function(source, status, jqXHR) {
			vizard.contentType = jqXHR.getResponseHeader('Content-Type');
			vizard.source      = vizard.inputFilter(source);
			vizard.setState( Vizard.LOADED );

			document.open();
			document.write( vizard.source );
			document.close();
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
