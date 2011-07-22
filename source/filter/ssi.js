/*
 * new Vizard.Filter.SSI({
 *   blacklist: [/etracker.include$/],
 *   cache: true,
 *   location: vizard.location,
 *   writeback: function(url, contents) {
 *     // ...
 *   }
 * }).bind( vizard );
 */
(function(Vizard) {

	var includeExpr  = /<!--# include .*?-->/g
	  , extroComment = '<!--# end-of include="%s" -->'
	  , dropQuestion = 'Drop dead reference "%s"?',

	$ = Vizard.jQuery,

	defaults = {
		writeback: false,
		blacklist: false,
		cache: true
	};

	function Absolute(agent, location) {
		var prefix = location.protocol + '//' + location.host
		  , href   = location.href
		  , self   = this;

		self.absolute = function(url) {
			return url.substr(0, 1) == '/' ?
				prefix + url :
				href.replace(/[^\/]*$/, url);
		};

		self.agent = agent;

		return self;
	}
	$.extend(Absolute.prototype, {
		get: function(url) {
			return this.agent.get( this.absolute(url) );
		},
		set: function(url, contents) {
			return this.agent.set( this.absolute(url), contents );
		}
	});
	function Blacklist(agent, expressions) {
		var blacklist = this;

		blacklist.expressions = expressions;
		blacklist.agent       = agent;

		return blacklist;
	}
	$.extend(Blacklist.prototype, {
		rejected: function(url) {
			var result = false;

			$.each( this.expressions, function() {
				return !( result = this.test(url) );
			});

			return result;
		},
		get: function(url) {
			return this.rejected(url) ? null : this.agent.get( url );
		},
		set: function(url, contents) {
			return this.rejected(url) ? null : this.agent.set( url, contents );
		}
	});
	function Cache(agent) {
		var cache = this;

		cache.storage = {};
		cache.agent   = agent;

		return cache;
	}
	$.extend(Cache.prototype, {
		get: function(url) {
			var contents = this.storage[url];
			if ( contents === undefined ) {
				contents = this.storage[url] = this.agent.get(url);
			}
			return contents;
		},
		set: function(url, contents) {
			if ( this.storage[url] === contents ) {
				return contents;
			} else {
				return this.storage[url] = this.agent.set(url, contents);
			}
		}
	});
	function Agent(agent) {
		var self = this;
		self.agent = agent;
		return self;
	}
	$.extend(Agent.prototype, {
		get: function(url) {
			var value = null;

			$.ajax( url, {
				async: false, dataType: 'text',
				success: function(text) { value = text; }
			});

			return value;
		},
		set: function(url, contents) {
			this.agent.set(url, contents);
		}
	});

	function dropped(url) {
		return confirm( dropQuestion.replace('%s', url) );
	}

	function SSI( opts ) {
		var agent, filter;

		opts = $.extend( defaults, opts );

		agent = new Agent(this);
		if (opts.cache) { agent = new Cache(agent); }
		if (opts.blacklist) { agent = new Blacklist(agent, opts.blacklist); }
		agent = new Absolute(agent, opts.location);

		filter = {
			bind: function(vizard) {
				vizard.inputFilter.unshift(includeSSI);
				vizard.outputFilter.push(excludeSSI);
			},
			includeSSi: includeSSI,
			excludeSSI: excludeSSI
		};

		if ( typeof(opts.writeback) == 'function' ) {
			filter.set = opts.writeback;
		} else {
			function nop() {};
		}

		function includeSSI( source ) {
			// RADAR maybe this should split and resolve async and wait until
			// all includes are loaded, see jQuery.deferred...
			return source.replace(includeExpr, function(intro) {
				var url      = intro.match(/="(.*)"/)[1]
				  , contents = agent.get(url);

				if ( contents !== null ) {
					return intro + contents + extroComment.replace('%s', url);
				} else {
					return dropped(url) ? '' : intro;
				}
			});
		}
		function excludeSSI( source ) {
			var includes = {}, urls = []
			  , start, stop;

			// url extration
			$.each( source.match(includeExpr), function() {
				var include  = this.toString()
				  , url      = include.match(/="([^"]+)"/)[1];

				includes[url] = include;
			});

			// data mangling and writeBack
			$.each( includes, function( url, intro ) {
				var extro         = extroComment.replace('%s', url)
				  , lengthOfExtro = extro.length
				  , lengthOfIntro = intro.length
				  , contents;

				stop = source.indexOf(extro);
				while ( stop > -1 ) {
					start = source.lastIndexOf(intro, stop);
					if ( start < 0 ) {
						throw('Vizard.Filter.SSI: Extro without Intro!');
					}

					// extract contents
					contents = source.substring(start + lengthOfIntro, stop);

					// remove contents and extro
					source = ''.concat(
						source.substr(0, start + lengthOfIntro),
						source.substr(stop + lengthOfExtro)
					);

					stop = source.indexOf(extro);
				}

				agent.set(url, contents);
			});

			return source;
		}

		return filter;
	};

	Vizard.Filter.SSI = SSI;

})(Vizard);
