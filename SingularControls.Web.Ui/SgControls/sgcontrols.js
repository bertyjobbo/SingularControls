
'use strict';

// app
var SingularControls = {};
SingularControls.Module = angular.module("sgControls", ['ng']);

// form directive
(function (namespace, app) {

    // controls provider
    namespace.SgControlsProvider = [function () {

        // this
        var ts = this;

        // cache
        ts.translationCache = {

        };

        // wrappers
        var wrappers = {};

        // requests / responses
        ts.currentTranslationRequests = {};
        ts.currentTranslationResponses = {};
        ts.currentTranslationRequestsLength = 0;

        // PUBLIC!!
        ts.addControlWrapper = function (which, callback) {
            wrappers[which] = callback;
            return ts;
        };

        // add to translation requests
        ts.addTranslationForCurrentRequest = function (element, attrs) {

            // start key
            var key;

            // check how to get
            key = attrs.sgTranslation;
            if (!key)
                key = element.html();

            // check if key present (if not, don't proceed)
            if (key) {


                // get from cache
                var fromCache = ts.translationCache[key];

                // check
                if (fromCache) {
                    ts.currentTranslationResponses[key] = {
                        element: element,
                        value: fromCache
                    };
                } else {

                    // add to current requests
                    ts.currentTranslationRequests[key] = element;
                    ts.currentTranslationRequestsLength++;
                }
            }

        };

        // get translations
        ts.getTranslationsForCurrentRequest = function () {
            return ts.getTranslationRequestPromise(ts.currentTranslationRequests, ts.$http);
        };

        // PUBLIC!!
        ts.setTranslationRequestPromise = function (promise) {
            ts.getTranslationRequestPromise = promise;
            return ts;
        };

        // translation method
        ts.getTranslationRequestPromise = undefined;

        // max cache length
        ts.maxTranslationCacheLength = 1000;

        // cache length
        ts.translationCacheLength = 0;

        // PUBLIC
        ts.setMaxTranslationCacheLength = function (lngth) {
            ts.maxTranslationCacheLength = lngth < 500 ? 500 : lngth;
            return ts;
        };

        // Get translations
        ts.getTranslations = function (arrayOfKeys) {

            // output
            var output = {};

            // batched
            var batched = {};
            var batchedCount = 0;

            // promise
            var deferred = ts.$q.defer();

            // loop
            arrayOfKeys.forEach(function (key) {

                var found = ts.translationCache[key];
                if (found) {
                    output[key] = found;
                } else {
                    batched[key] = {};
                    batchedCount++;
                }

            });

            if (batchedCount > 0) {

                // run promise
                ts.getTranslationRequestPromise(batched, ts.$http).success(function (data) {

                    data.forEach(function (tranlsation) {
                        output[tranlsation.Key] = tranlsation.Value;
                        if (ts.translationCacheLength < ts.maxTranslationCacheLength) {
                            ts.translationCache[tranlsation.Key] = tranlsation.Value;
                            ts.translationCacheLength++;
                        }

                    });

                    deferred.resolve(output);

                });
            } else {
                deferred.resolve(output);
            }

            // return promise
            return deferred.promise;
        };

        ts.$q = undefined;
        ts.$http = undefined;

        // provide
        ts.$get = ["$q", "$http", function ($q, $http) {
            ts.$q = $q;
            ts.$http = $http;
            return ts;
        }];

    }];

    // add provider to app
    app.provider("sgControlsConfig", namespace.SgControlsProvider);

    // translations provider
    namespace.SgTranslationService = ["sgControlsConfigProvider", function (sgControlsConfigProvider) {

        // this
        var ts = this;

        // get translations
        ts.getTranslations = function (arrayOfKeys) {
            return sgControlsConfigProvider.getTranslations(arrayOfKeys);
        };

        // empty cache
        ts.emptyCache = function () {
            sgControlsConfigProvider.translationCache = {};
        };

        // get
        ts.$get = [function () {
            return ts;
        }];

    }];

    // add service
    app.provider("sgTranslationService", namespace.SgTranslationService);

    // create directive
    app.directive("sgForm", ["sgControlsConfig", function (sgControlsConfig) {

        return {

            //scope: {

            //},

            restrict: "E",

            link: function (scope, element, attrs) {

                // firstly, get data
                var data = scope.$eval(attrs.datasource);

                //
                //console.log("WHATS NEXT", data, sgControlsConfig.wrappers["sgAll"]);
            }

        };

    }]);

    // create directive
    app.directive("sgTranslation", ["sgControlsConfig", function (sgControlsConfig) {

        return {

            // settings
            restrict: "AEC",
            requires: "sgTranslationsProcessor",
            transclude: false,

            // link
            link: function (scope, element, attrs) {

                //element.attr("style", "display:none");
                sgControlsConfig.addTranslationForCurrentRequest(element, attrs);
            }

        };

    }]);

    // create directive
    app.directive("sgTranslationsProcessor", ["sgControlsConfig", function (sgControlsConfig) {

        var setTranslationsInAggregator = function (aggregator) {

            // set elements
            for (var key in sgControlsConfig.currentTranslationResponses) {

                var resp = sgControlsConfig.currentTranslationResponses[key];

                if (resp.element.hasClass("sg-translation") || resp.element.toString().toLowerCase() !== "sg-translation") {
                    resp.element.html(resp.value);
                } else {
                    resp.element.after(resp.value);
                    resp.element.remove();
                }
            }

            // clear requests
            sgControlsConfig.currentTranslationRequests = {};
            sgControlsConfig.currentTranslationRequestsLength = 0;

            // clear responses
            sgControlsConfig.currentTranslationResponses = {};


            // remove
            aggregator.remove();
        };

        return {
            restrict: "AEC",
            transclude: true,
            link: function (scope, aggregator, attrs) {

                if (sgControlsConfig.getTranslationRequestPromise && sgControlsConfig.currentTranslationRequestsLength > 0) {

                    // get 
                    sgControlsConfig.getTranslationsForCurrentRequest().success(function (data) {

                        // loop data
                        data.forEach(function (dataItem) {

                            // find element
                            var foundInRequests = sgControlsConfig.currentTranslationRequests[dataItem.Key];

                            // check
                            if (foundInRequests) {

                                // add to responses and cache
                                sgControlsConfig.currentTranslationResponses[dataItem.Key] = {
                                    element: foundInRequests,
                                    value: dataItem.Value
                                };

                                if (sgControlsConfig.translationCacheLength < sgControlsConfig.maxTranslationCacheLength) {
                                    sgControlsConfig.translationCache[dataItem.Key] = dataItem.Value;
                                    sgControlsConfig.translationCacheLength++;
                                }
                            }
                        });

                        setTranslationsInAggregator(aggregator);

                    }).error(function (data) {
                        console.log("Error getting translation data: " +
                        (data.Message || "Unknown error"));
                    });
                } else {
                    setTranslationsInAggregator(aggregator);
                }

            }
        };

    }]);

})(SingularControls, SingularControls.Module);