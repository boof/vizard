Vizard
======

Vizard is a JavaScript framework to create semi-WYSIWYG editors for (X)HTML.

It does so by loading the target document into an IFRAME and generating
"control"-elements for elements that can be modified.
These elements are defined by selectors, mapping to multiple event handlers
(see example).

Bootstrapping Methods
---------------------

* Scriptlet
* HTML

Compatibility
-------------
Example only tested in Chrome and Firefox 7.0rc2.

Example
-------

    $('#iframe')
    .bind('onreadystatechange.Vizard', function(e, state, vizard) {
        switch ( state ) {

            case Vizard.LOADING:
                // AJAX request sent, time to add filters!
                new Vizard.Filter.SSI({
                    blacklist: [/etracker.include$/],
                    cache: true,
                    location: vizard.location,
                    writeback: function(url, contents) {
                        // ...
                    }
                }).bind(vizard);

                break;

            case Vizard.INTERACTIVE: // target document is available
                // adds a class to body element in target document
                vizard.jQuery('body').addClass('some-class');
                break;

            case Vizard.COMPLETE: // core initialization completed
                $('#spinner').hide();
                // append generated controls to an overlay
                $('#overlay').append( vizard.controls );
                break;
        }
    })
    .vizard( href, {

        // handlers are added by selector
        'p.editable': {

            // event handlers are called on selected elements
            click: function() { alert(this.innerText); },

            // but we can also assign titles to the controls
            title: 'Click to pop-up inner text.'
        }
    });

Instance Attributes
-------------------

* controls
* document
* doctype
* display
* handler
* href
* inputFilter
* outputFilter

Instance Methods
----------------

* setState
* ...

Requirements
------------
jQuery 1.6.2

Build Requirements
------------------

* rake
* uglify-js

Build
-----

    $ rake minify
