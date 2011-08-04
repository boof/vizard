(function(filter) {

	function toString() {
		return '<!DOCTYPE ' + this.name + ' PUBLIC "' + this.publicId + '" ' + '"' + this.systemId + '">';
	}

	var doctypes = {};

	doctypes['HTML 4.01'] = {
		name: 'html',
		publicId: '-//W3C//DTD HTML 4.01//EN',
		systemId: 'http://www.w3.org/TR/html4/strict.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['HTML 4.01 Transitional'] = {
		name: 'html',
		publicId: '-//W3C//DTD HTML 4.01 Transitional//EN',
		systemId: 'http://www.w3.org/TR/html4/loose.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['HTML 4.01 Frameset'] = {
		name: 'html',
		publicId: '-//W3C//DTD HTML 4.01 Frameset//EN',
		systemId: 'http://www.w3.org/TR/html4/frameset.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['HTML 5'] = {
		name: 'html',
		publicId: '',
		systemId: '',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: function() { return '<!DOCTYPE html>'; }
	};
	doctypes['XHTML 1.0'] = {
		name: 'html',
		publicId: '-//W3C//DTD XHTML 1.0 Strict//EN',
		systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['XHTML 1.0 Transitional'] = {
		name: 'html',
		publicId: '-//W3C//DTD XHTML 1.0 Transitional//EN',
		systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['XHTML 1.0 Frameset'] = {
		name: 'html',
		publicId: '-//W3C//DTD XHTML 1.0 Frameset//EN',
		systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};
	doctypes['XHTML 1.1'] = {
		name: 'html',
		publicId: '-//W3C//DTD XHTML 1.1//EN',
		systemId: 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd',
		entities: null, // unsupported
		notations: null, // unsupported
		toString: toString
	};

	var identifiers = {
		'<!doctype html public "-//w3c//dtd html 4.01/': 'HTML 4.01',
		'<!doctype html public "-//w3c//dtd html 4.01 transitional/': 'HTML 4.01 Transitional',
		'<!doctype html public "-//w3c//dtd html 4.01 frameset/': 'HTML 4.01 Frameset',
		'<!doctype html>': 'HTML 5',
		'<!doctype html public "-//w3c//dtd xhtml 1.0 strict/': 'XHTML 1.0',
		'<!doctype html public "-//w3c//dtd xhtml 1.0 transitional/': 'XHTML 1.0 Transitional',
		'<!doctype html public "-//w3c//dtd xhtml 1.0 frameset/': 'XHTML 1.0 Frameset',
		'<!doctype html public "-//w3c//dtd xhtml 1.1/': 'XHTML 1.1'
	};

	function find(decl) {
		decl = decl.toLowerCase();

		for (var fragment in identifiers) {
			if ( decl.indexOf( fragment ) > -1 ) {
				return doctypes[ identifiers[ fragment ] ];
			}
		}

		return null;
	}

	function assignDOCTYPE( source ) {
		var doctype   = find( source.split( "\n", 1 )[0] )
		  , fallback  = filter.DOCTYPE.fallback
		  , warning   = filter.DOCTYPE.warning;

		if ( !doctype && fallback ) {
			doctype = doctypes[ fallback ];
			source  = doctype.toString() + "\n" + source;
		}
		if ( !doctype && warning ) {
			alert( warning );
		}
		this.doctype = doctype;

		return source;
	}
	function writeDOCTYPE( source ) {
		return this.doctype.toString() + "\n" + source;
	}

	filter.DOCTYPE = {
		doctypes: doctypes,
		fallback: 'HTML 4.01 Transitional',
		warning:  'Documents without doctype cause unpredictable rendering issues.'
	};
	filter.assignDOCTYPE = assignDOCTYPE;
	filter.writeDOCTYPE  = writeDOCTYPE;

})(Vizard.Filter);
