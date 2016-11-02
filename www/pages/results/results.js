(function($$, T7, app, ps) {
    'use strict';

    /**
     * Returns next page. Checks if current page is last
     * @return string page (nestoria pages are strings)
     */
    function getNextPage() {
        return (app.template7Data['page:results'].page < app.template7Data['page:results'].pages ? app.template7Data['page:results'].page + 1 : app.template7Data['page:results'].pages);
    }

    function loadMore() {
        if (app.template7Data['page:results'].page < app.template7Data['page:results'].pages) {
            ps.searchProperties(
                app.template7Data['page:results'].searchTerm, 
                getNextPage(), 
                function(data, status, xhr) {

                    if (data.response.application_response_code == 100 || 
                        data.response.application_response_code == 101 ||
                        data.response.application_response_code == 110) {

                        app.template7Data['page:results'].page       = data.response.page;
                        app.template7Data['page:results'].more       = data.response.page < data.response.total_pages;
                        app.template7Data['page:results'].properties = app.template7Data['page:results'].properties.concat(data.response.listings);
                        app.template7Data['page:results'].showing    = app.template7Data['page:results'].properties.length;

                        mainView.router.refreshPage();
                    } else {
                        alert(error);
                    }
                }
            );
        }
    }

    app.onPageInit('results', function(page) {

        $$('#results-list').on('click', '.property-item', function(event) {
            var index = $$(this).data('index');
            app.template7Data['page:property-details'] = app.template7Data['page:results'].properties[index];
            mainView.loadPage('pages/property-details/property-datails.html');
        });

        $$('#load-more-results').on('click', function(event){
            event.preventDefault();

            $$('#load-more-results .item-title').html('Loading...');

            loadMore();
        }); 
    });
})(Dom7, Template7, app, propertiesService);