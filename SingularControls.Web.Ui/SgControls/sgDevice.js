'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};

// scope
(function (namespace) {

    // check
    namespace.SgDeviceProviderSet = false;

    // create raw for pre-config access
    namespace.SgDeviceProviderPreAppStart = function () {

        var innerObject = function() {
            
            // this
            var ts = this;

            // array of when's
            ts.whens = [];

            // when function
            ts.when = function (mediaQuery, arrayOfJsFiles, configFunction) {

                // push
                ts.whens.push({
                    mediaQuery: mediaQuery,
                    arrayOfJsFiles: arrayOfJsFiles,
                    configFunction: configFunction

                });

                // fluent
                return ts;
            }

            // else
            ts.else = function (arrayOfJsFiles, configFunction) {

                // else function
                ts.elseFunction = function () {
                    runFunctionsAndLoad(arrayOfJsFiles, configFunction, ts.elseCallback);
                }

                return ts;
            }

            // else
            ts.elseFunction = undefined;
            ts.elseCallback = undefined;

            // shared run methods
            var runFunctionsAndLoad = function (arrayOfJsFiles, configFunction, callback) {

                // counter
                var theCounter = 0;

                // inner function
                var innerLoadFunc = function () {

                    // check count
                    if (theCounter < arrayOfJsFiles.length) {

                        // get path
                        var jsFilePath = arrayOfJsFiles[theCounter];

                        // check already loaded
                        if (alreadyLoadeds.indexOf(jsFilePath) > 0) {
                            theCounter++;
                            innerLoadFunc();
                        } else {
                            var jsElement = document.createElement("script");
                            jsElement.onload = function (e) {
                                //console.log("Finished loading " + jsFilePath + ": ", e);
                                alreadyLoadeds.push(jsFilePath);
                                theCounter++;
                                innerLoadFunc();
                            }
                            jsElement.onerror = function(e) {
                                console.log("Error loading " + jsFilePath + ": ", e);
                                theCounter++;
                                innerLoadFunc();
                            }
                            jsElement.src = jsFilePath;
                            document.body.appendChild(jsElement);
                        }
                    } else {
                        if (configFunction)
                            configFunction();
                        if (callback)
                            callback();
                    }
                };

                // go
                innerLoadFunc();
            };

            // already loadeds
            var alreadyLoadeds = [];

            // finalise
            ts.finalize = function (callback) {

                // matched?
                var matched = false;

                // check support, fail silently if not
                if (window.matchMedia) {

                    // counter
                    var theCounter = 0;

                    // inner function
                    var innerLoadFunc = function () {

                        // check counter
                        if (theCounter < ts.whens.length) {

                            // get when
                            var theWhen = ts.whens[theCounter];

                            // check media is relevant
                            if (window.matchMedia(theWhen.mediaQuery).matches) {
                                matched = true;
                                runFunctionsAndLoad(theWhen.arrayOfJsFiles, theWhen.configFunction, function () {
                                    theCounter++;
                                    innerLoadFunc();
                                });
                            } else {
                                theCounter++;
                                innerLoadFunc();
                            }
                        } else {
                            // 
                            if (!matched && ts.elseFunction !== undefined) {
                                ts.elseCallback = callback;
                                ts.elseFunction();
                            } else {

                                // callback
                                if (callback) callback();
                            }
                        }
                    };

                    // go
                    innerLoadFunc();
                }
            };

        };

        // set up angular
        this.setUpForAngular = function() {
              
            // set up angular version
            if (angular && !namespace.SgDeviceProviderSet) {
                namespace.SgDeviceProviderSet = true;
                namespace.SgDeviceModule = angular.module("sgDevice", ['ng']);
                namespace.SgDeviceModule.config(["$provide", function ($provide) {
                    $provide.service("sgDeviceService", function () {
                        return new innerObject();
                    });
                }]);
            }

        };

        // get inner
        var innerObjInstance = new innerObject();

        // when
        this.when = innerObjInstance.when;

        // else
        this.else = innerObjInstance.else;

        // finalize
        this.finalize = innerObjInstance.finalize;

    };


})(SingularControls);



