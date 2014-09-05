'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};

// get device provider
var sgDeviceProviderPreAppStart = new SingularControls.SgDeviceProviderPreAppStart();

// all scripts
var allScripts = ['/Scripts/angular.js', '/Scripts/angular-route.js', '/sgcontrols/sgelements.js', '/sgcontrols/sgelements.js', '/sgcontrols/sgform.js', '/sgcontrols/sgroute.js', '/sgcontrols/sgtranslate.js'];

// set up device loads
sgDeviceProviderPreAppStart

    // big screen
    .when("(min-device-width: 481px)", allScripts, function () {
        //console.log("config for >= 480px");
    })

    // small screen
    .when("screen and (min-device-width : 320px) and (max-device-width : 480px)", allScripts, function () {
        //console.log("config for <= 481px");
    })

    // no match
    .else(allScripts, function () {
        //console.log("Else called");
    })

    // go (callback is app setup!!)
    .finalize(function () {

        // set up device provider for angular
        sgDeviceProviderPreAppStart.setUpForAngular();

        // create
        SingularControls.TestApp = angular.module("SingularControls.TestApp", ['ngRoute', 'sgTranslate', 'sgRoute', 'sgForm', 'sgElements', 'sgDevice']);

        // closure
        (function (app) {

            // configure sg routes
            app.config(['sgRouteConfigProvider', '$routeProvider', function (sgRouteConfigProvider, $routeProvider) {

                sgRouteConfigProvider
                    .addAreas(['area1', 'area2'])
                    .maxParams(3)
                    .configureViewRequestMethod(function (controller, action) {
                        return "/NgView/GetView/" + controller + "/" + action;
                    })
                    .configureAreaViewRequestMethod(function (area, controller, action) {
                        return "/NgView/GetAreaView/" + area + "/" + controller + "/" + action;
                    })
                    .onPageNotFound("/system/pagenotfound/")
                    .onError("/system/error/")
                    .finalize($routeProvider);

            }]);

            // configure loader
            app.config(['sgLoaderConfigProvider', function (sgLoaderConfigProvider) {

                // callback
                var dummyFunc = function (callback) {
                    callback();
                };

                // configure
                sgLoaderConfigProvider
                    //.onRouteChange() // probably emit this if using sgRoute! Prevents any conflicts.
                    .onSgRouteChange()
                    .showClass("sg-loader-show")
                    .hideClass("sg-loader-hide")
                    .onBeforeShow(dummyFunc)
                    .onBeforeHide(dummyFunc)
                    .addLoaders({
                        loader1: { html: "<span class='small-loader-1'>Loader 1 - replaces element</span>" },
                        loader2: { html: "<span class='small-loader-2'>Loader 2 - 'after' element</span>" },
                        loader3: {
                            html: "<span class='small-loader-3'>Loader 3 - element with fade</span>",
                            on: 'sg-loader-show',
                            off: 'sg-loader-hide',
                            beforeShow: function (callback) {
                                console.log("beforeShow inline");
                                callback();
                            },
                            beforeHide: function (callback) {
                                console.log("beforeHide inline");
                                callback();
                            }
                        },
                        main: {
                            html: "<div><div class=\"loader-overlay\"></div><div class=\"loader-inner\"></div></div>",
                            on: 'sg-loader-show',
                            off: 'sg-loader-hide',
                            beforeShow: function (callback) {
                                console.log("beforeShow");
                                callback();
                            },
                            beforeHide: function (callback) {
                                console.log("beforeHide");
                                callback();
                            }
                        },
                        main2: {
                            html: "<div><div class=\"loader-overlay\"></div><div class=\"loader-inner\"></div></div>"
                        },
                    });
            }]);

            // configure forms
            app.config(['sgFormConfigProvider', function (sgFormConfigProvider) {

                // add wrapper
                sgFormConfigProvider.addControlWrapper("sgAll", function (label, control) {
                    return "<p>" + label + "<span>" + control + "</span></p>";
                });
            }]);

            // controllers
            app

                // nav
                .controller("navController", ["$scope", function ($scope) {

                    //$scope.getMenuData = function () {
                    //    return {

                    //        brand: {
                    //            href: "/#/",
                    //            text: "Singular Controls"
                    //        },

                    //        items: [
                    //        { href: "/#/", text: "Home" },
                    //        {
                    //            text: "Dropdown",
                    //            items: [
                    //                  { href: "/#/1/", text: 1 },
                    //                  { href: "/#/2/", text: 2 },
                    //                  { href: "/#/3/", text: 3 }]
                    //        }],

                    //        searchbar: '<form class="navbar-form navbar-right" role="search" ng-submit="bsNavCollapsed=true"><div class="form-group">'+'<input type="text" class="form-control" placeholder="Search">'+'</div>'+'<button type="submit" class="btn btn-default">Submit</button></form>'

                    //    };
                    //};

                }])

                // home
                .controller("homeController", ["$scope", function ($scope, cack) {

                    $scope.indexAction = function (a, b, c, d, e, f, g, h, i, j) {


                    }
                }])

                // system
                .controller("systemController", ["$scope", function ($scope) {

                }])

                // example
                .controller("exampleController", ["$window", "$scope", "$rootScope", "sgTranslationService", "$timeout", function ($window, $scope, $rootScope, sgTranslationService, $timeout) {

                    // translate
                    $scope.sgtranslateAction = function () {

                        $scope.$emit("sgLoaderShow");
                        sgTranslationService
                            .getTranslations(["Common:Example using controller", "Common:Example 2 using controller"])
                            .then(function (data) {
                                $scope.translation = data["Common:Example using controller"];
                                $scope.translation2 = data["Common:Example 2 using controller"];
                                $scope.$emit("sgLoaderHide");
                            });

                        $scope.getSgTranslationPromise("This is from GetTranslationPromise in the controller").then(function (d) {
                            $scope.TranslatedValueFromRootScope = d;
                        });
                    };

                    // route
                    $scope.sgrouteAction = function () {

                        console.log($scope.sgRoute);

                    };

                    // element
                    $scope.sgelementsAction = function () {

                        $scope.showAlert = function () {
                            $scope.$emit("sgAlert-main", "I am an alert");
                        };

                        $scope.load1 = function () {
                            $scope.$emit("sgLoaderShow-loader1");
                            $timeout(function () {
                                $scope.$emit("sgLoaderHide-loader1");
                            }, 2000);
                        },
                        $scope.load2 = function () {
                            $scope.$emit("sgLoaderShow-loader2");
                            $timeout(function () {
                                $scope.$emit("sgLoaderHide-loader2");
                            }, 2000);
                        }
                        $scope.load3 = function () {
                            $scope.$emit("sgLoaderShow-loader3");
                            $timeout(function () {
                                $scope.$emit("sgLoaderHide-loader3");
                            }, 2000);
                        }
                        $scope.loadMain = function () {
                            $scope.$emit("sgLoaderShow-main");
                            $timeout(function () {
                                $scope.$emit("sgLoaderHide-main");
                            }, 2000);
                        }
                        $scope.loadMain2 = function () {
                            $scope.$emit("sgLoaderShow-main2");
                            $timeout(function () {
                                $scope.$emit("sgLoaderHide-main2");
                            }, 2000);
                        }

                        $scope.PlaceSelected=function(place) {
                            console.log(place);
                            $scope.Place = place;
                        }
                    };

                }]);

            // device specific stuff inner! Works either way.
            app.run(['sgDeviceService', function (sgDeviceService) {

                // big or small?
                var big = false;
                var small = false;

                // set up
                sgDeviceService

                    // big
                    .when("(min-device-width: 481px)", [], function () {
                        //console.log("config inner for >= 480px");
                        big = true;
                    })

                    // small
                    .when("screen and (min-device-width : 320px) and (max-device-width : 480px)", [], function () {
                        //console.log("config inner for <= 481px");
                        small = true;
                    })

                    // else
                    .else(['/small.js', '/big.js'], function () {
                        //console.log("Else inner called");
                    })

                    // go
                    .finalize(function () {
                        //console.log("Big? ", big);
                        //console.log("Small? ", small);
                    });

            }]);

            // configure translate stuff
            app.run(['sgTranslateConfig', '$http', '$rootScope', function (sgTranslateConfigProvider, $http, $rootScope) {

                // set language code at startup
                $rootScope.languageCode = 'en-GB';

                // config
                sgTranslateConfigProvider

                    // add translation method promise
                    .setTranslationRequestPromise(function (requests) {

                        return $http.post("/api/translation/translations/" + $rootScope.languageCode.toLowerCase(), requests);

                    })

                    // set translation cache length
                    .setMaxTranslationCacheLength(1000)

                    // NEW
                    .onBeforeRequestSent(function (callback) {
                        console.log("sending");
                        callback();
                    })
                    .onAfterResponseReceived(function (callback) {
                        console.log("received");
                        callback();
                    })

                    // tell the provider how to create a cache key
                    .setCacheKeyMethod(function (key) {

                        return $rootScope.languageCode + "$$$" + key;

                    })

                    // tell the provider whether or not to create $rootScope methods
                    .addRootScopeMethods(true);

            }]);

            // other methods
            app.run(["$rootScope", function ($rootScope) {
                $rootScope.stringify = function (obj) {
                    return JSON.stringify(obj);
                }
            }]);

        })(SingularControls.TestApp);

    });