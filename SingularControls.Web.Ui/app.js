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
                    .onBeforeHide(dummyFunc);
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
                .controller("exampleController", ["$window", "$scope", "$rootScope", "sgTranslationService", function ($window, $scope, $rootScope, sgTranslationService) {

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
                    };

                    // route
                    $scope.sgrouteAction = function () {

                        console.log($scope.sgRoute);

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
            app.run(['sgTranslateConfig', '$http', function (sgTranslateConfigProvider, $http) {

                // config
                sgTranslateConfigProvider

                    // add translation method promise
                    .setTranslationRequestPromise(function (requests) {

                        // TODO - how do you get languageCode?
                        var langCode = "en-GB";
                        return $http.post("/api/translation/translations/" + langCode.toLowerCase(), requests);

                    })

                    // set translation cache length
                    .setMaxTranslationCacheLength(1000);

            }]);

        })(SingularControls.TestApp);

    });