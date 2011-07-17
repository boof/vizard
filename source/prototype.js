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

	fn.jQuery = function( selector ) {
		var jQ = $( selector, this.document );
		jQ.vizard = this;

		return jQ;
	};

	fn.makeSnapshot = function() {
		return this.document.documentElement.innerHTML;
	};

	fn.reset = function() {
		this.snapshot   = this.makeSnapshot();
		this.isModified = false;
	};

	fn.update       = function() {
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
	fn.readyState = Vizard.INIT;

	Vizard.LOADING     = 'loading';
	Vizard.LOADED      = 'loaded';
	Vizard.INTERACTIVE = 'interactive';
	Vizard.COMPLETE    = 'complete';

	fn.setState = function( state ) {
		this.readyState = state;
		this.display.trigger('onreadystatechange.Vizard');
	};

	// ...

	Vizard.fn = fn;

})(Vizard);
