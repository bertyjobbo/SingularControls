// app
var SingularControls = angular.module("sgControls",[]);

// form directive
(function(app) {

    // create directive
    app.directive("sgForm", [function() {

        return {
            
            restrict: "E",
            link:function(scope, element, attrs) {
                alert("Got sgForm");
            }

        };

    }]);

})(SingularControls);