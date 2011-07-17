(function(Vizard) {

	function toString() {
		return '<!DOCTYPE ' + this.name + ' PUBLIC "' + this.publicId + '" ' + '"' + this.systemId + '">';
	}

	var doctypes = {};

	doctypes['<!doctype html public "-//w3c//dtd html 4.01//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD HTML 4.01//EN"',
		systemId: '"http://www.w3.org/TR/html4/strict.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['<!doctype html public "-//w3c//dtd html 4.01 transitional//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD HTML 4.01 Transitional//EN"',
		systemId: '"http://www.w3.org/TR/html4/loose.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['<!doctype html public "-//w3c//dtd html 4.01 frameset//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD HTML 4.01 Frameset//EN"',
		systemId: '"http://www.w3.org/TR/html4/frameset.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['<!doctype html>'] = {
		name: 'html',
		publicId: '',
		systemId: '',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: function() { return '<!DOCTYPE html>'; }
	};
	doctypes['<!doctype html public "-//w3c//dtd xhtml 1.0 strict//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD XHTML 1.0 Strict//EN"',
		systemId: '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['<!doctype html public "-//w3c//dtd xhtml 1.0 transitional//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD XHTML 1.0 Transitional//EN"',
		systemId: '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['<!doctype html public "-//w3c//dtd xhtml 1.0 frameset//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD XHTML 1.0 Frameset//EN"',
		systemId: '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['<!doctype html public "-//w3c//dtd xhtml 1.1//en'] = {
		name: 'html',
		publicId: '"-//W3C//DTD XHTML 1.1//EN"',
		systemId: '"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};

	Vizard.doctype = function( source ) {
		var firstLine = source.split("\n", 1).toString().toLowerCase()
		  , doctype;

		for (var doctypeFragment in doctypes) {
			if ( firstLine.indexOf(doctypeFragment) < 0 ) { continue; }
			return doctypes[doctypeFragment];
		}

		if ( confirm('Fallback to "HTML 4.01 Transitional"?') ) {
			return doctypes['<!doctype html public "-//w3c//dtd html 4.01 transitional//en'];
		} else {
			alert('Documents without doctype cause unpredictable rendering issues.');
			return null;
		}
	};

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
