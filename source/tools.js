(function(Vizard) {

	function Parameters(search) {
		var parameterObj = this
		  , pairs, pair
		  , param, value;

		if (search === '') { return parameterObj; }

		pairs = search.slice(1).split('&');

		for (var i = 0, ii = pairs.length; i < ii; i++) {
			pair  = pairs[i].split('=');
			param = decodeURIComponent( pair[0] );
			value = decodeURIComponent( pair.slice(1).join('=') );

			parameterObj[ param ] = value;
		}

		return parameterObj;
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
		var location = this
		  , a = document.createElement('a');

		a.href = href;

		location.parameters = new Parameters(a.search);
		location.host       = a.host;
		location.hostname   = a.hostname;
		location.href       = a.href;
		location.pathname   = a.pathname;
		location.port       = a.port;
		location.protocol   = a.protocol;
		location.search     = a.search;
		location.__proto__  = window.location.__proto__;

		return location;
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

	Vizard.UI = {};

	Vizard.entitle = entitle;

})(Vizard);
