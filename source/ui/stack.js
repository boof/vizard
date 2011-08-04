(function(Vizard) {

	var $  = Vizard.jQuery,
	    UI = Vizard.UI;

	function Stack(background) {
		var document = background.ownerDocument,

		$$   = $( background ),
		view = $$.contents() || $$,

		overlay = $('<div class="vizard-ui-overlay">', document),
		stack   = $('<div class="vizard-ui-stack">', document),

		height = 0,
		width  = 0,
		offset = { x: 0, y: 0 },

		instance = this;

		$.window.resize(function(e) {
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
			if ( newSize ) { overlay.height(height).width(width); }

			newOffset = newOffset || ( oldOffset.x != offset.x );
			newOffset = newOffset || ( oldOffset.y != offset.y );
			if ( newOffset ) { overlay.offset(offset); }

			stack.height( view.height() );
		});

		overlay.bind({
			scroll: function(e) {
				var el         = $( e.target )
				  , top        = el.scrollTop()
				  , left       = el.scrollLeft()
				  , viewHeight = view.height()
				  , viewWidth  = view.width();

				// TODO fix scroll issues when controls have padding
				// if ( top + height > viewHeight ) {  }
				// if ( left + width > viewWidth ) {  }

				view.scrollTop(top).scrollLeft(left);
			},
			click: function(e) {
				if ( !overlay.is(e.target) ) { return; }
				overlay.children().trigger('stack');
			}
		});

		stack.bind('stack', function(e) { stack.show(); });

		this.overlay = overlay;
		this.stack = stack;
		overlay.append(stack).insertAfter(background);

		return instance;
	}

	Stack.prototype.frame = function( element, onStack ) {
		var stack = this;

		if ( typeof onStack != 'function' ) { onStack = function() {}; }

		return UI.frame( element ).bind({
			focus: function(e, modal) {
				if ( e.target != this ) { return; }
				modal ? stack.modal( this ) : stack.focus( this );
			},
			stack: function(e) { onStack.apply(this, arguments); }
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
		'.vizard-ui-stack': 'top: 0; right: 0; left: 0;'
	});

	return UI.Stack = Stack;

})(Vizard);
