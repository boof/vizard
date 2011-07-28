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
			// RADAR does not work with Firefox...
			// TODO move the document
			background.contents().
			scrollTop(e.srcElement.scrollTop).
			scrollLeft(e.srcElement.scrollLeft);

			//$( target ).offset({
			//	top: e.srcElement.scrollTop * -1,
			//	left: e.srcElement.scrollLeft * -1
			//});
			// console.log(e.srcElement.scrollTop, e.srcElement.scrollLeft);
		});

		this.overlay = overlay;
		this.stack = stack;
		overlay.append(stack).insertAfter(background);

		return instance;
	}

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
