var favouritesService = (function(localforage, _){
    // local copy of favourites
    var favourites = null;

    // public interface
    var service = {
        getAll: getFavourites,
        store: storeFav,
        remove: removeFav,
        isFav: isFav
    };

    return service;

    //////////////////////////////

    /**
     * retrieve stored favourites and cache them in service local variable
     */
    function init(callback) {
        return localforage.getItem('favouriteProperties')
            .then(initComplete)
            .catch(initFailed);

        function initComplete(value) {
            favourites = value;
            callback(favourites);
        }

        function initFailed(error) {
            console.error(error);
        }
    }

    /**
     * Get favourites from local variable or storage
     */
    function getFavourites(callback) {
        if (favourites !== null) {
            callback(favourites);
        } else {
            return init(callback);
        }
    }

    /**
     * Generates key from property
     * 
     * @param Object property
     * @return String Generated key
     */
    function getPropertyKey(property) {
        return window.btoa(property.lister_url);
    }

    /**
     * Check if a property is favourite
     * 
     * @param Object property
     * @return Promise
     */
    function isFav(property, callback) {
        getFavourites(isFavSuccess);

        function isFavSuccess(favourites) {
            var isFav = _.findIndex(favourites, ['key', getPropertyKey(property)]) > -1;
            callback(isFav);
        }
    }

    /**
     * Stores a property in favourites list
     * 
     * @param  Object property
     */
    function storeFav(property) {

        property.key = getPropertyKey(property);

        if (favourites === null || _.isEmpty(favourites)) {
            favourites = [property];
        }
        else {
            // try to find term
            var index = _.findIndex(favourites, ['key', property.key]);

            // update date or insert
            if (index > -1) {
                favourites[index] = property;
            }
            else {
                favourites.push(property);
            }
        }
        
        // update storage
        localforage.setItem('favouriteProperties', favourites);
    }

    /**
     * Remove a property from favourites storage
     * 
     * @param  Object property
     */
    function removeFav(property) {

        // try to find property
        var index = _.findIndex(favourites, ['key', getPropertyKey(property)]);

        // delete element from favourites
        if (index > -1) {
            _.pull(favourites, favourites[index]);
        }
        
        // update storage
        localforage.setItem('favouriteProperties', favourites);
    }
})(localforage, _);