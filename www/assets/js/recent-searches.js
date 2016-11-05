var recentSearchesService = (function(localforage, _){
    // local copy of storage
    var searches = null;

    // public
    var service = {
        get: getRecentSearches,
        store: storeSearch
    };

    return service;

    //////////////////////////////

    /**
     * retrieve stored recent searches and cache them in service local variable
     */
    function init(callback) {
        return localforage.getItem('recentSearches')
            .then(initComplete)
            .catch(initFailed);

        function initComplete(value) {
            searches = value;
            callback(searches);
        }

        function initFailed(error) {
            console.error(error);
        }
    }

    /**
     * Get recent searches
     */
    function getRecentSearches(callback) {
        if (searches !== null) {
            callback(searches);
        } else {
            return init(callback);
        }
    }

    /**
     * Store recent search
     * 
     * @param  Object searchInfo Search to be stored
     */
    function storeSearch(searchInfo) {
        var search = {
            term: searchInfo.term,
            results: searchInfo.results,
            date: new Date().toISOString()
        }

        // no searches stored
        if (searches === null) {
            searches = [search];
        }
        else {
            // try to find term
            var index = _.findIndex(searches, ['term', search.term]);

            // update date or insert
            if (index > -1) {
                searches[index] = search;
            }
            else {
                searches.push(search);
            }

            // order
            searches = _.reverse(_.sortBy(searches, ['date']));

            // only 6 elements
            searches = _.slice(searches, 0, 6);
        }

        // persist storage
        localforage.setItem('recentSearches', searches);
    }
})(localforage, _);