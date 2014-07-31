
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

        // default request methods
        ts.viewRequestMethod = function (controller, action) {
            return "/Views/" + controller + "/" + action + ".html";
        };

        // add method to get view
        ts.configureViewRequestMethod = function (callback) {
            ts.viewRequestMethod = callback;
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
            var constRoute = {
                //templateUrl: $a.getRootedUrl("Singular/NgView/partials/_router/")

            };

            // ROUTE CONFIG
            $routeProvider
                .when('/', constRoute)
                .when('/:sgRoute_controller/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/:sgRoute_param5/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/:sgRoute_param5/:sgRoute_param6/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/:sgRoute_param5/:sgRoute_param6/:sgRoute_param7/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/:sgRoute_param5/:sgRoute_param6/:sgRoute_param7/:sgRoute_param8/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/:sgRoute_param5/:sgRoute_param6/:sgRoute_param7/:sgRoute_param8/:sgRoute_param9/', constRoute)
                .when('/:sgRoute_controller/:sgRoute_action/:sgRoute_param1/:sgRoute_param2/:sgRoute_param3/:sgRoute_param4/:sgRoute_param5/:sgRoute_param6/:sgRoute_param7/:sgRoute_param8/:sgRoute_param9/:sgRoute_param10/', constRoute)
                .otherwise({
                    redirectTo: '/system/pagenotfound/'
                });


        };

        // 

        // get
        this.$get = [function () {
            return ts;
        }];

    }];
    app.provider("sgRouteConfig", namespace.SgRouteConfigProvider);

    // add sg-view directive
    namespace.SgViewDirective = ["sgRouteConfig", "$rootScope", "$compile", "$location", "$route", "$templateCache", "$http", function (sgRouteConfig, $rootScope, $compile, $location, $route, $templateCache, $http) {

        // compile function
        var compileTheView = function (element, scope, htmlToAdd) {

            // html
            var theFinalHtml = "<div ng-controller='" + $rootScope.sgRoute.controller + "Controller" +
                "' ng-init='" + $rootScope.sgRoute.action + "Action(sgroute.param1,sgroute.param2,sgroute.param3,sgroute.param4,sgroute.param5,sgroute.param6,sgroute.param7,sgroute.param8,sgroute.param9,sgroute.param10)" + "'>" +
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
                $rootScope.sgRoute = {
                    controller: undefined,
                    action: undefined,
                    id: undefined,
                    view: undefined
                }

                // add listener
                scope.$on("$routeChangeSuccess", function (ev, routeData) {

                    // check route data for redirects etc
                    if (
                        $route.current !== undefined &&
                        (routeData.redirectTo === undefined || routeData.redirectTo === null || routeData.redirectTo === "")
                        ) {

                        // get route data
                        $rootScope.sgRoute.controller = routeData.pathParams.sgRoute_controller === undefined ? "home" : routeData.pathParams.sgRoute_controller;

                        $rootScope.sgRoute.action = routeData.pathParams.sgRoute_action === undefined ? "index" : routeData.pathParams.sgRoute_action;

                        $rootScope.sgRoute.param1 = routeData.pathParams.sgRoute_param1;
                        $rootScope.sgRoute.param2 = routeData.pathParams.sgRoute_param2;
                        $rootScope.sgRoute.param3 = routeData.pathParams.sgRoute_param3;
                        $rootScope.sgRoute.param4 = routeData.pathParams.sgRoute_param4;
                        $rootScope.sgRoute.param5 = routeData.pathParams.sgRoute_param5;
                        $rootScope.sgRoute.param6 = routeData.pathParams.sgRoute_param6;
                        $rootScope.sgRoute.param7 = routeData.pathParams.sgRoute_param7;
                        $rootScope.sgRoute.param8 = routeData.pathParams.sgRoute_param8;
                        $rootScope.sgRoute.param9 = routeData.pathParams.sgRoute_param9;
                        $rootScope.sgRoute.param10 = routeData.pathParams.sgRoute_param10;

                        $rootScope.sgRoute.view = sgRouteConfig.viewRequestMethod($rootScope.sgRoute.controller, $rootScope.sgRoute.action);

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

                                });
                        } else {

                            // compile cached
                            compileTheView(element, scope, cachedTemplate);
                        }
                    }

                });
            }
        };

    }];
    app.directive("sgView", namespace.SgViewDirective);


})(SingularControls.RouteModule, SingularControls);