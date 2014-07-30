
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
        };

        // get
        this.$get = [function() {
            return ts;
        }];

    }];
    app.provider("sgRouteConfig", namespace.SgRouteConfigProvider);

    // add sg-view directive
    namespace.SgViewDirective = ["sgRouteConfig", function (sgRouteConfig) {

        return {
            
            link: function (scope, element, attrs) {
                console.log(sgRouteConfig);
                element.html("TEST SGROUTE");
            }
        };

    }];
    app.directive("sgView", namespace.SgViewDirective);


})(SingularControls.RouteModule, SingularControls);