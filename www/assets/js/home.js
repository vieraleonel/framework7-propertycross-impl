(function (app, T7, $$, rss, ps, constants, fs) {
    'use strict';

    //////////////////////////
    // private variables
    //////////////////////////
    
    var searchTerm     = '',
        loading        = false,
        recentSearches = [],
        state          = 1,
        errorMessage   = '',
        locations      = [],

        errorStateCompiled     = T7.compile($$('#main-error-state-template').html()),
        locationsStateCompiled = T7.compile($$('#main-locations-state-template').html());

    //////////////////////////
    // private functions
    //////////////////////////

    /**
     * Get recent searches form storage
     */
    function getRecentSearches() {
        rss.get(function(data) {
            var html = window.recentSearchesCompiled({searches: data});
            $$('.state-place').html(html);
        });
    }

    /**
     * Process Successfull data response from service
     * 
     * @param  Object data Returned service response
     */
    function processResponse(data) {

        if (data.status === constants.PROPERTY_API.status.SUCCESS) {
            showResultsPage(data);
        }
        else if (data.status === constants.PROPERTY_API.status.AMBIGUOUS) {
            showLocationsState(data);
        }
        else { // error
            showErrorState(data);
        }
    }

    /**
     * Navigates to results page
     * 
     * @param  Object data 
     */
    function showResultsPage(data) {
        state        = 1;
        locations    = [];
        errorMessage = '';

        // if search was by term, stores it in recent searches
        if (searchTerm !== '') {
            rss.store({
                term: searchTerm,
                results: data.results 
            });
        }

        // prepare next page data
        app.template7Data['page:results'] = ps.getLastQueryResults();
        app.template7Data['page:results'].loadMore = {
            label: 'Load more ...',
            canLoad: app.template7Data['page:results'].page < app.template7Data['page:results'].pages
        };

        app.hidePreloader();

        window.mainView.router.loadPage('pages/results/results.html');
    }

    /**
     * Shows user a list to select a location
     * 
     * @param  Object data 
     */
    function showLocationsState(data) {
        state     = 2; // ambiguous
        locations = data.locations;

        app.hidePreloader();

        var html = locationsStateCompiled({locations: locations});
        $$('.state-place').html(html);
    }

    /**
     * Shows user a message for an error situation
     * 
     * @param  Object data
     */
    function showErrorState(data) {
        state        = 0; // error
        errorMessage = data.message;

        app.hidePreloader();

        var html = errorStateCompiled({errorMessage: errorMessage});
        $$('.state-place').html(html);
    }

    /**
     * Perform a term based search with de selected location (from location state)
     * 
     * @param  Object location
     */
    function doSearchByTerm(location) {
        app.showPreloader();

        ps.searchByTerm(searchTerm, searchByTermSuccess, searchByTermError);

        function searchByTermSuccess(data) {
            processResponse(data);
        }

        function searchByTermError(data) {
            showErrorState({message: 'Other error'});
        }
    }

    /**
     * Perform a term based search with de selected location (from location state)
     * 
     * @param  Object location
     */
    function doSearchWith(location) {
        state        = 1;
        locations    = [];
        errorMessage = '';
        searchTerm   = location;

        $$('#search-text').val(searchTerm);

        doSearchByTerm();
    }

    /**
     * Loads favourite page
     */
    function goToFavesPage() {

        fs.getAll(favouritesSuccess);

        function favouritesSuccess(faves) {
            // prepare next page data
            app.template7Data['page:favourites'] = {favourites: faves};
            
            window.mainView.router.loadPage('pages/favourites/favourites.html');
        }

    }

    //////////////////////////
    // Events
    //////////////////////////

    $$('.view-main').on('click', '.searchable-list .item-content', function(event) {
        event.preventDefault();

        doSearchWith($$(this).attr('data-term'));
    });

    $$('.view-main').on('click', '#search-by-term', function(event) {
        event.preventDefault();

        searchTerm = $$('#search-text').val();

        doSearchByTerm();
    });

    $$('.view-main').on('click', '#search-by-position', function(event) {
        event.preventDefault();

        app.showPreloader();

        ps.searchByPosition(searchByPositionSuccess, searchByPositionError);

        function searchByPositionSuccess(data) {
            processResponse(data);
        }

        function searchByPositionError(error) {
            showErrorState(error);
        }
    });

    $$('.view-main').on('click', '.go-to-faves', function(event){
       event.preventDefault();
       
       goToFavesPage(); 
    });

    //////////////////////////
    // page config
    //////////////////////////

    app.onPageBeforeInit('main', function(page) {
        if (isIos) {
            $$('.page[data-page=main] .navbar').remove();
        }
    });

    app.onPageBeforeAnimation('main', function(page) {
        getRecentSearches();
    });
})(app, Template7, Dom7, recentSearchesService, propertiesService, appConstants, favouritesService);
