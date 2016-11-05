(function($$, app, fs) {
    'use strict';

    function goToPropertyDetails(property) {
        property.isFav = true;
        app.template7Data['page:property-details'] = property;

        mainView.loadPage('pages/property-details/property-datails.html');
    }
    
    app.onPageBeforeAnimation('favourites', function(page){
        fs.getAll(favouritesSuccess);

        function favouritesSuccess(faves) {
            app.template7Data['page:favourites'] = {favourites: faves};
            var html = window.favouritesListCompiled( app.template7Data['page:favourites']);
            $$('.favourites-list-container').html(html); 
        }
    });

    app.onPageInit('favourites', function(page) {

        // go to property details event
        $$('.favourites-list-container').on('click', '.property-item', function(event) {
            event.preventDefault();
            
            var index = $$(this).data('index');

            goToPropertyDetails(app.template7Data['page:favourites'].favourites[index]);
        });
    });
})(Dom7, app, favouritesService);
