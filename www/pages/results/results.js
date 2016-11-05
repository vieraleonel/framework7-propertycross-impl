(function($$, T7, app, ps, fs) {
    'use strict';

    function toggleLoadMore() {
        var loadMoreText = $$('#load-more-results .item-title').html('Loading...');

        if (loadMoreText === 'Loading...') {
            $$('#load-more-results .item-title').html('Load more ...');
        } else {
            $$('#load-more-results .item-title').html('Loading...');
        }
    }

    /**
     * get more results from last query
     */
    function getMoreProperties() {
        toggleLoadMore();

        ps.loadMore(loadMoreResultsSuccess, loadMoreResultsError);

        function loadMoreResultsSuccess(data) {
            
            app.template7Data['page:results'] = data;
            app.template7Data['page:results'].loadMore = {
                label: 'Load more ...',
                canLoad: data.page < data.pages
            };
            
            mainView.router.refreshPage();
        }

        function loadMoreResultsError(error) {
            toggleLoadMore();
            alert(error.message);
        }
    }

    function goToPropertyDetails(property) {

        fs.isFav(property, isFavSuccess, null);

        function isFavSuccess(isFav) {
            property.isFav = isFav;
            app.template7Data['page:property-details'] = property;
            mainView.loadPage('pages/property-details/property-datails.html');
        }
    }


    app.onPageInit('results', function(page) {

        // go to property details event
        $$('#results-list').on('click', '.property-item', function(event) {
            event.preventDefault();
            
            var index = $$(this).data('index');

            goToPropertyDetails(app.template7Data['page:results'].properties[index]);
        });

        // load more event
        $$('#load-more-results').on('click', function(event){
            event.preventDefault();

            getMoreProperties();
        }); 
    });
})(Dom7, Template7, app, propertiesService, favouritesService);
