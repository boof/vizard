(function(Vizard) {

	var $ = Vizard.jQuery;

	Vizard.fn.control = function() {
		var container, behaviours, behaviour, handlers, handler, $$;
		this.elements = this.elements || this.jQuery();

		for (var selector in this.handler) {
			behaviour = this.handler[selector];

			this.elements = this.jQuery( selector )

			// only select elements in given container, ...
			.filter(function() {
				var select = false, element = this;

				$.each(arguments, function() {
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

		this.elements.control(this);
	};

	var fn = Vizard.jQuery.fn;

	fn.sort = function() {
		var arrayLike = Array.prototype.sort.apply( this, arguments )
		  , array     = $.makeArray( array );

		return this.pushStack( array );
	};
	fn.sortBySize = function() {
		this.sort(function(a, b) {
			var aa = $(a), bb = $(b);

			return $(b).width() * $(b).height()
			     - $(a).width() * $(a).height();
		});

		return this;
	};
	fn.control = function(vizard) {
		var controls = vizard.controls;

		this.each(function() {
			var control    = $('<a class="vizard-ui-control">')
			  , $$         = $( this )
			  , behaviours = $$.data('behaviours');

			control.data('target', this);
			$$.data('controller', control);

			$.window.resize(function refit() {
				control.css( $$.offset() )
				       .width( $$.outerWidth() )
				       .height( $$.outerHeight() );
			});

			for (var eventType in behaviours) {
				var handlers = behaviours[eventType];

				if (eventType !== 'title') {
					$.each(handlers, function(i, handler) {
						control.bind(eventType, handler);
					});
				} else {
					control.attr('title', handlers.join("\n"));
				}
			}

			controls = controls.add(control);
		});
		vizard.controls = controls.data('vizard', vizard);

		return this;
	};
	fn.ancestors = function() {
		var ancestors = $()
		  , control   = this;

		control.each(function() {
			var target = $(this).data('target');

			$(target).parents().each(function() {
				var control = $(this).data('controller');
				if (control) { ancestors = ancestors.add(control); }
			});
		});

		return ancestors;
	};
	fn.descendants = function() {
		var descendants = $()
		  , control     = this;

		this.data('vizard').controls.each(function() {
			var element = this.data('target');

			control.each(function() {
				var container = this.data('target')
				  , contains  = $.contains(container, element);

				if (contains) { descendants = descendants.add(element); }

				return !contains;
			});
		});

		return descendants;
	};
	fn.garbageCollect = function() {
		var garbage = $();

		this.each(function() {
			var trash = $(this).data('target') === null;
			if (trash) { garbage = garbage.add(this); }
		});

		return garbage;
	};

})(Vizard);
