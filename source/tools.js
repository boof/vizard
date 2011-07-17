(function(Vizard) {

	Vizard.entitle = function( title, ownerDocument ) {
		ownerDocument = ownerDocument || document;
		ownerDocument.title = title;
		Vizard.jQuery( 'title', ownerDocument ).html( title );
	};

	function FilterChain() {
		var filters = [];

		function chain(last) {
			for ( var i = 0, ii = filters.length; i < ii; i++ ) {
				last = filters[i].call( this, last );
				if ( last === false ) i = ii;
			}
			return last;
		}

		chain.unshift = function() {
			for ( var i = 0, ii = arguments.length; i < ii; i++ ) {
				filters.splice(0, 0, arguments[i]);
			}
			return this;
		};
		chain.push = function() {
			for ( var i = 0, ii = arguments.length; i < ii; i++ ) {
				filters.splice(filters.length, 0, arguments[i]);
			}
			return this;
		};

		return chain;
	}

	Vizard.Filter = {};
	Vizard.Filter.Chain = FilterChain;

})(Vizard);
