(function (app, $$, ss, ps) {
    'use strict';

    function showSearchProgress() {
        app.showPreloader();
    }

    function showSearchButtons() {
        app.hidePreloader();
    }

    $$('.view-main').on('click', '#do-search', function(event) {
        event.preventDefault();

        showSearchProgress();

        var searchTerm = $$('#search-text').val();

        ps.searchProperties(
            searchTerm, 1, 
            function(data, status, xhr) {

                if (data.response.application_response_code == 100 || 
                    data.response.application_response_code == 101 ||
                    data.response.application_response_code == 110) {

                    app.template7Data['page:results'] = {
                        page: 1,
                        pages: data.response.total_pages,
                        more: data.response.page < data.response.total_pages,
                        searchTerm: searchTerm,
                        showing: data.response.listings.length,
                        results: data.response.total_results,
                        properties: data.response.listings
                    }

                    ss.addRecentSearch({
                        term: searchTerm,
                        results: data.response.total_results
                    });

                    mainView.router.loadPage('pages/results/results.html');
                } else {
                    alert(error);
                }
            },
            null,
            function() {
                showSearchButtons();
            }
        );
    });

    app.onPageBeforeInit('main', function(page) {
        if (isIos) {
            $$('.page[data-page=main] .navbar').remove();
        }
    });

    app.onPageBeforeAnimation('main', function(page){
        ss.getRecentSearchs()
            .then(function(recentSearchs){
                window.rr = recentSearchs;
                var html = recentSearchsCompiled({searchs: recentSearchs});
                $$('.state-place').html(html);
            });
    });
})(app, Dom7, storageService, propertiesService);