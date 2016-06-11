var storageService = (function(localforage, _){
    var service = {};

    function createRecentSearchs(search) {
        search.date = new Date().toISOString();
        return [search];
    }

    function addSearch(recentSearchs, search) {

        // try to find term
        var index = _.findIndex(recentSearchs, ['term', search.term]);
        
        // update date or insert
        if (index > -1) {
            recentSearchs[index].date = new Date().toISOString();
        }
        else {
            search.date = new Date().toISOString();
            recentSearchs.push(search);
        }

        // order
        recentSearchs = _.reverse(_.sortBy(recentSearchs, ['date']));
        
        // persit only 6 elements
        localforage.setItem('recentSearchs', _.slice(recentSearchs, 0, 6));
    }

    service.addRecentSearch = function(search) {
        localforage.getItem('recentSearchs')
            .then(function(recentSearchs){
                if (recentSearchs === null) {
                    localforage.setItem('recentSearchs', createRecentSearchs(search));
                } else {
                    addSearch(recentSearchs, search);
                }
            });
    };

    service.getRecentSearchs = function() {
        return localforage.getItem('recentSearchs');
    };

    service.destroyRecentSearchs = function() {
        localforage.setItem('recentSearchs', null);
    }

    return service;
})(localforage, _);