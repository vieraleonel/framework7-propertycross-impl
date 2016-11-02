(function (F7, T7, D7, ss) {
    'use strict';

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

    var template = $$('#recent-searchs-template').html();
    window.recentSearchsCompiled = T7.compile(template);

    ss.getRecentSearchs()
        .then(function(recentSearchs){
            window.rr = recentSearchs;
            var html = recentSearchsCompiled({searchs: recentSearchs});
            $$('.state-place').html(html);
        });
    
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
})(Framework7, Template7, Dom7, storageService);