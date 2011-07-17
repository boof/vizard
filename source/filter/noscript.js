// Note: This filter only works for SCRIPT tags with known TYPE values!
(function(filter) {

	// script types could be evaluated
	var SCRIPT_TYPEs  = /type=["'](?:text|application)\/(?:x-)?(?:j(?:ava)?|ecma)script["']/g
	  , noSCRIPT_TYPE = 'type="text/noscript+javascript"';

	// disable SCRIPTs...
	function noSCRIPT( source ) {
		return source.replace( SCRIPT_TYPEs, noSCRIPT_TYPE );
	}

	filter.noSCRIPT = noSCRIPT;

})(Vizard.Filter);
