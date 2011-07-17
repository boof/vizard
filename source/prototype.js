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

	fn.control = function() {
		var container, behaviours, behaviour, handlers, handler, $$;
		this.elements = this.elements || this.jQuery();

		for (var selector in this.handler) {
			behaviour = this.handler[selector];

			this.elements = this.jQuery( selector )

			// only select elements in given container, ...
			.filter(function() {
				var select = false, element = this;

				jQuery.each(arguments, function() {
					container = $(this);

					// RADAR Does .is() mean this should be selected?
					select = container.is(element);
					select || ( select = container.has(element).length > 0 );

					return !select;
				});

				return select;
			})
			// ... merge behaviours ...
			.each(function() {
				$$ = $(this);
				behaviours = $$.data('behaviours') || {};

				for (var eventType in behaviour) {
					handlers = behaviours[eventType] || [];
					handler  = behaviour[eventType];

					if (handlers.indexOf(handler) > -1) { continue; }

					handlers.push(handler);
					behaviours[eventType] = handlers;
				}

				$$.data('behaviours', behaviours);
			})
			// ... and add already found elements
			.add(this.elements);
		}

		this.elements.control();
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

		return this.doctype.toString() + "\n" + this.outputFilter( source );
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
		this.display.trigger('onreadystatechange.Vizard');
	};

	// ...

	Vizard.fn = fn;

})(Vizard);
