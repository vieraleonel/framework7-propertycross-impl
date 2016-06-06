var nestoriaService = (function ($$) {
    var service = {};
        URL_PLAIN_SEARCH = 'http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy',
        TIMEOUT = 5000; // 5sec

    function composeURL(searchTerm, page) {
        return URL_PLAIN_SEARCH + '&page=' + page + '&place_name=' + searchTerm;
    }

    service.searchProperties = function(searchTerm, page, successCallback, errorCallback, completeCallback) {
        $$.ajax({
           url: composeURL(searchTerm, page),
           success: successCallback,
           error: errorCallback,
           complete: completeCallback,
           dataType: 'json',
           timeout: TIMEOUT
        });
    }

    return service;
}(Dom7));