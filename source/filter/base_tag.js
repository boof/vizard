(function(filter) {

	// force assets to be loaded correctly...
	function insertBASE( source ) {
		var broken  = source.split('</title>', 2)
		  , tagBASE = '<base href="' + this.href + '" />'; // FIXME only ' />' if XHTML

		broken[1] = tagBASE + broken[1];

		return broken.join('</title>');
	};

	filter.insertBASE = insertBASE;

})(Vizard.Filter);
