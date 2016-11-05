(function (T7, app, fs) {
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

        if ($$elem.hasClass('fa-star')) {

            fs.remove(app.template7Data['page:property-details']);
            
            $$elem.removeClass('fa-star');
            $$elem.addClass('fa-star-o');

        } else {
            fs.store(app.template7Data['page:property-details']);

            $$elem.removeClass('fa-star-o');
            $$elem.addClass('fa-star');
        }
    }

    app.onPageInit('property-details', function(page) {

        $$('.fav-property').on('click', function(event){
            event.preventDefault();

            toggleFav();
        });
    });
})(Template7, app, favouritesService); 