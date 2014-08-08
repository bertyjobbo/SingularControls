'use strict';

// namespace
if (!SgControls) var SgControls = {};

// module
SgControls.ElementsModule = angular.module("sgElements", ['ng']);

// closure
(function (app, namespace) {

    // nav directive
    namespace.SgNavDirective = ["$compile", function ($compile) {
        return {
            restrict: "A",
            link: function (scope, element) {

                // switch tagname
                var rawElement = element[0];
                switch (rawElement.tagName) {
                    case "NAV":
                        {
                            element.attr("role", "navigation");
                            element.attr("ng-class", "{ hidden: !sgnavopen, showing: sgnavopen }");
                            element.removeAttr("sg-nav");

                            // add click / button etc events
                            var buttons = rawElement.getElementsByTagName("BUTTON");
                            var links = rawElement.getElementsByTagName("A");
                            var submits = rawElement.querySelectorAll("input[type=submit]");
                            for (var i1 = 0; i1 < buttons.length; i1++) {
                                var button = angular.element(buttons[i1]);
                                button.attr("ng-click", "sgnavopen=false;" + button.attr("ng-click"));
                            }
                            for (var i2 = 0; i2 < links.length; i2++) {
                                var link = angular.element(links[i2]);
                                link.attr("ng-click", "sgnavopen=false;" + link.attr("ng-click"));
                            }
                            for (var i3 = 0; i3 < submits.length; i3++) {
                                var submit = angular.element(submits[i3]);
                                submit.attr("ng-click", "sgnavopen=false;" + submit.attr("ng-click"));
                            }

                            // compile all
                            $compile(element)(scope);
                            break;
                        }
                    case "BUTTON":
                        {
                            element.attr("type", "button");
                            element.attr("role", "menubar");
                            if (element.html() == "") {
                                element.html("-<br />-<br />-");
                            }
                            element.attr("ng-click", "sgnavopen = !sgnavopen;");
                            element.attr("ng-init", "sgnavopen=false;");
                            element.removeAttr("sg-nav");
                            $compile(element)(scope);
                            break;
                        }
                    case "A":
                        {
                            element.attr("ng-click", "sgnavopen=false;" + element.attr("ng-click"));
                            element.removeAttr("sg-nav");
                            $compile(element)(scope);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }


            }
        }
    }];
    app.directive("sgNav", namespace.SgNavDirective);

    // loader provider
    namespace.SgLoaderConfigProvider = [function () {

        // this
        var ts = this;

        // props
        ts.doOnRouteChange = false;
        ts.doOnSgRouteChange = false;
        ts.doFade = false;
        ts.doFadeTiming = 0;
        ts.onBeforeShowMethod = undefined;
        ts.onBeforeHideMethod = undefined;
        ts.showClassName = undefined;
        ts.hideClassName = undefined;

        // methods
        ts.onRouteChange = function () {
            ts.doOnRouteChange = true;
            return ts;
        };
        ts.onSgRouteChange = function () {
            ts.doOnSgRouteChange = true;
            return ts;
        };
        ts.showClass = function (cssClass) {
            ts.showClassName = cssClass;
            return ts;
        }
        ts.hideClass = function (cssClass) {
            ts.hideClassName = cssClass;
            return ts;
        }
        ts.onBeforeShow = function (callback) {
            ts.onBeforeShowMethod = callback;
            return ts;
        }
        ts.onBeforeHide = function (callback) {
            ts.onBeforeHideMethod = callback;
            return ts;
        }

        // get
        ts.$get = [function () {
            return ts;
        }];

    }];
    app.provider("sgLoaderConfig", namespace.SgLoaderConfigProvider);

    // loader directive
    namespace.SgLoaderDirective = ['sgLoaderConfig', '$rootScope', function (sgLoaderConfig, $rootScope) {


        return {
            restrict: "AC",
            controller: ['$scope', function ($scope) {

                // check not already set
                if (!$rootScope.sgShowLoaderSet) {

                    // set flag initial
                    $rootScope.sgShowLoaderFlag = true;

                    // setup rootscope sgLoaderShow function
                    $rootScope.$on("sgLoaderShow", function () {
                        $rootScope.sgShowLoaderFlag = true;
                    });

                    // setup rootscope sgLoaderHide function
                    $rootScope.$on("sgLoaderHide", function () {
                        $rootScope.sgShowLoaderFlag = false;
                    });

                    // check if show/hide on route change
                    if (sgLoaderConfig.doOnRouteChange) {

                        // setup route change start event
                        $rootScope.$on("$routeChangeStart", function () {
                            $rootScope.sgShowLoaderFlag = true;
                        });

                        // setup route change start success event
                        $rootScope.$on("$routeChangeSuccess", function () {
                            $rootScope.sgShowLoaderFlag = false;
                        });
                    }

                    if (sgLoaderConfig.doOnSgRouteChange) {
                        $rootScope.sgLoaderOnSgRouteChange = true;
                    }

                    $rootScope.sgShowLoaderSet = true;


                } else {
                    throw "You can only use sgLoader on a single element";
                }
            }],
            link: function (scope, element, attrs) {

                $rootScope.$watch(function () {
                    return $rootScope.sgShowLoaderFlag;
                }, function (changedValue) {

                    if (changedValue) {

                        if (sgLoaderConfig.onBeforeShowMethod !== undefined) {
                            sgLoaderConfig.onBeforeShowMethod(function () {
                                element.addClass(sgLoaderConfig.showClassName);
                                element.removeClass(sgLoaderConfig.hideClassName);
                            });
                        } else {
                            element.addClass(sgLoaderConfig.showClassName);
                            element.removeClass(sgLoaderConfig.hideClassName);
                        }

                    } else {

                        if (sgLoaderConfig.onBeforeHideMethod !== undefined) {
                            sgLoaderConfig.onBeforeHideMethod(function () {
                                element.addClass(sgLoaderConfig.hideClassName);
                                element.removeClass(sgLoaderConfig.showClassName);
                            });
                        } else {
                            element.addClass(sgLoaderConfig.hideClassName);
                            element.removeClass(sgLoaderConfig.showClassName);
                        }
                    }
                }, true);
            }
        };
    }];
    app.directive("sgLoader", namespace.SgLoaderDirective);

    // title directive
    namespace.SgTitleDirective = ["$rootScope", function ($rootScope) {

        return {

            restrict: "AEC",
            link: function (scope, element, attrs) {

                switch (element[0].tagName) {

                    case "TITLE":
                        {
                            $rootScope.sgTitleElement = element;
                            $rootScope.sgTitleElementPrefix = attrs.sgTitle.replace(/\[WHITESPACE\]/g, ' ');;
                            element.removeAttr("sg-title");
                            break;
                        }
                    case "SG-TITLE":
                        {
                            $rootScope.sgTitleElement.html($rootScope.sgTitleElementPrefix + element.html());
                            element.remove();
                            break;
                        }
                }
            }
        }
    }];
    app.directive("sgTitle", namespace.SgTitleDirective);

    // description directive
    namespace.SgDescriptionDirective = ["$rootScope", function ($rootScope) {

        return {
            restrict: "AEC",
            link: function (scope, element, attrs) {
                
                switch (element[0].tagName) {

                    case "META":
                        {
                            element.attr("name", "description");
                            $rootScope.sgDescriptionElement = element;
                            element.removeAttr("sg-description");
                            break;
                        }
                    default:
                        {
                            $rootScope.sgDescriptionElement.attr("content", element.html());
                            element.remove();
                            break;
                        }
                }
            }
        }
    }];
    app.directive("sgDescription", namespace.SgDescriptionDirective);

})(SgControls.ElementsModule, SgControls);