(function(Vizard) {

	var $  = Vizard.jQuery,
	    UI = Vizard.UI;

	function Stack(view) {
		var document = view.ownerDocument,

		$$ = $( view ),

		container  = $('<div class="vizard-ui-stack">', document),
		background = $('<div class="vizard-ui-stack-background">', document),
		stacker    = $('<div class="vizard-ui-stack-stacker">', document),
		top        = $('<div class="vizard-ui-stack-top">', document),
		children   = background.add(stacker).add(top),

		height = 0,
		width  = 0,
		offset = { x: 0, y: 0 },

		stack = this;

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
				container.height(height);
				container.width(width);
				container.offset(offset);
				// RADAR trigger events here
			} else if ( newSize ) {
				container.height(height);
				container.width(width);
				// RADAR trigger events here
			} else if ( newOffset ) {
				container.offset(offset);
				// RADAR trigger events here
			}
		});

		this.background = background;
		this.stacker    = stacker;
		this.top        = top;

		container.append(children).insertAfter(view);

		return this;
	}

	Stack.prototype.focus = function( element ) {
		this.stacker.append( this.top.children() );
		this.top.append( element );
	};

	UI.addStyle('.vizard-ui-stack, .vizard-ui-stack-*',
		'position: absolute;');
	UI.addStyle('.vizard-ui-stack-*',
		'top: 0; right: 0; bottom: 0; left: 0;');

	return UI.Stack = Stack;

})(Vizard);
