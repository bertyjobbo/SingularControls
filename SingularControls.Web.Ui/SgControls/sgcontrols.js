
'use strict';

// app
var SingularControls = {};
SingularControls.Module = angular.module("sgControls", ['ng']);

// form directive
(function (namespace, app) {

    // controls provider
    namespace.SgControlsProvider =  function () {

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
            
            // get list / key
            var list = attrs.sgLangList;
            var key = element.html().toLowerCase();

            // get from cache
            var fromCache = ts.getTranslationFromCache(list, key);
            
            // check
            if (fromCache) {
                ts.currentTranslationResponses[list + ":" + key] = {
                    element: element,
                    value: fromCache
                };
            } else {

                // add to current requests
                ts.currentTranslationRequests[list + ":" + key] = element;
                ts.currentTranslationRequestsLength++;
            }

        };

        // http
        ts.http = undefined;
        
        // get translations
        ts.getTranslationsForCurrentRequest = function () {
            return ts.getTranslationRequestPromise(ts.currentTranslationRequests, ts.http);
        };

        // PUBLIC!!
        ts.setTranslationRequestPromise = function(promise) {
            ts.getTranslationRequestPromise = promise;
            return ts;
        };

        // translation method
        ts.getTranslationRequestPromise = undefined;

        // get translation 
        ts.getTranslationFromCache = function(list, key) {
            return ts.translationCache[list + ":" + key];
        };

        // max cache length
        ts.maxTranslationCacheLength = 1000;

        // cache length
        ts.translationCacheLength = 0;

        // PUBLIC
        ts.setMaxTranslationCacheLength = function(lngth) {
            ts.maxTranslationCacheLength = lngth < 500 ? 500 : lngth;
            return ts;
        };

        // provide
        ts.$get = ["$http", function ($http) {
            ts.http = $http;
            return ts;
        }];
    };

    // add provider to app
    app.provider("sgControlsConfig", namespace.SgControlsProvider);

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
    app.directive("sgLangAggregator", ["sgControlsConfig", function (sgControlsConfig) {

        var setTranslationsInAggregator = function() {

            // set elements
            for (var key in sgControlsConfig.currentTranslationResponses) {

                var resp = sgControlsConfig.currentTranslationResponses[key];

                resp.element.after(resp.value);
            }

            // clear requests
            sgControlsConfig.currentTranslationRequests = {};
            sgControlsConfig.currentTranslationRequestsLength = 0;

            // clear responses
            sgControlsConfig.currentTranslationResponses = {};
        };

        return {
            restrict: "E",
            transclude: false,
            link: function() {

                if (sgControlsConfig.getTranslationRequestPromise && sgControlsConfig.currentTranslationRequestsLength > 0) {

                    // get 
                    sgControlsConfig.getTranslationsForCurrentRequest().success(function(data) {

                        // loop data
                        data.forEach(function(dataItem) {

                            // find element
                            var foundInRequests = sgControlsConfig.currentTranslationRequests[dataItem.ListAndKey];

                            // check
                            if (foundInRequests) {

                                // add to responses and cache
                                sgControlsConfig.currentTranslationResponses[dataItem.ListAndKey] = {
                                    element: foundInRequests,
                                    value: dataItem.TranslatedValue
                                };

                                if (sgControlsConfig.translationCacheLength < sgControlsConfig.maxTranslationCacheLength) {
                                    sgControlsConfig.translationCache[dataItem.ListAndKey] = dataItem.TranslatedValue;
                                    sgControlsConfig.translationCacheLength++;
                                }
                            }
                        });

                        setTranslationsInAggregator();

                    }).error(function(data) {
                        console.log("Error getting translation data: " +
                        (data.Message || "Unknown error"));
                    });
                } else {
                    setTranslationsInAggregator();
                }

            }
        };

    }]);

    // create directive
    app.directive("sgLang", ["sgControlsConfig", function (sgControlsConfig) {

        return {

            // settings
            restrict: "E",
            requires: "sgLangAggregator",
            transclue: true,

            // link
            link: function (scope, element, attrs) {
                element.attr("style", "display:none");
                sgControlsConfig.addTranslationForCurrentRequest(element, attrs);
            }

        };

    }]);

})(SingularControls, SingularControls.Module);