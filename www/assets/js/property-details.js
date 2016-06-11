(function (T7, app) {
    'use strict';

    T7.registerHelper('trimPropertyTitle', function(title){
        var split = title.split(',');
        
        if (split.length > 1) {
            return split[0] + ', ' + split[1];
        } else {
            return split[0];
        }
    });

    function toggleFav() {
        var $$elem = $$('.fav-property i');

        if ($$elem.hasClass('fa-star-o')) {
            $$elem.removeClass('fa-star-o');
            $$elem.addClass('fa-star');
        } else {
            $$elem.removeClass('fa-star');
            $$elem.addClass('fa-star-o');
        }
    }

    app.onPageInit('property-details', function(page) {
        $$('.fav-property').on('click', function(event){
            event.preventDefault();

            toggleFav();
        });
    });
})(Template7, app); 