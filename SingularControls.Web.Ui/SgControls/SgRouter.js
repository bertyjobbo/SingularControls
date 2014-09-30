/*
 * 
 * SG ROUTER MODULE
 * 
 */

// module
var SgRouterModule = angular.module("SgRouter", ["ng"]);

// closure
(function (app) {

    // utils
    app.Utils = {

        GetHrefFromCommaSep: function (commaSep, noHash) {

            // create href
            var href = noHash ? "/" : "#";

            // split
            var splt = commaSep.split(',');

            // add to href
            href += splt.join("/");

            //
            return href + "/";
        }
    };

    // provider
    app.provider("sgRoute", [function () {

        // this
        var ts = this;

        // template url
        ts.SetTemplateUrlMethod = function (method) {
            ts.TemplateUrlMethod = method;
            return ts;
        }

        // not found
        ts.SetViewNotFoundRoute = function (route) {
            ts.OnViewNotFoundRoute = route;
            return ts;
        }
        ts.OnViewNotFoundRoute = undefined;

        // sg init?
        ts.UseSgInit = true;
        ts.SetUseSgInit = function (useIt) {
            ts.UseSgInit = useIt;
            return ts;
        }

        // max in cache
        ts.MaxCacheLength = 10;
        ts.SetMaxCacheLength = function (max) {
            if (ts.MaxCacheLength > 4) {
                ts.MaxCacheLength = max;
            }
            return ts;
        }

        // provide
        ts.$get = function () {

            return ts;

        };

    }]);

    // Controller check  // http://stackoverflow.com/questions/19734565/how-to-check-if-an-angularjs-controller-has-been-defined
    app.service('sgControllerChecker', ['$controller', function ($controller) {
        return {
            exists: function (controllerName) {
                if (typeof window[controllerName] == 'function') {
                    return true;
                }
                try {
                    $controller(controllerName);
                    return true;
                } catch (error) {
                    return !(error instanceof TypeError);
                }
            }
        };
    }]);

    // href directive
    app.directive("sgHref", [function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {

                // get href
                var href = app.Utils.GetHrefFromCommaSep(attrs.sgHref);

                // add to element
                element.attr("href", href);
            }
        }

    }]);

    // empty controller
    app.controller("EmptyRouterController", function () {

    });

    // view directive
    app.directive("sgView", ["sgRoute", "$http", "$window", "$rootScope", "$compile", "sgControllerChecker", function (sgRouteProvider, $http, $window, $rootScope, $compile, sgControllerChecker) {

        // checks
        if ($rootScope.SgView) {
            throw "Only a single 'sg-view' directive can be applied per application";
        }
        if (!sgRouteProvider.TemplateUrlMethod) {
            throw "Use sgRouteProvider.SetTemplateUrlMethod(function(controller,action){}); to define how this module gets it's template urls";
        }

        // set root scope
        $rootScope.SgHref = function (commaSep) {
            $window.location.hash = app.Utils.GetHrefFromCommaSep(commaSep, true);
        }

        //
        return {

            restrict: "A",
            link: function (scope, element, attrs) {

                // remove attr!!
                element.removeAttr("sg-view");

                // set sg-view
                $rootScope.SgView = {
                    Element: element,
                    Attributes: attrs,
                    TemplateCache: {},
                    TemplateCacheLength: 0
                };

                // watch
                $rootScope.$watch(function () { return $window.location.hash; }, function (newVal) {

                    // emit event
                    $rootScope.$emit("sgBeforeRouteChange");

                    // Set routing data
                    var splt = newVal.toLowerCase().split("/");
                    splt.splice(0, 1);
                    if (splt[0] == undefined && $window.location.hash != "#") {

                        $window.location = $window.location + "#/";
                        if ($window.location.hash == "##/") $window.location.hash = "#/";

                        return;
                    }
                    if (splt[0] == "") splt[0] = "home";
                    if (!splt[1] || splt[1] == "") splt[1] = "index";
                    var routing = splt;
                    var c = splt[0];
                    var controller = c + "Controller";
                    var action = splt[1];
                    var params = splt.length > 2 ? splt.slice(2) : [];
                    if (params[0] == "") params = [];
                    $rootScope.SgView.CurrentRoute = {
                        RawData: routing,
                        Controller: controller,
                        Action: action,
                        Params: params,
                        TemplateUrl: sgRouteProvider.TemplateUrlMethod(c, action)
                    };



                    // check controller

                    if (!sgControllerChecker.exists($rootScope.SgView.CurrentRoute.Controller)) {
                        $rootScope.SgView.CurrentRoute.Controller = "EmptyRouterController";
                        console.log("Using EmptyRouterController");
                    }


                    // check cache
                    if ($rootScope.SgView.TemplateCache[$rootScope.SgView.CurrentRoute.TemplateUrl] == undefined) {
                        $http
                            .get($rootScope.SgView.CurrentRoute.TemplateUrl)
                            .success(function (d) {
                                
                                // add to cache
                                $rootScope.SgView.TemplateCache[$rootScope.SgView.CurrentRoute.TemplateUrl] = d;

                                // delete cache
                                $rootScope.SgView.TemplateCacheLength++;
                                if ($rootScope.SgView.TemplateCacheLength > sgRouteProvider.MaxCacheLength) {
                                    $rootScope.SgView.TemplateCacheLength--;
                                    for (var cachd in $rootScope.SgView.TemplateCache) {
                                        delete $rootScope.SgView.TemplateCache[cachd];
                                        break;
                                    }
                                }
                                showViewAndFireAction();
                            })
                            .error(function (err) {
                            
                                $rootScope.SgView.LastError = err;
                                console.log(err);
                                if (sgRouteProvider.OnViewNotFoundRoute != undefined)
                                    $window.location.hash = app.Utils.GetHrefFromCommaSep(sgRouteProvider.OnViewNotFoundRoute, true);
                                return;

                            });

                    } else {
                        showViewAndFireAction();
                    }


                }, true);

                // show view etc
                var showViewAndFireAction = function () {
                    
                    // create init method
                    var initMethodString = $rootScope.SgView.CurrentRoute.Action.toTitleCase() + "(";
                    var inner = $rootScope.SgView.CurrentRoute.Params.join(",");
                    if (inner.substr(inner.length - 1, 1) == ",") inner = inner.substr(0, inner.length - 1);
                    initMethodString += inner + ")";

                    // add to element
                    $rootScope.SgView.Element.attr("ng-controller", $rootScope.SgView.CurrentRoute.Controller);
                    $rootScope.SgView.Element.attr(sgRouteProvider.UseSgInit /*&& $rootScope.SgUserData != undefined*/ ? "sg-init" : "ng-init", initMethodString);
                    $rootScope.SgView.Element.html($rootScope.SgView.TemplateCache[$rootScope.SgView.CurrentRoute.TemplateUrl]);
                    $compile($rootScope.SgView.Element)($rootScope);

                    $rootScope.$emit("sgAfterRouteChange");

                };
            }

        };

    }]);

})(SgRouterModule);