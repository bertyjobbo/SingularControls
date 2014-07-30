
'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};

SingularControls.FormModule = angular.module("sgForm", ['ng']);

// form directive
(function (namespace, app) {

    // controls provider
    namespace.SgFormConfigProvider = [function () {

        // this
        var ts = this;

        // wrappers
        var wrappers = {};

        // PUBLIC!!
        ts.addControlWrapper = function (which, callback) {
            wrappers[which] = callback;
            return ts;
        };

        // provide
        ts.$get = [function () {
            return ts;
        }];

    }];

    // add provider to app
    app.provider("sgFormConfig", namespace.SgFormConfigProvider);

    // create directive
    app.directive("sgForm", ["sgFormConfig", function (sgFormConfig) {

        return {

            //scope: {

            //},

            restrict: "E",

            link: function (scope, element, attrs) {

                // firstly, get data
                var data = scope.$eval(attrs.datasource);

                //
                //console.log("WHATS NEXT", data, sgControlsConfig.wrappers["sgAll"]);
            }

        };

    }]);


})(SingularControls, SingularControls.FormModule);