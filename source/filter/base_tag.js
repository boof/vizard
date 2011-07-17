(function(filter) {

	function build(vizard) {
		if ( vizard.is('XHTML') ) {
			return '<base href="' + vizard.href + '" />';
		} else {
			return '<base href="' + vizard.href + '">';
		}
	}

	// force assets to be loaded correctly...
	function insertBASE( source ) {
		var broken = source.split('</title>', 2);

		broken[1] = build( this ) + broken[1];

		return broken.join('</title>');
	};
	function removeBASE( source ) {
		return source.replace( build( this ), '' );
	}

	filter.insertBASE = insertBASE;
	filter.removeBASE = removeBASE;

})(Vizard.Filter);
