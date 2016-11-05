(function (F7, T7, D7, rss) {
    'use strict';

    // global constants
    window.appConstants = {
        PROPERTY_API: {
            baseUrl: 'http://api.nestoria.co.uk/api?country=uk&pretty=0&action=search_listings&encoding=json&listing_type=buy',
            error: {
                messages: {
                    ZERO_PROPERTIES: 'There were no properties found for the given location.',
                    GENERIC_ERROR: 'An error occurred while searching. Please check your network connection and try again.',
                    LOCATION_DISABLED: 'The use of location is currently disabled.',
                    LOCATION_UNAVAILABLE: 'Unable to detect current location. Please ensure location is turned on in your phone settings and try again.'
                }
            },
            status: {
                SUCCESS: 1,
                AMBIGUOUS: 2,
                ERROR: 0
            }
        },
        TIMEOUT: 5000 // 5seg
    };

    window.isAndroid = F7.prototype.device.android === true;
    window.isIos     = F7.prototype.device.ios === true;

    T7.global = {
        android: isAndroid,
        ios: isIos
    };

    window['$$'] = D7;

    if (isAndroid) {
        $$('head').append(
            '<link rel="stylesheet" href="assets/framework7/css/framework7.material.min.css">' +
            '<link rel="stylesheet" href="assets/framework7/css/framework7.material.colors.min.css">' +
            '<link rel="stylesheet" href="assets/css/android.css">'
        );
    }
    else {
        $$('head').append(
            '<link rel="stylesheet" href="assets/framework7/css/framework7.ios.min.css">' +
            '<link rel="stylesheet" href="assets/framework7/css/framework7.ios.colors.min.css">' +
            '<link rel="stylesheet" href="assets/css/ios.css">'  
        );

        // Change class
        $$('.view.navbar-fixed').removeClass('navbar-fixed').addClass('navbar-through');

        // android navbar
        $$('.navbar').prependTo('.view');
    }

    // favourites list compiled
    window.favouritesListCompiled = T7.compile($$('#favourites-list-template').html());

    // compile recent searches template for first time
    window.recentSearchesCompiled = T7.compile($$('#recent-searches-template').html());
    rss.get(function(data){
        var html = window.recentSearchesCompiled({searches: data});
        $$('.state-place').html(html);
    })

    // Initialize app
    window.app = new F7({
        material: isAndroid ? true : false,
        pushState: true,
        template7Pages: true
    });
    
    // Add view
    window.mainView = app.addView('.view-main', {
        // Because we want to use dynamic navbar, we need to enable it for this view:
        dynamicNavbar: true
    });
})(Framework7, Template7, Dom7, recentSearchesService);