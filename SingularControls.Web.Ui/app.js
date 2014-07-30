


// create
SingularControls.TestApp = angular.module("SingularControls.TestApp", ['ngRoute', 'sgTranslate','sgRoute','sgForm']);

// closure
(function (app) {

    // configure routes
    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when("/", { templateUrl: "Ng/Views/Home.html", controller: "homeController" })
            .when("/about", { templateUrl: "Ng/Views/About.html", controller: "aboutController" });

    }]);

    // configure sg routes
    app.config(['sgRouteConfigProvider', function (sgRouteConfigProvider) {

        sgRouteConfigProvider.configureViewRequestMethod(function(controller,action) {
            return "Ng/Views/" + controller + "/" + action + ".html";
        });

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
    app.config(['sgFormConfigProvider', function(sgFormConfigProvider) {
        
        // add wrapper
        sgFormConfigProvider.addControlWrapper("sgAll", function(label, control) {
            return "<p>" + label + "<span>" + control + "</span></p>";
        });
    }]);


    // controllers
    app
    .controller("homeController", ["$scope", "sgTranslationService", function ($scope, sgTranslationService) {

        $scope.GetData = function () {
            return {
                call: "dummy", data: "here"
            };
        };

        $scope.LabelFromCache = "NOT WORKED";
        sgTranslationService.getTranslations(["Common:Label from controller"]).then(function (data) {
            $scope.LabelFromCache = data["Common:Label from controller"];
        });

    }])
    .controller("aboutController", ["$scope", "sgTranslationService", function ($scope, sgTranslationService) {

        $scope.LabelFromCache = "NOT WORKED";
        sgTranslationService.getTranslations(["Common:Label from controller"]).then(function (data) {
            $scope.LabelFromCache = data["Common:Label from controller"];
        });

    }]);

})(SingularControls.TestApp);


