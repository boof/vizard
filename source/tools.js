(function(Vizard) {

	Vizard.location = {
		host: location.host,
		hostname: location.hostname,
		href: location.href,
		pathname: location.pathname,
		port: location.port,
		protocol: location.protocol,
		search: location.search,

		__proto__: location.__proto__
	};

	function Parameters(search) {
		var pairs = search.slice(1).split('&');
		var param, value;

		if (search === '') { return this; }

		for (var i = 0, ii = pairs.length; i < ii; i++) {
			param = pairs[i].split('=', 1);
			value = pairs[i].split('=').slice(1).join('=');

			this[ decodeURIComponent( param ) ] = decodeURIComponent( value );
		}

		return this;
	}
	Vizard.Parameters = function() {
		return new Parameters( this.location.search );
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

	function entitle( title, ownerDocument ) {
		ownerDocument = ownerDocument || document;
		ownerDocument.title = title;
		Vizard.jQuery( 'title', ownerDocument ).html( title );
	}
	Vizard.entitle = entitle;

	Vizard.Filter = {};
	Vizard.Filter.Chain = FilterChain;

})(Vizard);
