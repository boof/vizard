(function(Vizard) {

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
	Parameters.prototype.toString = function() {
		var pairs = [], pair;

		for ( var param in this ) {
			if ( !this.hasOwnProperty( param ) ) { continue; }

			pair = ''.concat(
				encodeURIComponent( param ), '=',
				encodeURIComponent( this[param] )
			);

			pairs.push( pair );
		}

		return '?' + pairs.join('&');
	};
	function Location(href) {
		var a = document.createElement('a');
		a.href = href;

		this.host = a.host;
		this.hostname = a.hostname;
		this.href = a.href;
		this.pathname = a.pathname;
		this.port = a.port;
		this.protocol = a.protocol;
		this.search = a.search;

		this.parameters = new Parameters(search);

		__proto__: window.location.__proto__;

		return this;
	}

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

	Vizard.Location = Location;
	Vizard.Parameters = Parameters;

	Vizard.Filter = {};
	Vizard.Filter.Chain = FilterChain;

	Vizard.entitle = entitle;

})(Vizard);
