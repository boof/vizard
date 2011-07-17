var Vizard = (function(jQuery) {

var Vizard
  , $ = jQuery.sub()
  , w = $( window );

Vizard = function( display, href, handler ) {
	var vizard = this
	  , document;

	display  = $( display );
	document = display.contents().get(0);

	vizard.display  = display;
	vizard.href     = href;
	vizard.handler  = handler;

	vizard.inputFilter  = new Vizard.Filter.Chain();
	vizard.inputFilter.push( Vizard.Filter.insertBASE, Vizard.Filter.disableSCRIPT );

	vizard.outputFilter = new Vizard.Filter.Chain();
	vizard.outputFilter.push( Vizard.Filter.removeBASE, Vizard.Filter.enableSCRIPT );

	function refit() {
		var height;

		// in IE scrollbars appear when reducing height even when the
		// document itself does not require that much...
		display.attr('style', 'display: block;');

		height = $( document ).height();
		height = w.height() > height ? w.height() : height;

		display.css('height', height);
	}
	vizard.refit = refit;

	display.data('vizard', vizard).one('load', function() {
		vizard.document    = document;
		vizard.styleSheets = document.styleSheets;

		w.resize( refit ); // reset height of display if window resizes
		display.show();
		vizard.setState( Vizard.INTERACTIVE );

		vizard.control( document.body );
		vizard.reset();
		vizard.setState( Vizard.COMPLETE );
	});

	$.ajax( href, {
		dataType: 'text',
		success: function(source, status, jqXHR) {
			vizard.contentType = jqXHR.getResponseHeader('Content-Type');
			vizard.doctype     = Vizard.doctype(source);
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

})(jQuery);
