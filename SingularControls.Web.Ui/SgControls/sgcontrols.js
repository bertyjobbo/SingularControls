// app
var SingularControls = {};
SingularControls.Module = angular.module("sgControls", ['ng']);

// form directive
(function(namespace, app) {

    // controls provider
    namespace.SgControlsProvider =  function () {

        // this
        var ts = this;

        // wrappers
        ts.wrappers = [];

        // this
        ts.addControlWrapper = function (which, callback) {
            ts.wrappers[which] = callback;
        };

        // provide
        ts.$get = [function() {
            return ts;
        }];
    };

    // add provider to app
    app.provider("sgControlsConfig", namespace.SgControlsProvider);

    // create directive
    app.directive("sgForm", ["sgControlsConfig", function (sgControlsConfig) {

        return {

            //scope: {
                
            //},

            restrict: "E",

            link:function(scope, element, attrs) {

                // firstly, get data
                var data = scope.$eval(attrs.datasource);

                //
                console.log("WHATS NEXT", data, sgControlsConfig.wrappers["sgAll"]);
            }

        };

    }]);

})(SingularControls, SingularControls.Module);