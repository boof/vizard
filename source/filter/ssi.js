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
(function(filter) {

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
		  , href   = location.href;

		this.absolute = function(url) {
			return url.substr(0, 1) == '/' ?
				prefix + url :
				href.replace(/[^\/]*$/, url);
		};

		this.agent = agent;
	}
	$.extend(Absolute.prototype, {
		get: function(url) {
			return agent.get( this.absolute(url) );
		},
		set: function(url, contents) {
			return agent.set( this.absolute(url), contents );
		}
	});
	function Blacklist(agent, expressions) {
		this.expressions = expressions;
		this.agent       = agent;
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
			return this.rejected(url) ? null : agent.get( url );
		},
		set: function(url, contents) {
			return this.rejected(url) ? null : agent.set( url, contents );
		}
	});
	function Cache(agent) {
		this.storage = {};
		this.agent   = agent;
	}
	$.extend(Cache.prototype, {
		get: function(url) {
			var contents = this.storage[url];
			if ( contents === undefined ) {
				contents = this.storage[url] = agent.get(url);
			}
			return contents;
		},
		set: function(url, contents) {
			if ( this.storage[url] === contents ) {
				return contents;
			} else {
				return this.storage[url] = agent.set(url, contents);
			}
		}
	});
	function Agent(agent) {
		this.agent = agent;
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
			agent.set(url, contents);
		}
	});

	function dropped(url) {
		return confirm( dropQuestion.replace('%s', url) );
	}

	function SSI( opts ) {
		var agent;

		opts = $.extend( defaults, opts );

		agent = new Agent(this);
		if (opts.cache) { agent = new Cache(agent); }
		if (opts.blacklist) { agent = new Blacklist(agent, opts.blacklist); }
		agent = new Absolute(agent, opts.location);

		if ( typeof(opts.writeback) == 'function' ) {
			this.set = opts.writeback;
		} else {
			function() {};
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

		return {
			bind: function(vizard) {
				vizard.inputFilter.push(includeSSI);
				vizard.outputFilter.push(excludeSSI);
			}
		};
	};

	filter.SSI = SSI;

})(Vizard.Filter);
