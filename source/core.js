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
	vizard.href     = href;
	vizard.location = new Vizard.Location( href );
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

		Vizard.jQuery.window.resize();

		vizard.setState( Vizard.COMPLETE );
	});

	var styleSheets = context.styleSheets
	  , styleSheet  = false;

	$('<style>').attr({ title: 'vizard', type: 'text/css' }).appendTo('head');

	for (var i = 0, ii = styleSheets.length; !styleSheet || i < ii; i++) {
		if ( styleSheets[i].title == 'vizard' ) styleSheet = styleSheets[i];
	}
	vizard.styleSheet = styleSheet;
	vizard.addStyle('body', 'overflow: hidden;');
	vizard.addStyle('#spinner', 'position: absolute; top: 50%; right: 50%; margin: -16px;');
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
};

$.ajaxSetup({
	cache: false,
	xhrFields: { 'withCredentials': true }
});
window.xhtmlFormatting = 'disabled';
Vizard.jQuery = $;

return Vizard;

})( jQuery.sub() );
