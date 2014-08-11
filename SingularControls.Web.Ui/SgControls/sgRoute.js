
'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};


// app
SingularControls.RouteModule = angular.module("sgRoute", ['ng', 'ngRoute']);

// 
(function (app, namespace) {

    // add config provider
    namespace.SgRouteConfigProvider = ["$provide", function ($provide) {

        // this
        var ts = this;

        // add areas
        ts.addAreas = function (arrayOfAreas) {
            ts.areas = ts.areas.concat(arrayOfAreas);
            return ts;
        }

        // areas
        ts.areas = [];

        // max params
        ts.paramsLimit = 10;
        ts.maxParams = function (max) {
            ts.paramsLimit = max;
            return ts;
        }

        // default request methods
        ts.viewRequestMethod = function (controller, action) {
            return "/Views/" + controller + "/" + action + ".html";
        };

        // add method to get view
        ts.configureViewRequestMethod = function (callback) {
            ts.viewRequestMethod = callback;
            return ts;
        };

        // default request methods
        ts.areaViewRequestMethod = function (area, controller, action) {
            return "/Views/" + area + "/" + controller + "/" + action + ".html";
        };

        // add method to get view
        ts.configureAreaViewRequestMethod = function (callback) {
            ts.areaViewRequestMethod = callback;
            return ts;
        };

        // on page not found
        ts.pageNotFoundRouteOrFunction = undefined;
        ts.onPageNotFound = function (routeOrFunction) {
            ts.pageNotFoundRouteOrFunction = routeOrFunction;
            return ts;
        };

        // on error
        ts.onError = function (routeOrFunction) {

            // set factory
            $provide.factory("$exceptionHandler", ["$injector", function ($injector) {
                var $location;

                return function (exception, cause) {

                    // handle custom
                    if (typeof routeOrFunction == "function") {
                        routeOrFunction(exception, cause);
                    } else if (typeof routeOrFunction == "string") {
                        $location = $location || $injector.get("$location");
                        $location.path(routeOrFunction);
                    }
                    console.log("Error handled by sgRoute. Exception =  " + exception);
                    console.log("Error handled by sgRoute. Cause =  " + cause);

                };
            }]);

            //
            return ts;
        };

        // add routes to app
        ts.finalize = function ($routeProvider) {

            // CONSTANT ROUTE
            var constRoute = {};

            // do areas first
            for (var area in ts.areas) {
                
                // name
                var areaName = ts.areas[area];

                // basics
                $routeProvider
                    .when('/' + areaName + "/", constRoute)
                    .when('/' + areaName + '/:sgRoute_controller/', constRoute)
                    .when('/' + areaName + '/:sgRoute_controller/:sgRoute_action/', constRoute);

                // params
                var routeWithParam = '/:sgRoute_controller/:sgRoute_action/';
                for (var i = 0; i < ts.paramsLimit; i++) {
                    routeWithParam += ":sgRoute_param" + (i + 1) + "/";
                    $routeProvider
                    .when('/' + areaName + routeWithParam, constRoute);
                }
            }

            // ROUTE CONFIG basics (post- areas)
            $routeProvider
                .when('/', constRoute)
                .when('/:sgRoute_controller/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/', constRoute);

            // ROUTE CONFIG with params (post - areas)
            // params
            var routeWithParam2 = '/:sgRoute_controller/:sgRoute_action/';
            for (var i2 = 0; i2 < ts.paramsLimit; i2++) {
                routeWithParam2 += ":sgRoute_param" + (i2 + 1) + "/";
                $routeProvider
                .when(routeWithParam2, constRoute);
            }

            // finally
            if (ts.pageNotFoundRouteOrFunction) {
                if (typeof ts.pageNotFoundRouteOrFunction == "string") {
                    $routeProvider.otherwise({
                        redirectTo: ts.pageNotFoundRouteOrFunction
                    });
                }
                if (typeof ts.pageNotFoundRouteOrFunction == "function") {
                    ts.pageNotFoundRouteOrFunction();
                }
            }

        };

        // 

        // get
        this.$get = [function () {
            return ts;
        }];

    }];
    app.provider("sgRouteConfig", namespace.SgRouteConfigProvider);

    // add sg-view directive
    namespace.SgViewDirective = ["sgRouteConfig", "$rootScope", "$compile", "$location", "$route", "$templateCache", "$http", "$window", function (sgRouteConfig, $rootScope, $compile, $location, $route, $templateCache, $http, $window) {

        // compile function
        var compileTheView = function (element, scope, htmlToAdd) {

            // html
            var theFinalHtml = "<div ng-controller='" + $rootScope.sgRoute.controller + "Controller" +
                "' ng-init='" + $rootScope.sgRoute.action + "Action(sgRoute.param1,sgRoute.param2,sgRoute.param3,sgRoute.param4,sgRoute.param5,sgRoute.param6,sgRoute.param7,sgRoute.param8,sgRoute.param9,sgRoute.param10)" + "'>" +
                htmlToAdd +
                "</div>";

            // compiled
            var compiled = $compile(theFinalHtml)(scope);

            // compile
            element.html("");
            element.append(compiled);


        }

        return {

            restrict: "A",
            link: function (scope, element, attrs) {

                // add props to root scope
                $rootScope.sgRoute = {};

                // add listener
                scope.$on("$routeChangeSuccess", function (ev, routeData) {

                    // auto scroll
                    if (attrs.autoscroll != "false") {
                        $window.scrollTo(0, 0);
                    }

                    if ($rootScope.sgLoaderOnSgRouteChange) {

                        // fire event 
                        scope.$emit("sgLoaderShow");
                    }

                    // check route data for redirects etc
                    if (
                        $route.current !== undefined &&
                        //(routeData.redirectTo === undefined || routeData.redirectTo === null || routeData.redirectTo === "")
                        true
                        ) {

                        // get route data
                        $rootScope.sgRoute.controller = routeData.pathParams.sgRoute_controller === undefined ? "home" : routeData.pathParams.sgRoute_controller.toLowerCase();

                        $rootScope.sgRoute.action = routeData.pathParams.sgRoute_action === undefined ? "index" : routeData.pathParams.sgRoute_action.toLowerCase();

                        for (var i = 0; i < sgRouteConfig.paramsLimit; i++) {
                            $rootScope.sgRoute["param" + (i + 1)] = routeData.pathParams["sgRoute_param" + (i + 1)];
                        }

                        // area stuff
                        var potentialArea = routeData.originalPath.split('/')[1];
                        var isArea = potentialArea !== undefined && potentialArea !== "" && potentialArea !== ":sgRoute_controller";
                        $rootScope.sgRoute.area = isArea ? potentialArea : "";

                        // route view
                        $rootScope.sgRoute.view =
                            isArea ?
                            sgRouteConfig.areaViewRequestMethod($rootScope.sgRoute.area, $rootScope.sgRoute.controller, $rootScope.sgRoute.action)
                            :
                            sgRouteConfig.viewRequestMethod($rootScope.sgRoute.controller, $rootScope.sgRoute.action);

                        // set view
                        $route.current.templateUrl = $rootScope.sgRoute.view;

                        // get from cache
                        var cachedTemplate = $templateCache.get($route.current.templateUrl);

                        // check 
                        if (cachedTemplate === undefined) {

                            // get
                            $http({ method: 'get', url: $route.current.templateUrl })
                                .success(function (data) {

                                    // put in cache
                                    $templateCache.put($route.current.templateUrl, data);

                                    if ($rootScope.sgLoaderOnSgRouteChange) {

                                        // fire event 
                                        scope.$emit("sgLoaderHide");

                                    }

                                    // compile
                                    compileTheView(element, scope, data);

                                })
                                .error(function (data, status, headers, config) {

                                    // check if page not found set
                                    if (sgRouteConfig.pageNotFoundRouteOrFunction !== undefined) {
                                        console.log(sgRouteConfig.pageNotFoundRouteOrFunction);
                                        // check it's a string (route)
                                        if (typeof sgRouteConfig.pageNotFoundRouteOrFunction == "string") {
                                            if ($location.$$path !== sgRouteConfig.pageNotFoundRouteOrFunction) {
                                                $location.path(sgRouteConfig.pageNotFoundRouteOrFunction);
                                            }
                                        } else if (typeof sgRouteConfig.pageNotFoundRouteOrFunction == "function") {
                                            sgRouteConfig.pageNotFoundRouteOrFunction();
                                        }
                                    }

                                    if ($rootScope.sgLoaderOnSgRouteChange) {

                                        // fire event 
                                        scope.$emit("sgLoaderHide");

                                    }
                                });


                        } else {

                            // compile cached
                            compileTheView(element, scope, cachedTemplate);

                            if ($rootScope.sgLoaderOnSgRouteChange) {

                                // fire event 
                                scope.$emit("sgLoaderHide");
                            }
                        }
                    }

                });
            }
        };

    }];
    app.directive("sgView", namespace.SgViewDirective);


})(SingularControls.RouteModule, SingularControls);