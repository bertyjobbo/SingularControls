


// create
SingularControls.TestApp = angular.module("SingularControls.TestApp", ['ngRoute', 'sgTranslate', 'sgRoute', 'sgForm']);

// closure
(function (app) {

    // configure sg routes
    app.config(['sgRouteConfigProvider', '$routeProvider', function (sgRouteConfigProvider, $routeProvider) {

        sgRouteConfigProvider
            .configureViewRequestMethod(function(controller, action) {
                return "Ng/Views/" + controller + "/" + action + ".html";
            })
            .onPageNotFound("/system/pagenotfound/")
            //.onPageNotFound(function() { alert("Page not found"); })
            .onError("/system/error/")
            //.onError(function(exception, cause) {
            //    alert(exception);
            //    alert(cause);
            //})
            .finalize($routeProvider);

    }]);

    // configure translate stuff
    app.config(['sgTranslateConfigProvider', function (sgTranslateConfigProvider) {

        // config
        sgTranslateConfigProvider

            // add translation method promise
            .setTranslationRequestPromise(function (requests, $http) {

                // TODO - how do you get languageCode?
                var langCode = "en-GB";
                return $http.post("/api/translation/translations/" + langCode.toLowerCase(), requests);

            })

            // set translation cache length
            .setMaxTranslationCacheLength(1000);

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

    // home
    .controller("homeController", ["$scope", function ($scope, cack) {

        $scope.indexAction = function (a, b, c, d, e, f, g, h, i, j) {

            cack.cack();
            //throw "Test exception";

            //console.log(a);
            //console.log(b);
            //console.log(c);
            //console.log(d);
            //console.log(e);
            //console.log(f);
            //console.log(g);
            //console.log(h);
            //console.log(i);
            //console.log(j);
        }
    }])

    // system
    .controller("systemController", ["$scope", function ($scope) {

    }]);



})(SingularControls.TestApp);


