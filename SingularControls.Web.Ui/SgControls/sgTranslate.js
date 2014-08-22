
'use strict';

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};

// app
SingularControls.TranslateModule = angular.module("sgTranslate", ['ng']);

// form directive
(function (namespace, app) {

    // controls provider
    namespace.SgTranslateConfigProvider = [function () {

        // this
        var ts = this;

        // PUBLIC!!
        ts.setTranslationRequestPromise = function (promise) {
            ts.getTranslationRequestPromise = promise;
            return ts;
        };

        // PUBLIC !!
        ts.setMaxTranslationCacheLength = function (lngth) {
            ts.maxTranslationCacheLength = lngth < 500 ? 500 : lngth;
            return ts;
        };

        // translation method
        ts.getTranslationRequestPromise = undefined;

        // trans length
        ts.maxTranslationCacheLength = 500;

        // set cache key method
        ts.setCacheKeyMethod = function (theMethod) {
            ts.cacheKeyMethod = theMethod;
            return ts;
        }

        // default
        ts.cacheKeyMethod = function (key) {
            return "$$$" + key + "$$$";
        }

        // provide
        ts.$get = [function () {
            return ts;
        }];

    }];

    // add provider to app
    app.provider("sgTranslateConfig", namespace.SgTranslateConfigProvider);

    // factory for sg translation
    namespace.SgTranslationFactory = ["sgTranslateConfigProvider", function (sgTranslateConfigProvider) {

        var factory = {

            // cache
            translationCache: {

            },

            // get cache length
            getMaxCacheLength: function () {
                return sgTranslateConfigProvider.maxTranslationCacheLength;
            },

            emptyCache: function () {
                this.currentTranslationRequests = {};
                this.currentTranslationResponses = {};
                this.currentTranslationRequestsLength = 0;
                this.translationCacheLength = 0;
                this.translationCache = {};
            },

            // requests / responses
            currentTranslationRequests: {},
            currentTranslationResponses: {},
            currentTranslationRequestsLength: 0,

            // add to translation requests
            addTranslationForCurrentRequest: function (element, attrs) {

                // start key
                var key;
                var fromTitle = false;

                // title
                if (attrs.hasSgTranslateTitle) {
                    key = attrs.sgTranslateTitle;
                    attrs.hasSgTranslateTitle = undefined;
                    fromTitle = true;
                } else {
                    // class
                    if (element.hasClass("sg-translate")) {
                        key = element.html();
                    } else

                        // attribute
                        if (element.attr("sg-translate") !== undefined) {
                            key = attrs.sgTranslate;
                        } else
                            // element
                            if (element[0].tagName == "SG-TRANSLATE") {
                                key = element.html();
                            }
                }

                // check if key present (if not, don't proceed)
                if (key) {

                    // get from cache
                    var fromCache = factory.translationCache[sgTranslateConfigProvider.cacheKeyMethod(key)];

                    // get unique
                    var unique = guid();

                    // check
                    if (fromCache) {
                        factory.currentTranslationResponses[key + "$$" + unique] = {
                            element: element,
                            value: fromCache,
                            attrs: attrs,
                            hasSgTranslateTitle: fromTitle,
                            guid: unique,
                            key: key
                        };
                    } else {

                        // add to current requests
                        factory.currentTranslationRequests[key + "$$" + unique] = { element: element, attrs: attrs, hasSgTranslateTitle: fromTitle, guid: unique, key: key }
                        factory.currentTranslationRequestsLength++;
                    }
                }

            },

            // get translations
            getTranslationsForCurrentRequest: function () {

                var requestsToSend = [];

                for (var req in factory.currentTranslationRequests) {
                    requestsToSend.push(req.split("$$")[0]);
                }

                return sgTranslateConfigProvider.getTranslationRequestPromise(requestsToSend);


            },

            // cache length
            translationCacheLength: 0,

            // Get translations
            getTranslations: function (arrayOfKeys) {

                // output
                var output = {};

                // batched
                var batched = {};
                var batchedCount = 0;

                // promise
                var deferred = factory.$q.defer();

                // loop
                arrayOfKeys.forEach(function (key) {

                    var found = factory.translationCache[sgTranslateConfigProvider.cacheKeyMethod(key)];
                    if (found) {
                        output[key] = found;
                    } else {
                        batched[key] = {};
                        batchedCount++;
                    }

                });

                if (batchedCount > 0 && sgTranslateConfigProvider.getTranslationRequestPromise !== undefined) {

                    // requests
                    var requestsToSend = [];
                    for (var req in batched) {
                        requestsToSend.push(req);
                    }

                    // run promise
                    sgTranslateConfigProvider.getTranslationRequestPromise(requestsToSend).success(function (data) {

                        data.forEach(function (tranlsation) {
                            output[tranlsation.Key] = tranlsation.Value;
                            if (factory.translationCacheLength < sgTranslateConfigProvider.maxTranslationCacheLength) {
                                factory.translationCache[sgTranslateConfigProvider.cacheKeyMethod(tranlsation.Key)] = tranlsation.Value;
                                factory.translationCacheLength++;
                            }

                        });

                        deferred.resolve(output);

                    });
                } else {
                    deferred.resolve(output);
                }

                // return promise
                return deferred.promise;
            },

            $q: undefined,
            $http: undefined,

        }

        this.$get = ["$q", function ($q) {
            factory.$q = $q;
            return factory;
        }];

    }];

    // sg translation factory
    app.provider("sgTranslationFactory", namespace.SgTranslationFactory);

    // translations provider
    namespace.SgTranslationService = [function () {

        // service
        var service = {

            // get translations
            getTranslations: function (arrayOfKeys) {
                return service.sgTranslationFactory.getTranslations(arrayOfKeys);
            },

            // empty cache
            emptyCache: function () {
                service.sgTranslationFactory.emptyCache();
                service.listItemsCache = {};
            },

            // list items cache
            listItemsCache: {},
            listItemsCacheCount: 0,

            // get list items
            getListItems: function (url, data) {

                // key
                var key = url + "$$$" + (data == undefined || data == null || data == "" ? "" : JSON.stringify(data));

                // get from cache
                var fromCache = service.listItemsCache[key];

                // promise
                var deferred = service.$q.defer();

                // check
                if (!fromCache) {
                    service.$http.post(url, data)
                        .success(function (returnData) {
                            if (service.listItemsCacheCount < (service.sgTranslationFactory.getMaxCacheLength() - returnData.length)) {
                                service.listItemsCache[key] = returnData;
                                service.listItemsCacheCount++;
                            }

                            deferred.resolve(returnData);
                        })
                        .error(function (returnData) {
                            deferred.resolve({});
                        });
                } else {
                    deferred.resolve(fromCache);
                }

                //
                return deferred.promise;
            },

            // factory
            sgTranslationFactory: undefined
        }

        // get
        this.$get = ["sgTranslationFactory", "$q", "$http", function (sgTranslationFactory, $q, $http) {
            service.sgTranslationFactory = sgTranslationFactory;
            service.$q = $q;
            service.$http = $http;
            return service;
        }];

    }];

    // add service
    app.provider("sgTranslationService", namespace.SgTranslationService);

    // create directive
    app.directive("sgTranslate", ["sgTranslationFactory", function (sgTranslationFactory) {

        return {

            // settings
            restrict: "AEC",
            requires: "sgTranslateProcessor",
            transclude: false,

            // link
            link: function (scope, element, attrs) {

                //element.attr("style", "display:none");
                sgTranslationFactory.addTranslationForCurrentRequest(element, attrs);
            }

        };

    }]);

    // create directive
    app.directive("sgTranslateTitle", ["sgTranslationFactory", function (sgTranslationFactory) {

        return {

            // settings
            restrict: "A",
            requires: "sgTranslateProcessor",
            transclude: false,

            // link
            link: function (scope, element, attrs) {

                attrs.hasSgTranslateTitle = true;
                //element.attr("style", "display:none");
                sgTranslationFactory.addTranslationForCurrentRequest(element, attrs);
            }

        };

    }]);

    // create directive
    app.directive("sgTranslateProcessor", ["sgTranslateConfig", "sgTranslationFactory", function (sgTranslateConfig, sgTranslationFactory) {

        var setTranslationsInAggregator = function (aggregator) {

            // set elements
            for (var key in sgTranslationFactory.currentTranslationResponses) {

                var resp = sgTranslationFactory.currentTranslationResponses[key];

                // check for title
                if (resp.hasSgTranslateTitle) {
                    resp.element.attr("title", resp.value);
                    resp.element.removeAttr("sg-translate-title");
                } else {

                    // class or attribute
                    if (resp.element.hasClass("sg-translate") || resp.element.attr("sg-translate") !== undefined) {
                        resp.element.html(resp.value);
                    } else

                        // element
                        if (resp.element[0].tagName == "SG-TRANSLATE") {
                            resp.element.after(resp.value);
                            resp.element.remove();
                        }
                }
            }


            // clear requests
            sgTranslationFactory.currentTranslationRequests = {};
            sgTranslationFactory.currentTranslationRequestsLength = 0;

            // clear responses
            sgTranslationFactory.currentTranslationResponses = {};


            // remove
            aggregator.remove();
        };

        return {
            restrict: "AEC",
            transclude: true,
            link: function (scope, aggregator) {

                if (sgTranslateConfig.getTranslationRequestPromise && sgTranslationFactory.currentTranslationRequestsLength > 0) {

                    // get 
                    sgTranslationFactory.getTranslationsForCurrentRequest().success(function (data) {

                        // loop data
                        data.forEach(function (dataItem) {
                            
                            // find element
                            var foundInRequests = [];
                            for (var req in sgTranslationFactory.currentTranslationRequests) {
                                var item = sgTranslationFactory.currentTranslationRequests[req];
                                if (item.key == dataItem.Key) {
                                    foundInRequests.push(item);
                                }
                            }

                            // check
                            if (foundInRequests.length > 0) {

                                for (var foundReq in foundInRequests) {

                                    var foundItem = foundInRequests[foundReq];

                                    // add to responses and cache
                                    sgTranslationFactory.currentTranslationResponses[dataItem.Key + "$$" + foundItem.guid] = {
                                        element: foundItem.element,
                                        value: dataItem.Value,
                                        attrs: foundItem.attrs,
                                        hasSgTranslateTitle: foundItem.hasSgTranslateTitle,
                                        key: dataItem.Key,
                                        guid: foundItem.guid
                                    };

                                    if (sgTranslationFactory.translationCacheLength < sgTranslateConfig.maxTranslationCacheLength) {
                                        sgTranslationFactory.translationCache[sgTranslateConfig.cacheKeyMethod(dataItem.Key)] = dataItem.Value;
                                        sgTranslationFactory.translationCacheLength++;
                                    }

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

})(SingularControls, SingularControls.TranslateModule);