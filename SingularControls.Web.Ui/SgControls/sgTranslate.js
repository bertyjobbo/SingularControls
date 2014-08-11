
'use strict';

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
                    var fromCache = factory.translationCache[key];

                    // check
                    if (fromCache) {
                        factory.currentTranslationResponses[key] = {
                            element: element,
                            value: fromCache,
                            attrs: attrs,
                            hasSgTranslateTitle:fromTitle
                        };
                    } else {

                        // add to current requests
                        factory.currentTranslationRequests[key] = { element: element, attrs: attrs, hasSgTranslateTitle: fromTitle }
                        factory.currentTranslationRequestsLength++;
                    }
                }

            },

            // get translations
            getTranslationsForCurrentRequest: function () {

                var requestsToSend = [];

                for (var req in factory.currentTranslationRequests) {
                    requestsToSend.push(req);
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

                    var found = factory.translationCache[key];
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
                                factory.translationCache[tranlsation.Key] = tranlsation.Value;
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
                service.sgTranslationFactory.translationCache = {};
            },

            sgTranslationFactory: undefined
        }

        // get
        this.$get = ["sgTranslationFactory", function (sgTranslationFactory) {
            service.sgTranslationFactory = sgTranslationFactory;
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
                            var foundInRequests = sgTranslationFactory.currentTranslationRequests[dataItem.Key];

                            // check
                            if (foundInRequests) {

                                // add to responses and cache
                                sgTranslationFactory.currentTranslationResponses[dataItem.Key] = {
                                    element: foundInRequests.element,
                                    value: dataItem.Value,
                                    attrs: foundInRequests.attrs,
                                    hasSgTranslateTitle: foundInRequests.hasSgTranslateTitle
                                };

                                if (sgTranslationFactory.translationCacheLength < sgTranslateConfig.maxTranslationCacheLength) {
                                    sgTranslationFactory.translationCache[dataItem.Key] = dataItem.Value;
                                    sgTranslationFactory.translationCacheLength++;
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