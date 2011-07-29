(function(Vizard) {

	var $  = Vizard.jQuery,
	    UI = Vizard.UI;

	function Stack(background) {
		var document = background.ownerDocument,

		$$ = $( background ),

		overlay = $('<div class="vizard-ui-overlay">', document),
		stack   = $('<div class="vizard-ui-stack">', document),

		height = 0,
		width  = 0,
		offset = { x: 0, y: 0 },

		instance = this;

		$.window.resize(function() {
			var oldHeight = height,
			    oldWidth  = width,
			    oldOffset = offset,
			    newSize   = false,
			    newOffset = false;

			height = $$.height();
			width  = $$.width();
			offset = $$.offset();

			newSize   = newSize   || ( oldHeight   != height );
			newSize   = newSize   || ( oldWidth    != width );
			newOffset = newOffset || ( oldOffset.x != offset.x );
			newOffset = newOffset || ( oldOffset.y != offset.y );

			if ( newSize && newOffset ) {
				overlay.height(height);
				overlay.width(width);
				overlay.offset(offset);
				// RADAR trigger events here
				// stack.children, overlay.children().not(stack)
			} else if ( newSize ) {
				overlay.height(height);
				overlay.width(width);
				// RADAR trigger events here
			} else if ( newOffset ) {
				overlay.offset(offset);
				// RADAR trigger events here
			}
		});

		overlay.click(function(e) {
			if ( overlay.is(e.target) ) { overlay.children().blur(); }
		});
		stack.blur(function() { stack.show(); });

		overlay.scroll(function(e) {
			var el         = $( e.target )
			  , top        = el.scrollTop()
			  , left       = el.scrollLeft()
			  , view       = background.contents()
			  , viewHeight = view.height()
			  , viewWidth  = view.width();

			// TODO fix scroll issues
			// if ( top + height > viewHeight ) {  }
			// if ( left + width > viewWidth ) {  }

			view.scrollTop(top).scrollLeft(left);
		});

		this.overlay = overlay;
		this.stack = stack;
		overlay.append(stack).insertAfter(background);

		return instance;
	}

	Stack.prototype.frame = function( element ) {
		var stack = this;

		return UI.frame( element ).focus(function(e, modal) {
			if (e.target !== this) { return; }
			modal ? stack.modal( this ) : stack.focus( this );
		});
	};

	Stack.prototype.focus = function( element ) {
		this.stack.append( element );
	};
	Stack.prototype.modal = function( element ) {
		this.stack.hide();
		this.overlay.append( element );
	};

	UI.addStyle({
		'.vizard-ui-overlay, .vizard-ui-stack': 'position: absolute;',
		'.vizard-ui-overlay': 'overflow: auto;',
		'.vizard-ui-stack': 'top: 0; right: 0; bottom: 0; left: 0;'
	});

	return UI.Stack = Stack;

})(Vizard);
