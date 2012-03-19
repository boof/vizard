(function($) {

	function Toolbar( callbacks, jQuery ) {
		var toolbar = this;
		toolbar.length = 0;

		jQuery.
		click(function(e) {
			e.preventDefault();
			e.stopPropagation();
		}).data('toolbar', toolbar).

		find('a').
		each(function() {
			var tool = new Toolbar.Tool(callbacks.shift(), this);
			toolbar.push(tool);
		});

		return toolbar;
	}
	(function(fn) {
		fn.each = function( callback ) {
			for (var i = 0; i < this.length; i++) {
				callback.call(this[i], i);
			}
		};
		fn.push = function( tool ) {
			this[this.length] = tool;
			this.length++;
		};
	})(Toolbar.prototype);

	Toolbar.Tool = function Tool( callback, element ) {
		this.$ = $(element).data('tool', this).click(callback);
		return this;
	};

	// $('nav#toolbar').toolbar([ function() { /*...*/ }, ... ]);
	$.fn.toolbar = function( href, callbacks ) {
		var self    = this
		  , toolbar = self.data('toolbar');

		if (toolbar) {
			return toolbar;
		} else {
			self.load( href, function() {
				toolbar = new Toolbar( callbacks, self );
			});
		}

		return self;
	};

})(Vizard.jQuery);
