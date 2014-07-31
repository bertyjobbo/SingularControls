'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};

// app
SingularControls.SgBootstrapModule = angular.module("sgBootstrap", ['ng']);

// scope
(function (app, namespace) {

    // directive
    app.directive("sgBootstrapNavbar", ["$compile", function ($compile) {

        return {

            restrict: "E",
            link: function (scope, element, attrs) {

                // get data
                if (attrs.menuData) {

                    var data = scope.$eval(attrs.menuData);

                    // check and try to get from markup
                    if (!data) {

                        // start
                        var tempData = {};

                        // brand
                        var brand = element[0].getElementsByTagName("brand");

                        if (brand.length > 0) {
                            tempData.brand = {
                                href: brand[0].getAttribute("href"),
                                text: brand[0].innerHTML
                            };
                        };

                        // items
                        var items = element[0].getElementsByTagName("ITEMS");

                        if (items.length > 0) {

                            // items
                            tempData.items = [];

                            // get <item> elements in <items>
                            var innerItems = items[0].children;

                            // loop
                            for (var i = 0; i < innerItems.length; i++) {

                                // inner item
                                var innerItem = innerItems[i];

                                // check tag
                                if (innerItem.tagName == "ITEM") {

                                    // check if it has children
                                    var childInnerItems = innerItem.getElementsByTagName("ITEMS");
                                    if (childInnerItems.length > 0) {

                                        // create item to push
                                        var dropDownItem = { text: innerItem.innerHTML.split('<')[0], items: [] };

                                        // drop down
                                        var dropDownListOfItems =
                                            childInnerItems[0].getElementsByTagName("ITEM");

                                        //
                                        for (var i2 = 0; i2 < dropDownListOfItems.length; i2++) {
                                            var dropDownChildItem = dropDownListOfItems[i2];
                                            dropDownItem.items.push({
                                                href: dropDownChildItem.getAttribute("href"),
                                                text: dropDownChildItem.innerHTML
                                            });

                                        }

                                        //
                                        tempData.items.push(dropDownItem);

                                    } else { // normal item
                                        tempData.items.push({
                                            href: innerItem.getAttribute("href"),
                                            text: innerItem.innerHTML
                                        });
                                    }
                                }

                            }
                        }

                        // search bar
                        var searchBar = element[0].getElementsByTagName("SEARCHBAR");
                        if (searchBar.length > 0) {
                            tempData.searchbar = searchBar[0].innerHTML;
                        }

                        data = tempData;
                    }

                    // output
                    var output =
                        "<nav class=\"navbar navbar-default\" role=\"navigation\">" +
                            "<div class=\"container-fluid\">" +
                                "<div class=\"navbar-header\">";

                    // set button
                    output += '<button type="button" class="navbar-toggle" ng-init="bsNavCollapsed = true;bsInnerNavCollapsed = true; bsInnerNav2Collapsed=true;" ng-click="bsNavCollapsed = !bsNavCollapsed">' + '<span class="sr-only">Toggle navigation</span>' + '<span class="icon-bar"></span>' + '<span class="icon-bar"></span>' + '<span class="icon-bar"></span>' + '</button>';

                    // set brand and end navbar-header
                    output += '<a title="' + data.brand.text + '" class="navbar-brand" href="' + data.brand.href + '">' + data.brand.text + '</a></div>';

                    // start collapsable
                    output += "<div class=\"collapse navbar-collapse\" ng-class=\"{' in ':!bsNavCollapsed}\">";

                    // search bar
                    if (data.searchbar && data.searchbar != "") {
                        output += data.searchbar;
                    }

                    // start items
                    output += "<ul class=\"nav navbar-nav navbar-right\">";

                    // loop items
                    for (var itemIndex = 0; itemIndex < data.items.length; itemIndex++) {

                        // get item
                        var item = data.items[itemIndex];

                        // check
                        if (item.items) {

                            // start drop down
                            output += '<li class="dropdown"><a href="" class="dropdown-toggle" ng-click="bsInnerNavCollapsed = !bsInnerNavCollapsed">' + item.text + '<span class="caret"></span></a>' + '<ul class="dropdown-menu" ng-focus="!bsInnerNavCollapsed" style="display:block;" role="menu" ng-show="!bsInnerNavCollapsed">';

                            // loop inner items
                            for (var innerItemIndex = 0; innerItemIndex < item.items.length; innerItemIndex++) {
                                var ddItem = item.items[innerItemIndex];

                                output += '<li><a title="' + ddItem.text + '" href="' + ddItem.href + '" ng-click="bsNavCollapsed = true;bsInnerNavCollapsed = true;">' + ddItem.text + '</a></li>';

                            }

                            // end drop down
                            output += "</ul></li>";

                        } else {
                            output += '<li><a title="' + item.text + '" href="' + item.href + '" ng-click="bsNavCollapsed = true">' + item.text + '</a></li>';
                        }

                    }

                    // end items
                    output += "</ul></div>";

                    // finally
                    output += "</div></nav>";

                    // set element
                    var compiledOutput = $compile(output)(scope);
                    element.after(compiledOutput);
                    element.remove();


                }

            }

        };

    }]);

})(SingularControls.SgBootstrapModule, SingularControls);