var propertiesService = (function ($$, constants) {
    var lastQueryResults  = {},
        searchTerm        = '',
        searchCoordinates = null;

    // public
    var service = {
        searchByTerm: searchByTerm,
        searchByPosition: searchByPosition,
        loadMore: loadMore,
        getLastQueryResults: getLastQueryResults
    };

    return service;

    //////////////////////////////
    // Implementation

    /**
     * Compose url for term based searches
     * 
     * @param  string term Term to search
     * @param  int page Page number
     * @return string URL
     */
    function composeTermUrl(term, page) {
        return constants.PROPERTY_API.baseUrl + '&page=' + page + '&place_name=' + term;
    }

    /**
     * Compose url for location based searches
     * 
     * @param  Object coordinates Geolocation object
     * @param  int page Page number
     * @return string URL
     */
    function composePositionUrl(coordinates, page) {
        return constants.PROPERTY_API.baseUrl + '&page=' + page + '&centre_point=' + 
          coordinates.lat + ',' + coordinates.lng;
    }

    /**
     * Perform a search of properties by term
     * 
     * @param  string term
     * @return Promise
     */
    function searchByTerm(term, successCallback, errorCallback) {
        searchCoordinates = null;
        searchTerm        = term;

        $$.ajax({
           url: composeTermUrl(searchTerm, 1),
           success: searchByTermSuccess,
           error: searchByTermError,
           dataType: 'json',
           timeout: constants.TIMEOUT
        });

        function searchByTermSuccess(response) {
            var processedData = processResponse(response)
            successCallback(processedData);
        }

        function searchByTermError(error) {
            var processedError = processFailedResponse(error, constants.PROPERTY_API.error.messages.GENERIC_ERROR);
            errorCallback(processedError);
        }
    }

    /**
     * Perform search by Position
     * 
     * @return Promise
     */
    function searchByPosition(successCallback, errorCallback) {
        searchCoordinates = null;
        searchTerm        = '';

        // try to get current position
        window.navigator
            .geolocation
            .getCurrentPosition(
                positionSuccess, 
                positionError, 
                { enableHighAccuracy: true, timeout: 5000 }
            );

        function positionSuccess(position) {
            searchCoordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

             $$.ajax({
               url: composePositionUrl(searchCoordinates, 1),
               success: searchByPositionSuccess,
               error: positionError,
               dataType: 'json',
               timeout: constants.TIMEOUT
            });

            function searchByPositionSuccess(response) {
                var processedData = processResponse(response)
                successCallback(processedData);
            }
        }

        function positionError(error) {
            var msg = '';

            if (error.code === error.PERMISSION_DENIED) {
                msg = constants.PROPERTY_API.error.messages.LOCATION_DISABLED;
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                msg = constants.PROPERTY_API.error.messages.LOCATION_UNAVAILABLE;
            }  
            else {
                msg = constants.PROPERTY_API.error.messages.GENERIC_ERROR
            }

            var err = processFailedResponse(error, msg);
            errorCallback(err);
        }
    }

    /**
     * Process successfull response from API
     * 
     * @param  Object data API response
     * @return Object Procesed results
     */
    function processResponse(data) {
        switch (data.response.application_response_code) {
            // OK codes
            case '100':
            case '101':
            case '110':
                // Some properties found
                if (data.response.listings.length) {
                    lastQueryResults = {
                        status: constants.PROPERTY_API.status.SUCCESS,
                        message: '',
                        searchTerm: searchTerm,
                        searchCoordinates: searchCoordinates,
                        page: data.response.page,
                        pages: data.response.total_pages + 1,
                        showing: data.response.listings.length,
                        results: data.response.total_results,
                        properties: data.response.listings
                    };
                }
                // No properties found
                else {
                    lastQueryResults = {
                        status: constants.PROPERTY_API.status.ERROR, 
                        message: 'There were no properties found for the given location.',
                        searchTerm: searchTerm,
                        searchCoordinates: searchCoordinates
                    };
                }

                break;
            // Ambiguous codes
            case '200':
            case '202':
                lastQueryResults = {
                    status: constants.PROPERTY_API.status.AMBIGUOUS, 
                    message: '',
                    searchCoordinates: searchCoordinates,
                    searchTerm: searchTerm,
                    locations: data.response.locations
                };
                break;
            // everything else is considered as error
            default:
                lastQueryResults = processFailedResponse(null, constants.PROPERTY_API.error.messages.GENERIC_ERROR);
        } // switch

        return lastQueryResults;
    }

    /**
     * Process erroneous responses from API
     * 
     * @param  string error Browser description of error
     * @param  string msg Message shown to user
     * @return Object
     */
    function processFailedResponse(error, msg) {
        console.error(error);

        lastQueryResults = {
            status: constants.PROPERTY_API.status.ERROR, // error
            message: msg,
            searchCoordinates: searchCoordinates,
            searchTerm: searchTerm
        };

        return lastQueryResults;
    }

    /**
     * Use last query parameter to get more results by asking for next page.
     * 
     * @return Promise
     */
    function loadMore(successCallback, errorCallback) {
        // Term based search
        if (lastQueryResults.searchCoordinates === null) {
            $$.ajax({
               url: composeTermUrl(lastQueryResults.searchTerm, lastQueryResults.page +1),
               success: loadMoreSuccess,
               error: loadMoreError,
               dataType: 'json',
               timeout: constants.TIMEOUT
            });
        }
        // Location based search
        else {
            $$.ajax({
               url: composePositionUrl(lastQueryResults.searchCoordinates, lastQueryResults.page +1),
               success: loadMoreSuccess,
               error: loadMoreError,
               dataType: 'json',
               timeout: constants.TIMEOUT
            });
        }
        
        function loadMoreSuccess(data) {
            lastQueryResults.page++;
            lastQueryResults.properties = lastQueryResults.properties.concat(data.response.listings);
            lastQueryResults.showing    = lastQueryResults.properties.length;

            successCallback(lastQueryResults);
        }

        function loadMoreError(error) {
            var processedError = processFailedResponse(error, constants.PROPERTY_API.error.messages.GENERIC_ERROR);
            errorCallback(processedError);
        }
    }

    /**
     * Return last results obtained
     * 
     * @return Object
     */
    function getLastQueryResults() {
        return lastQueryResults;
    }

    // return service;
}(Dom7, appConstants));
