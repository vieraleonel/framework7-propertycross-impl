(function (F7, T7, D7) {
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
})(Framework7, Template7, Dom7);