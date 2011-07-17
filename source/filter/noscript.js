// Note: This filter only works for SCRIPT tags with known TYPE values!
(function(filter) {

	// script types could be evaluated
	var SCRIPT_TYPEs   = /type=["'](?:text|application)\/(?:x-)?(?:j(?:ava)?|ecma)script["']/g
	  , noSCRIPT_TYPE  = 'type="text/noscript+javascript"'
	  , noSCRIPT_TYPEs = /type="text\/noscript\+javascript"/g
	  , SCRIPT_TYPE    = 'type="text/javascript"';

	function disableSCRIPT( source ) {
		return source.replace( SCRIPT_TYPEs, noSCRIPT_TYPE );
	}
	function enableSCRIPT( source ) {
		return source.replace( noSCRIPT_TYPEs, SCRIPT_TYPE);
	}

	filter.disableSCRIPT = disableSCRIPT;
	filter.enableSCRIPT  = enableSCRIPT;

})(Vizard.Filter);
