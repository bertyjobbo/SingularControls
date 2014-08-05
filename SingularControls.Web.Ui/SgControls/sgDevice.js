'use strict';

// namespace
if (window.SingularControls == undefined)
    window.SingularControls = {};

// app
SingularControls.SgDeviceModule = angular.module("sgDevice", ['ng']);

// scope
(function (app, namespace) {

    // create provider
    app.provider("sgDevice", [function () {

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
        ts.else = function(arrayOfJsFiles, configFunction) {

            // else function
            ts.elseFunction = function () {
                runFunctionsAndLoad(arrayOfJsFiles, configFunction);
            }

            return ts;
        }

        // shared run methods
        var runFunctionsAndLoad = function (arrayOfJsFiles, configFunction) {

            //todo: wait for load before proceeding in loop
            console.log("//todo: wait for load before proceeding in loop");

            // load scripts
            arrayOfJsFiles.forEach(function (jsFilePath) {

                // check
                if (alreadyLoadeds.indexOf(jsFilePath) == -1) {
                    alreadyLoadeds.push(jsFilePath);
                    var js = document.createElement("script");
                    js.type = "text/javascript";
                    js.src = jsFilePath;
                    document.body.appendChild(js);
                }

            });

            if (configFunction)
                configFunction();
        };

        // already loadeds
        var alreadyLoadeds = [];

        // finalise
        ts.finalize = function () {

            // matched?
            var matched = false;

            // check support, fail silently if not
            if (window.matchMedia) {
                
                // matched
                matched = true;

                // run
                ts.whens.forEach(function(theWhen) {
                    
                    // check media is relevant
                    if (window.matchMedia(theWhen.mediaQuery).matches) {

                        runFunctionsAndLoad(theWhen.arrayOfJsFiles, theWhen.configFunction);
                    }

                });
            }

            // 
            if (!matched && ts.elseFunction !== undefined) {
                ts.elseFunction();
            }
        };

        // get
        this.$get = [function () {
            return ts;
        }];

    }]);

})(SingularControls.SgDeviceModule, SingularControls);