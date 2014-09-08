'use strict';

// namespace
if (!SgControls) var SgControls = {};

// module
SgControls.ElementsModule = angular.module("sgElements", ['ng']);

// closure
(function (app, namespace) {

    // nav directive
    namespace.SgNavDirective = ["$compile", "$rootScope", function ($compile, $rootScope) {
        return {
            restrict: "A",
            link: function (scope, element) {

                // on success
                $rootScope.$on("$routeChangeSuccess", function () {
                    scope.sgnavopen = false;
                });

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
                            if (element.html() == "") {
                                element.html("-<br />-<br />-");
                            }
                            element.attr("ng-click", "sgnavopen = !sgnavopen;");
                            element.attr("ng-init", "sgnavopen=false;");
                            element.removeAttr("sg-nav");
                            $compile(element)(scope);
                            break;
                        }
                    case "A":
                        {
                            element.attr("ng-click", "sgnavopen=false;" + element.attr("ng-click"));
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
    }];
    app.directive("sgNav", namespace.SgNavDirective);

    // loader provider
    namespace.SgLoaderConfigProvider = [function () {

        // this
        var ts = this;

        // props
        ts.doOnRouteChange = false;
        ts.doOnSgRouteChange = false;
        ts.doFade = false;
        ts.doFadeTiming = 0;
        ts.onBeforeShowMethod = undefined;
        ts.onBeforeHideMethod = undefined;
        ts.showClassName = undefined;
        ts.hideClassName = undefined;
        ts.loaders = {};
        ts.namedLoaderElements = {};
        ts.setLoaders = undefined;
        ts.namedLoaderEvents = [];

        // methods
        ts.onRouteChange = function () {
            ts.doOnRouteChange = true;
            return ts;
        };
        ts.onSgRouteChange = function () {
            ts.doOnSgRouteChange = true;
            return ts;
        };
        ts.showClass = function (cssClass) {
            ts.showClassName = cssClass;
            return ts;
        }
        ts.hideClass = function (cssClass) {
            ts.hideClassName = cssClass;
            return ts;
        }
        ts.onBeforeShow = function (callback) {
            ts.onBeforeShowMethod = callback;
            return ts;
        }
        ts.onBeforeHide = function (callback) {
            ts.onBeforeHideMethod = callback;
            return ts;
        }
        ts.addLoaders = function (theLoaders) {

            ts.setLoaders = function (rootScope) {


                ts.theBody = angular.element(document.body);
                var loaderHtml, key;


                // loop and create event shells
                for (var l in theLoaders) {

                    // set
                    key = l;
                    loaderHtml = theLoaders[key].html;

                    // add
                    ts.loaders[key] = loaderHtml;
                    ts.namedLoaderElements[key] = [];
                    ts.namedLoaderEvents.push({
                        key: key,
                        html: loaderHtml,
                        on: theLoaders[key].on,
                        off: theLoaders[key].off,
                        beforeShow: theLoaders[key].beforeShow,
                        beforeHide: theLoaders[key].beforeHide
                    });
                }

                // create events
                ts.namedLoaderEvents.forEach(function (evnt) {

                    // set pre stuff
                    var showEventName = "sgLoaderShow-" + evnt.key;
                    if (!evnt.beforeShow) evnt.beforeShow = function (callback) { callback(); }
                    if (!evnt.beforeHide) evnt.beforeHide = function (callback) { callback(); }

                    rootScope.$on(showEventName, function () {

                        evnt.beforeShow(function () {

                            if (!evnt.set) {

                                // set
                                evnt.set = true;

                                // find elements
                                evnt.elementObjects = ts.namedLoaderElements[evnt.key];

                                // find html
                                evnt.loader = angular.element(ts.loaders[evnt.key]);
                            }

                            // check
                            if (evnt.elementObjects && evnt.elementObjects.length > 0) {

                                // loop
                                evnt.elementObjects.forEach(function (elObj) {

                                    // check fade
                                    if (evnt.on && evnt.off) {
                                        elObj.element.addClass(evnt.off);
                                    } else {
                                        // check and replace
                                        if (elObj.replace) {
                                            elObj.element.__display = elObj.element.css("display");
                                            elObj.element.css("display", "none");
                                        }
                                    }

                                    if (evnt.on && evnt.off && !elObj.added) {
                                        elObj.added = true;
                                        elObj.element.after(evnt.loader);
                                    } else {
                                        elObj.element.after(evnt.loader);
                                    }


                                });
                            } else {
                                // check on / off
                                if (evnt.on && evnt.off) {
                                    if (!evnt.added) {
                                        evnt.added = true;
                                        ts.theBody.append(evnt.loader);
                                    }
                                    evnt.loader.removeClass(evnt.off);
                                    evnt.loader.addClass(evnt.on);
                                } else {
                                    ts.theBody.append(evnt.loader);
                                }

                            }
                        });

                    });

                    // hide event
                    var hideEventName = "sgLoaderHide-" + evnt.key;
                    rootScope.$on(hideEventName, function () {

                        evnt.beforeHide(function () {

                            // check
                            if (evnt.elementObjects && evnt.elementObjects.length > 0) {

                                // loop
                                evnt.elementObjects.forEach(function (elObj) {

                                    // check fade
                                    if (evnt.on && evnt.off) {
                                        elObj.element.removeClass(evnt.off);
                                        elObj.element.addClass(evnt.on);
                                    }

                                    // check and replace
                                    if (elObj.replace) {
                                        elObj.element.css("display", elObj.element.__display);
                                    }
                                });
                            }

                            if (evnt.on && evnt.off) {
                                evnt.loader.removeClass(evnt.on);
                                evnt.loader.addClass(evnt.off);
                            } else {
                                evnt.loader.remove();
                            }


                        });
                    });

                });
            }
        }

        // get
        ts.$get = ['$rootScope', function ($rootScope) {
            ts.setLoaders($rootScope);
            return ts;
        }];

    }];
    app.provider("sgLoaderConfig", namespace.SgLoaderConfigProvider);

    // loader directive
    namespace.SgLoaderDirective = ['sgLoaderConfig', '$rootScope', function (sgLoaderConfig, $rootScope) {


        return {
            restrict: "AC",
            link: function (scope, element, attrs) {

                // check attrs
                var namedAttr = attrs.sgLoader;

                // named
                if (namedAttr) {

                    // split
                    var splt = namedAttr.split('|');

                    if (sgLoaderConfig.namedLoaderElements[splt[0]]) {

                        // this is a single element which may need to be shown / hidden
                        sgLoaderConfig.namedLoaderElements[splt[0]].push({
                            element: element,
                            sibling: splt.indexOf('sibling') > -1,
                            replace: splt.indexOf('replace') > -1
                        });

                    }

                }
                else {
                    $rootScope.$watch(function () {
                        return $rootScope.sgShowLoaderFlag;
                    }, function (changedValue) {

                        if (changedValue) {

                            if (sgLoaderConfig.onBeforeShowMethod !== undefined) {
                                sgLoaderConfig.onBeforeShowMethod(function () {
                                    element.addClass(sgLoaderConfig.showClassName);
                                    element.removeClass(sgLoaderConfig.hideClassName);
                                });
                            } else {
                                element.addClass(sgLoaderConfig.showClassName);
                                element.removeClass(sgLoaderConfig.hideClassName);
                            }

                        } else {

                            if (sgLoaderConfig.onBeforeHideMethod !== undefined) {
                                sgLoaderConfig.onBeforeHideMethod(function () {
                                    element.addClass(sgLoaderConfig.hideClassName);
                                    element.removeClass(sgLoaderConfig.showClassName);
                                });
                            } else {
                                element.addClass(sgLoaderConfig.hideClassName);
                                element.removeClass(sgLoaderConfig.showClassName);
                            }
                        }
                    }, true);


                    // check not already set
                    if (!$rootScope.sgShowLoaderSet) {

                        // set flag initial
                        $rootScope.sgShowLoaderFlag = true;

                        // setup rootscope sgLoaderShow function
                        $rootScope.$on("sgLoaderShow", function () {
                            $rootScope.sgShowLoaderFlag = true;
                        });

                        // setup rootscope sgLoaderHide function
                        $rootScope.$on("sgLoaderHide", function () {
                            $rootScope.sgShowLoaderFlag = false;
                        });

                        // check if show/hide on route change
                        if (sgLoaderConfig.doOnRouteChange) {

                            // setup route change start event
                            $rootScope.$on("$routeChangeStart", function () {
                                $rootScope.sgShowLoaderFlag = true;
                            });

                            // setup route change start success event
                            $rootScope.$on("$routeChangeSuccess", function () {
                                $rootScope.sgShowLoaderFlag = false;
                            });
                        }

                        if (sgLoaderConfig.doOnSgRouteChange) {
                            $rootScope.sgLoaderOnSgRouteChange = true;
                        }

                        $rootScope.sgShowLoaderSet = true;

                    }
                }
            }
        };
    }];
    app.directive("sgLoader", namespace.SgLoaderDirective);

    // title directive
    namespace.SgTitleDirective = ["$rootScope", function ($rootScope) {

        return {

            restrict: "AEC",
            link: function (scope, element, attrs) {

                switch (element[0].tagName) {

                    case "TITLE":
                        {
                            $rootScope.sgTitleElement = element;
                            $rootScope.sgTitleElementPrefix = attrs.sgTitle.replace(/\[WHITESPACE\]/g, ' ');;
                            element.removeAttr("sg-title");
                            break;
                        }
                    case "SG-TITLE":
                        {
                            $rootScope.sgTitleElement.html($rootScope.sgTitleElementPrefix + element.html());
                            element.remove();
                            break;
                        }
                }
            }
        }
    }];
    app.directive("sgTitle", namespace.SgTitleDirective);

    // description directive
    namespace.SgDescriptionDirective = ["$rootScope", function ($rootScope) {

        return {
            restrict: "AEC",
            link: function (scope, element, attrs) {

                switch (element[0].tagName) {

                    case "META":
                        {
                            element.attr("name", "description");
                            $rootScope.sgDescriptionElement = element;
                            element.removeAttr("sg-description");
                            break;
                        }
                    default:
                        {
                            $rootScope.sgDescriptionElement.attr("content", element.html());
                            element.remove();
                            break;
                        }
                }
            }
        }
    }];
    app.directive("sgDescription", namespace.SgDescriptionDirective);

    /* FOCUS WHEN */
    app.directive("sgFocusWhen", function () {

        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.sgFocusWhen);
                }, function (newVal) {
                    if (newVal) {
                        element[0].focus();
                    }
                }, true);
            }
        }

    });

    /* ALERT */
    app.directive("sgAlert", ["$rootScope", "$timeout", function ($rootScope, $timeout) {
        return {

            restrict: "A",
            link: function (scope, element, attrs) {


                if (attrs.sgAlert) {

                    var splitter = attrs.sgAlert.split("|");

                    $rootScope.$on("sgAlert-" + splitter[0], function (event, data) {
                        element.html(data);
                        element.removeClass(splitter[2]);
                        element.addClass(splitter[1]);
                        $timeout(function () {
                            element.removeClass(splitter[1]);
                            element.addClass(splitter[2]);
                        }, splitter[3]);
                    });
                }
            }
        };
    }]);

    /* FILE UPLOAD ELEMENT */
    app.directive("sgFileUpload", [function () {


        return {
            restrict: "A",
            scope: {
                sgModel: "="
            },
            link: function (scope, element, attrs) {

                // change element
                var isMulti = false;
                element.attr("type", "file");
                if (attrs.sgFileUpload == "multiple") {
                    element.attr("multiple", "multiple");
                    isMulti = true;
                }

                // bind change event
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {

                        // get vars
                        var output;
                        var elementRaw = element[0];
                        var elementRawFiles = elementRaw.files;


                        // check
                        if (isMulti) {

                            // set output to array
                            output = [];

                            // loop files
                            for (var i = 0; i < elementRawFiles.length; i++) {

                                // file obj
                                var f = elementRawFiles[i];

                                // output
                                output.push(f);
                            }

                        } else {

                            // get file
                            var f2 = elementRawFiles[0];

                            // output
                            output = f2;
                        }

                        // Finally, set scope object
                        scope.sgModel = output;
                    });
                });

            }
        };

    }]);

    /* FILE UPLOADER DIRECTIVE */
    app.directive("sgFileUploader", ["$compile", "$http", "$timeout", function ($compile, $http, $timeout) {

        // setup
        return {

            restrict: "E",
            requires: 'sgFileUpload',
            controller: ["$scope", function ($scope) {

                // POST DATA CONTAINER
                $scope.sgFileUploaderPostData = [];

                // BEFORE SUBMIT
                $scope.sgFileUploaderBeforeSubmitCallback = function () {
                    console.log("sgFileUploaderBeforeSubmitCallback");
                };

                // ON SUBMIT
                $scope.sgFileUploaderOnSubmit = function () {

                    // before func
                    $scope.sgFileUploaderBeforeSubmitCallback($scope.sgFileUploaderPostData);

                    // split out files
                    var theFiles = $scope.sgFileUploaderPostData.map(function (obj) {
                        return obj == null ? undefined : obj.file;
                    });

                    // get the test
                    var theRest = $scope.sgFileUploaderPostData.map(function (obj) {
                        return {
                            Name: obj.name,
                            Description: obj.description,
                            IsEdit: obj.isEdit,
                            FileId: obj.fileId
                        };
                    });

                    // the sizes
                    var theSizes = theFiles.map(function (obj) {
                        return obj == null ? 0 : obj.size;
                    });

                    // custom
                    var customDataMethod = $scope.$parent.$eval($scope.attrs_otherPostData);
                    var customData = customDataMethod ? customDataMethod() : {};

                    /* POST THE DATA */
                    $http({
                        method: 'POST',
                        url: $scope.sgFileUploaderConfig.postUrl,
                        //IMPORTANT!!! You might think this should be set to 'multipart/form-data' 
                        // but this is not true because when we are sending up files the request 
                        // needs to include a 'boundary' parameter which identifies the boundary 
                        // name between parts in this multi-part request and setting the Content-type 
                        // manually will not set this boundary parameter. For whatever reason, 
                        // setting the Content-type to 'false' will force the request to automatically
                        // populate the headers properly including the boundary parameter.
                        headers: { 'Content-Type': undefined },
                        //This method will allow us to change how the data is sent up to the server
                        // for which we'll need to encapsulate the model data in 'FormData'
                        transformRequest: function (data) {
                            var formData = new FormData();
                            //need to convert our json object to a string version of json otherwise
                            // the browser will do a 'toString()' on the object which will result 
                            // in the value '[Object object]' on the server.
                            formData.append("Data", JSON.stringify(data.Data));// angular.toJson(data.Data));
                            formData.append("CustomData", JSON.stringify(data.CustomData));// angular.toJson(data.CustomData));
                            formData.append("Sizes", JSON.stringify(data.Sizes));
                            //now add all of the assigned files
                            for (var i = 0; i < data.Files.length; i++) {

                                // get file
                                var theFile = data.Files[i];

                                // check multi
                                if ($scope.sgFileUploaderConfig.isMulti) {
                                    for (var i2 = 0; i2 < theFile.length; i2++) {
                                        formData.append("file" + i, theFile[i2]);
                                    }
                                } else {
                                    formData.append("file" + i, theFile);
                                }

                            }
                            return formData;
                        },
                        //Create an object that contains the model and files which will be transformed
                        // in the above transformRequest method
                        data: { Data: theRest, Files: theFiles, CustomData: customData, Sizes: theSizes }
                    }).
                    success(function (data, status, headers, config) {
                        $scope.sgFileUploaderIsEdit = false;
                        $scope.sgFileUploaderOnSubmitCallback(true, data);
                        $scope.sgFileUploaderPostData = [];
                    }).
                    error(function (data, status, headers, config) {
                        $scope.sgFileUploaderOnSubmitCallback(false, data);
                    });

                };

                // AFTER SUBMIT
                $scope.sgFileUploaderOnSubmitCallback = function (success, data) {
                    console.log(success);
                    console.log(data);
                };

                // SET CONFIG
                $scope.sgFileUploaderSetConfig = function () {

                    // CONFIG
                    $scope.sgFileUploaderConfig = {
                        maxRows: $scope.attrs_maxRows == "" || $scope.attrs_maxRows == undefined ? 999999 : parseInt($scope.attrs_maxRows),
                        hasName: $scope.attrs_hasName == "true",
                        hasDescription: $scope.attrs_hasDescription == "true",
                        isMulti: $scope.attrs_isMulti == "true",
                        postUrl: $scope.attrs_postUrl,
                        addText: $scope.attrs_addText == undefined || $scope.attrs_addText == "" ? "Add row" : $scope.attrs_addText,
                        submitText: $scope.attrs_submitText == undefined || $scope.attrs_submitText == "" ? "Upload" : $scope.attrs_submitText,
                        noFilesText: $scope.attrs_noFilesText == undefined || $scope.attrs_noFilesText == "" ? "No files added yet" : $scope.attrs_noFilesText,
                        nameLabelText: $scope.attrs_nameLabelText == undefined || $scope.attrs_nameLabelText == "" ? "Name" : $scope.attrs_nameLabelText,
                        descriptionLabelText: $scope.attrs_descriptionLabelText == undefined || $scope.attrs_descriptionLabelText == "" ? "Description" : $scope.attrs_descriptionLabelText,
                        fileLabelText: $scope.attrs_fileLabelText == undefined || $scope.attrs_fileLabelText == "" ? "File" : $scope.attrs_fileLabelText,
                        useBootstrap: $scope.attrs_useBootstrap == "true",
                        removeText: $scope.attrs_removeText == undefined || $scope.attrs_removeText == "" ? "Remove this file" : $scope.attrs_removeText,
                        copyText: $scope.attrs_copyText == undefined || $scope.attrs_copyText == "" ? "Copy file name" : $scope.attrs_copyText,
                        sgSpellcheck: $scope.attrs_sgSpellcheck == "true"
                    };

                    // set $scope stuff
                    if ($scope.attrs_submitCallback != undefined && $scope.attrs_submitCallback != "")
                        $scope.sgFileUploaderOnSubmitCallback = $scope.$parent.$eval($scope.attrs_submitCallback);
                    if ($scope.attrs_beforeSubmit != undefined && $scope.attrs_beforeSubmit != "")
                        $scope.sgFileUploaderBeforeSubmitCallback = $scope.$parent.$eval($scope.attrs_beforeSubmit);

                    // set events
                    $scope.$parent.$on("sgFileUploaderPush", function (event, data) {
                        $scope.sgFileUploaderPostData.push(data);
                    });
                    $scope.$parent.$on("sgFileUploaderClear", function () {
                        $scope.sgFileUploaderPostData = [];
                    });
                    $scope.$parent.$on("sgFileUploaderGet", function (event, callback) {
                        callback($scope.sgFileUploaderPostData);
                    });
                    $scope.$parent.$on("sgFileUploaderEdit", function (event, data) {
                        $scope.sgFileUploaderIsEdit = true;
                        data.isEdit = true;
                        $scope.sgFileUploaderPostData = [data];
                        if (!data.fileId) throw "When calling $scope.$on('sgFileUploaderEdit',fileObj) the fileObj must have the property fileId set";
                    });
                    $scope.$parent.$on("sgFileUploaderGoToTop", function (event, data) {
                        $scope.sgFileUploaderIsEdit = true;
                        $timeout(function () {
                            $scope.sgFileUploaderIsEdit = false;
                        }, 100);
                    });

                    if (($scope.sgFileUploaderConfig.hasName || $scope.sgFileUploaderConfig.hasDescription) && $scope.sgFileUploaderConfig.isMulti) throw "sg-file-uploader is-multi attribute can only be true if has-name and has-description are both unused, undefined, 'false', or an empty string";

                };

                // ADD ROW
                $scope.sgFileUploaderAddRow = function () {
                    if (!$scope.sgFileUploaderIsEdit) {
                        if ($scope.sgFileUploaderPostData.length < $scope.sgFileUploaderConfig.maxRows) {
                            $scope.sgFileUploaderPostData.push({});
                        }
                    }
                };

                // DELETE ROW
                $scope.sgFileUploaderRemoveRow = function ($index) {
                    $scope.sgFileUploaderIsEdit = false;
                    $scope.sgFileUploaderPostData.splice($index, 1);
                }

                // COPY TEXT FROM FILENAME TO NAME
                $scope.copyText = function ($index) {
                    var found = $scope.sgFileUploaderPostData[$index];
                    if (found && found.file)
                        found.name = found.file.name;
                }

                // DISPLAY HELPER
                $scope.getRequiredText = function (isEdit) {
                    return !isEdit ? "required" : "";
                }

            }],
            scope: {

                attrs_maxRows: '@maxRows',
                attrs_hasName: '@hasName',
                attrs_hasDescription: '@hasDescription',
                attrs_isMulti: '@isMulti',
                attrs_postUrl: '@postUrl',
                attrs_sgSubmit: '@sgSubmit',
                attrs_addText: '@addText',
                attrs_submitText: '@submitText',
                attrs_noFilesText: '@noFilesText',
                attrs_useBootstrap: '@useBootstrap',
                attrs_nameLabelText: '@nameLabelText',
                attrs_descriptionLabelText: '@descriptionLabelText',
                attrs_fileLabelText: '@fileLabelText',
                attrs_removeText: '@removeText',
                attrs_submitCallback: '@submitCallback',
                attrs_otherPostData: '@otherPostData',
                attrs_beforeSubmit: '@beforeSubmit',
                attrs_copyText: '@copyText',
                attrs_sgSpellcheck: '@sgSpellcheck'
            },
            link: function (scope, element) {

                // set config
                scope.sgFileUploaderSetConfig();
                var config = scope.sgFileUploaderConfig;


                /* START */
                var html = "<input style='height: 0sg; padding: 0;margin:0;border:none;' sg-focus-when='sgFileUploaderIsEdit' /><form class='sg-file-uploader sg-border-radius" + (config.useBootstrap ? " bootstrap" : " no-bootstrap") + "' ng-submit='sgFileUploaderOnSubmit()'>";


                /* REPEATER */
                html += "<div class='sg-file-uploader-rows'>";
                // add repeater for rows
                html += "<div ng-repeat='row in sgFileUploaderPostData' class='sg-file-uploader-row'>";

                // add file upload
                if (config.useBootstrap) html += "<div ng-show='!row.isEdit' class='form-group'>";
                if (config.hasName || config.hasDescription) html += "<label for='sgFile{{$index}}'>" + config.fileLabelText + "</label>";
                html += "<input ng-required=\"row.isEdit ? '':'required'\" id='sgFile{{$index}}' sg-model='row.file' sg-file-upload" + (config.isMulti ? "='multiple'" : "") + " class='sg-file-upload sg-file-upload-hasname-" + (config.hasName ? "true" : "false") + (config.useBootstrap ? " form-control" : "") + "' />";
                if (config.useBootstrap) html += "</div>";

                // name?
                if (config.hasName) {
                    if (config.useBootstrap) html += "<div class='form-group'>";
                    html += "<label for='sgName{{$index}}'>" + config.nameLabelText + "</label><a href='' ng-show='row.file != undefined' class='sg-file-uploader-copyfilename' ng-click='copyText($index)'>(" + config.copyText + ")</a>";
                    html += "<span class='sg-file-upload-name'><input " + (config.sgSpellcheck ? 'spellcheck="true"' : '') + " required id='sgName{{$index}}' ng-model='row.name' type='text'" + (config.useBootstrap ? " class='form-control'" : "") + " /></span>";
                    if (config.useBootstrap) html += "</div>";
                }

                // description?
                if (config.hasDescription) {
                    if (config.useBootstrap) html += "<div class='form-group'>";
                    html += "<label for='sgDescription{{$index}}'>" + config.descriptionLabelText + "</label>";
                    html += "<span class='sg-file-upload-description'><textarea " + (config.sgSpellcheck ? 'spellcheck="true"' : '') + " required rows='4' id='sgDescription{{$index}}' ng-model='row.description'" + (config.useBootstrap ? " class='form-control'" : "") + "></textarea></span>";
                    if (config.useBootstrap) html += "</div>";
                }

                // add remove button
                html += "<div class='sg-file-uploader-row-removecontainer'>";
                html += "<a href='' class='sg-file-uploader-row-remove" + (config.useBootstrap ? "" : "") + "' ng-click='sgFileUploaderRemoveRow($index)'>" + config.removeText + "</a>";
                html += "</div>";

                // end repeater
                html += "</div></div>";




                /* NO FILES */

                // add "no files added"
                html += "<div class='sg-file-uploader-nofile sg-border-radius' ng-show='sgFileUploaderPostData.length < 1'>" + config.noFilesText + "</div>";




                /* BUTTONS */

                // add buttons
                html += "<div class='sg-file-uploader-buttons'>";
                html += "<button ng-disabled='sgFileUploaderPostData.length < 1' type='submit' class='sg-file-uploader-submit" + (config.useBootstrap ? " btn btn-info" : "") + "'>" + config.submitText + "</button>";
                html += "<button ng-hide='sgFileUploaderIsEdit || sgFileUploaderPostData.length >= sgFileUploaderConfig.maxRows' ng-click='sgFileUploaderAddRow()' type='button' class='sg-file-uploader-add" + (config.useBootstrap ? " btn" : "") + "'>" + config.addText + "</button>";
                html += "</div>";




                /* FINALLY - COMPILE AND ADD */

                // end html
                html += "<p class='sg-signature'>sgFile: sg-file-uploader &copy; 2014</p></form>";

                // compile
                var output = $compile(html)(scope);

                // add
                element.after(output);

                // remove
                element.remove();

            }
        };
    }]);

    /* TIMEOUT CLASS */
    app.directive("sgTimeoutClass", ["$timeout", function ($timeout) {
        return {
            restrict: "AC",
            link: function (scope, element, attrs) {

                // get vars
                var splitter = attrs.sgTimeoutClass.split('|');
                var onClass = splitter[0];
                var offClass = splitter[1];
                var delay = splitter[2];

                // add on 
                element.addClass(onClass);

                // wait
                $timeout(function () {
                    element.addClass(offClass);
                }, delay);
            }
        }
    }]);

    /* GOOGLE PLACE SEARCH */
    app.directive("sgGooglePlaceSearch", ["$sce", "$timeout", function ($sce, $timeout) {

        // get iframe url
        var getIframeUrl = function (googleObject) {

            var url = "https://maps.google.com/maps?q=" + googleObject.formatted_address + "&output=embed";

            var trust = $sce.trustAsResourceUrl(url);

            return trust;
        }

        // get street nuber and route
        var getStreetNumberAndRoute = function (googleObject) {

            // start
            var output = "";

            // collection
            var streetNumbers = googleObject.address_components.filter(function (item) {
                return item.types.indexOf("street_number") > -1;
            });

            if (streetNumbers.length > 0) output += streetNumbers[0].long_name;

            // collection
            var routes = googleObject.address_components.filter(function (item) {
                return item.types.indexOf("route") > -1;
            });

            if (routes.length > 0) output += (output == "" ? "" : " ") + routes[0].long_name;

            return output;
        }

        // get street nuber and route
        var getAddressLine = function (googleObject, numb) {

            if (numb == 1) return getStreetNumberAndRoute(googleObject);

            var key = "sublocality_level_" + (numb - 1);

            // start
            var output = "";

            // collection
            var addLines = googleObject.address_components.filter(function (item) {
                return item.types.indexOf(key) > -1;
            });


            if (addLines.length < 1) {
                addLines = googleObject.address_components.filter(function (item) {
                    return item.types.indexOf("locality") > -1;
                });
            }

            if (addLines.length > 0) {
                output += addLines[0].long_name;
            }


            return output;
        }

        // get town / city
        var getTownCity = function (googleObject) {

            // start
            var output = "";

            // collection
            var streetNumbers = googleObject.address_components.filter(function (item) {
                return item.types.indexOf("postal_town") > -1;
            });

            if (streetNumbers.length > 0) output += streetNumbers[0].long_name;

            return output;
        }

        // get town / city
        var getCountyState = function (googleObject) {

            // start
            var output = "";

            // collection
            var states = googleObject.address_components.filter(function (item) {
                return item.types.indexOf("administrative_area_level_1") > -1;
            });

            if (states.length < 1) {
                states = googleObject.address_components.filter(function (item) {
                    return item.types.indexOf("administrative_area_level_2") > -1;
                });
            }

            if (states.length > 0) output += states[0].long_name;

            return output;
        }

        // get town / city
        var getPostcodeZip = function (googleObject) {

            // start
            var output = "";

            // collection
            var streetNumbers = googleObject.address_components.filter(function (item) {
                return item.types.indexOf("postal_code") > -1;
            });

            if (streetNumbers.length > 0) output += streetNumbers[0].long_name;

            return output;
        }

        // get town / city
        var getCountry = function (googleObject) {

            // start
            var output = "";

            // collection
            var streetNumbers = googleObject.address_components.filter(function (item) {
                return item.types.indexOf("country") > -1;
            });

            if (streetNumbers.length > 0) output += streetNumbers[0].long_name;

            return output;
        }

        // check us
        var checkUsCounty = function (theOutput, googleObject) {

            if (theOutput.TownCity == "") {
                // start
                var output = "";

                // get
                var counties = googleObject.address_components.filter(function (item) {
                    return item.types.indexOf("administrative_area_level_2") > -1;
                });


                if (counties.length > 0) output += counties[0].long_name;

                theOutput.TownCity = output;
            }

        }

        // convert object
        var createUsefulObject = function (googleObject) {

            // get iframe url
            var iframeUrl = getIframeUrl(googleObject);

            // initial output
            var output = {
                AddressLine1: getAddressLine(googleObject, 1),
                AddressLine2: getAddressLine(googleObject, 2),
                AddressLine3: getAddressLine(googleObject, 3),
                AddressLine4: getAddressLine(googleObject, 4),
                TownCity: getTownCity(googleObject),
                CountyState: getCountyState(googleObject),
                PostcodeZip: getPostcodeZip(googleObject),
                Country: getCountry(googleObject),
                MapLink: googleObject.url,
                IFrameTrustedSrc: iframeUrl,
                GoogleObject: googleObject
            }

            if (output.AddressLine4 == output.AddressLine3) {
                output.AddressLine4 = "";
            } else {
                if (output.AddressLine4 == output.TownCity) { output.AddressLine4 = ""; }
            }
            if (output.AddressLine3 == output.AddressLine2) {
                output.AddressLine3 = "";
            } else {
                if (output.AddressLine3 == output.TownCity) { output.AddressLine3 = ""; }
            }
            if (output.AddressLine2 == output.AddressLine1) {
                output.AddressLine2 = "";
            } else {
                if (output.AddressLine2 == output.TownCity) { output.AddressLine2 = ""; }
            }


            // check us county
            checkUsCounty(output, googleObject);
            if (output.AddressLine4 == output.TownCity || output.AddressLine4 == output.CountyState) output.AddressLine4 = "";


            // 
            return output;

        }

        // set link
        var setLink = function (scope, element, attrs) {

            try {

                if (!element.__gMapsSetLinkForSgGooglePlaceSearch) {

                    // set true
                    element.__gMapsSetLinkForSgGooglePlaceSearch = true;

                    // create element
                    element.after("<input type='search' id='" + attrs.sgId + "' class='" + attrs.sgClass + "' style='" + attrs.sgStyle + "' />");

                    // create ac
                    var ac = new window.google.maps.places.Autocomplete(element.next("input:first")[0], {});

                    // remove
                    if (element[0].tagName == "SG-GOOGLE-PLACE-SEARCH") element.remove();

                    // apply
                    //scope.$apply(function () {

                    // add change listener
                    window.google.maps.event.addListener(ac, 'place_changed', function () {

                        // get place
                        var loc = ac.getPlace();

                        if (loc.address_components) {

                            // create and fire
                            var obj = createUsefulObject(loc);
                            scope.$apply(function () {
                                scope.placeFoundMethod({ $googlePlace: obj });
                            });
                        }


                    });
                    //});
                }


            } catch (ex) {
                console.log(ex);
                element.after("Error occured loading Google Maps");
            }
        }

        // set window func for callback
        window.gMapsCallbackForSgGooglePlaceSearch = function () {
            window.gMapsLoadedForSgGooglePlaceSearch = true;
        }

        // do loop and set when loaded
        var doSetLoop = function (scope, element, attrs) {
            //console.log("Element "  + attrs.sgId + " attempt " + (element.__loadCounter +1));
            if (window.gMapsLoadedForSgGooglePlaceSearch) {
                setLink(scope, element, attrs);
            } else if (element.__loadCounter < element.__maxCounter) {

                $timeout(function () {
                    element.__loadCounter++;
                    doSetLoop(scope, element, attrs);
                }, 100);

            } else {
                element.after("Error occured loading Google Maps");
            }

        };

        // GO
        return {

            restrict: "AEC",
            scope: { placeFoundMethod: '&onPlaceSelected' },
            link: function (scope, element, attrs) {

                element.__loadCounter = 0;
                element.__maxCounter = 30;

                if (!window.gMapsPreLoadedForSgGooglePlaceSearch) {

                    // set script tag
                    var scriptTag = document.createElement('script');
                    scriptTag.setAttribute("src", "http://maps.googleapis.com/maps/api/js?libraries=places&sensore=false&callback=gMapsCallbackForSgGooglePlaceSearch");
                    document.body.appendChild(scriptTag);
                    window.gMapsPreLoadedForSgGooglePlaceSearch = true;

                }

                doSetLoop(scope, element, attrs);
            }
        }

    }]);

})(SgControls.ElementsModule, SgControls);