(function (F7, T7, $$, ss) {
    'use strict';

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