(function(Vizard) {

	var fn = Vizard.prototype
	  ,  $ = Vizard.jQuery;

	fn.controls     = $();
	fn.doctype      = null;
	fn.styleSheets  = null;
	fn.handler      = {};

	fn.entitle = function(title) {
		Vizard.entitle( title, this.document );
	};

	if ($.browser.msie) {
		fn.addStyle = function(selector, rule, index) {
			return this.styleSheet.addRule(selector, rule, index);
		};
	} else {
		fn.addStyle = function(selector, rule, index) {
			if (typeof(index) != 'number') index = 0;
			return this.styleSheet.insertRule(selector.concat(' {', rule, '}'), index);
		};
	}

	fn.jQuery = function( selector ) {
		return $( selector, this.document );
	};

	fn.makeSnapshot = function() {
		return this.document.documentElement.innerHTML;
	};

	fn.reset = function() {
		this.snapshot   = this.makeSnapshot();
		this.isModified = false;
	};

	fn.is = function(doctype) {
		if (this.doctype === null) { return false; }
		return this.doctype.publicId.indexOf(doctype) > -1;
	};

	fn.serialize = function() {
		var source;

		if ( this.is('XHTML') ) {
			source = $(this.document).xhtml();
		} else {
			source = $(this.document.documentElement).html();
		}

		return this.outputFilter( source );
	};

	fn.update = function() {
		var snapshot = this.makeSnapshot()
		  , oldLines = difflib.stringAsLines(this.snapshot)
		  , newLines = difflib.stringAsLines(snapshot)
		  , sm       = new difflib.SequenceMatcher(oldLines, newLines)
		  , opcodes  = sm.get_opcodes();

		// not modified only when we have a single opcode ...
		// ... and this opcode says the old and new snapshot are equal
		var modified = (opcodes.length > 1 || opcodes[0][0] != 'equal');

		if (modified) {
			this.controls.garbageCollect().remove();

			this.isModified = true;
			this.snapshot   = snapshot;

			this.display.trigger('change.Vizard');
		}
	};

	// States
	Vizard.INIT        = 'uninitialized';
	Vizard.LOADING     = 'loading';
	Vizard.LOADED      = 'loaded';
	Vizard.INTERACTIVE = 'interactive';
	Vizard.COMPLETE    = 'complete';

	fn.readyState = Vizard.INIT;

	fn.setState = function( state ) {
		this.readyState = state;
		this.display.trigger('onreadystatechange.Vizard', [ state, this ]);
	};

	// ...

	Vizard.fn = fn;

})(Vizard);
