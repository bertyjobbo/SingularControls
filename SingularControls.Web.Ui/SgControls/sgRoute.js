
'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};


// app
SingularControls.RouteModule = angular.module("sgRoute", ['ng', 'ngRoute']);

// 
(function(app, namespace) {
    
    // add config provider
    namespace.SgRouteConfigProvider = [function() {

        // this
        var ts = this;

        // default request methods
        ts.viewRequestMethod = function(controller, action) {
            return "/Views/" + controller + "/" + action + ".html";
        };

        // add method to get view
        ts.configureViewRequestMethod = function(callback) {
            ts.viewRequestMethod = callback;
            return ts;
        };

        // add routes to app
        ts.addRoutesToMyApp = function($routeProvider) {

            // CONSTANT ROUTE
            var constRoute = {
                //templateUrl: $a.getRootedUrl("Singular/NgView/partials/_router/")
                
            };

            // ROUTE CONFIG
            $routeProvider
                .when('/', constRoute)
                .when('/:sgroute_controller/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/:sgroute_param5/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/:sgroute_param5/:sgroute_param6/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/:sgroute_param5/:sgroute_param6/:sgroute_param7/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/:sgroute_param5/:sgroute_param6/:sgroute_param7/:sgroute_param8/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/:sgroute_param5/:sgroute_param6/:sgroute_param7/:sgroute_param8/:sgroute_param9/', constRoute)
                .when('/:sgroute_controller/:sgroute_action/:sgroute_param1/:sgroute_param2/:sgroute_param3/:sgroute_param4/:sgroute_param5/:sgroute_param6/:sgroute_param7/:sgroute_param8/:sgroute_param9/:sgroute_param10/', constRoute)
                .otherwise({
                    redirectTo: '/system/pagenotfound/'
                });


        };

        // get
        this.$get = [function() {
            return ts;
        }];

    }];
    app.provider("sgRouteConfig", namespace.SgRouteConfigProvider);

    // add sg-view directive
    namespace.SgViewDirective = ["sgRouteConfig", "$rootScope", "$compile", "$location", "$route", "$templateCache", "$http", function (sgRouteConfig, $rootScope, $compile, $location, $route, $templateCache, $http) {

        // compile function
        var compileTheView = function (element, scope, htmlToAdd) {

            // html
            var theFinalHtml = "<div ng-controller='" + $rootScope.sgroute.controller + "Controller" +
                "' ng-init='" + $rootScope.sgroute.action + "Action(sgroute.param1,sgroute.param2,sgroute.param3,sgroute.param4,sgroute.param5,sgroute.param6,sgroute.param7,sgroute.param8,sgroute.param9,sgroute.param10)" + "'>" +
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
                $rootScope.sgroute = {
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
                        $rootScope.sgroute.controller = routeData.pathParams.sgroute_controller === undefined ? "home" : routeData.pathParams.sgroute_controller;

                        $rootScope.sgroute.action = routeData.pathParams.sgroute_action === undefined ? "index" : routeData.pathParams.sgroute_action;

                        $rootScope.sgroute.param1 = routeData.pathParams.sgroute_param1;
                        $rootScope.sgroute.param2 = routeData.pathParams.sgroute_param2;
                        $rootScope.sgroute.param3 = routeData.pathParams.sgroute_param3;
                        $rootScope.sgroute.param4 = routeData.pathParams.sgroute_param4;
                        $rootScope.sgroute.param5 = routeData.pathParams.sgroute_param5;
                        $rootScope.sgroute.param6 = routeData.pathParams.sgroute_param6;
                        $rootScope.sgroute.param7 = routeData.pathParams.sgroute_param7;
                        $rootScope.sgroute.param8 = routeData.pathParams.sgroute_param8;
                        $rootScope.sgroute.param9 = routeData.pathParams.sgroute_param9;
                        $rootScope.sgroute.param10 = routeData.pathParams.sgroute_param10;

                        $rootScope.sgroute.view = sgRouteConfig.viewRequestMethod($rootScope.sgroute.controller, $rootScope.sgroute.action);

                        // set view
                        $route.current.templateUrl = $rootScope.sgroute.view;

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

                                    if ($location.$$path !== "/system/pagenotfound" || $location.$$path !== "/system/pagenotfound/")
                                        $location.path("/system/pagenotfound/");
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