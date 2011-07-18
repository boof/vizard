Vizard
======

Vizard is a JavaScript framework to create semi-WYSIWYG editors for (X)HTML.

It does so by loading the target document into an IFRAME and generating
control elements for elements that can be manipulated.
These elements are defined by selectors, mapping to multiple event handlers
bound to their controls.

Example
-------

    $('#iframe')
    .bind('onreadystatechange.Vizard', function(e, state, vizard) {
        switch ( state ) {

            case Vizard.LOADING: // AJAX request sent, time to add filters!
                vizard.inputFilter.push( Vizard.Filter.includeSSI );
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

* rake
* uglify-js

Build
-----

    $ rake minify
