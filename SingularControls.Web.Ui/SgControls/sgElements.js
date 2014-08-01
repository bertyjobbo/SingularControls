'use strict';

// namespace
if (!SgControls) var SgControls = {};

// module
SgControls.ElementsModule = angular.module("sgElements", ['ng']);

// closure
(function (app, namespace) {

    // nav directive
    app.directive("sgNav", ["$compile", function ($compile) {
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
                            element.html("-<br />-<br />-");
                            element.attr("ng-click", "alert('!');sgnavopen = !sgnavopen;");
                            element.attr("ng-init", "sgnavopen=false;");
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
    }]);

})(SgControls.ElementsModule, SgControls);