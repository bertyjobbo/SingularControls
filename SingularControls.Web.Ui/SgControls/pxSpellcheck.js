/* WORD DATA FROM HERE!! */
/* http://invokeit.wordpress.com/frequency-word-lists/ */

/* DLL FROM HERE */
/* https://fuzzystring.codeplex.com/ */


'use strict';

var pxSpellModule = angular.module("pxSpell", ["ng"]);

(function (app) {

    app.directive("pxSpellcheck", ["$compile", function ($compile) {

        //
        return {

            restrict: "AC",
            controller: ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {

                // sanitize
                function getWordsWithSpacesOnly(org) {
                    var wordsWithSpacesOnly = org;
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/'s\s/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\r\n/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\n\r/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\n\n/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\n/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\r/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\t/g, " ");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\./g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/,/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/;/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/!/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/"/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/£/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/$/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/%/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/^/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/&/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\*/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\(/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\)/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/_/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/-/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/{/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/}/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\[/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\]/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/~/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/#/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/@/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/:/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/;/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\//g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\\/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/|/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/¬/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/`/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/¦/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    wordsWithSpacesOnly = wordsWithSpacesOnly.replace(/\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s/g, "");
                    return wordsWithSpacesOnly;
                }

                // show success
                function showSuccess(word) {
                    $scope.Checking = false;
                    $scope.SuccessMessage = word || "Spell check complete";
                    $timeout(function () {
                        $scope.SuccessMessage = undefined;
                    }, 1000);
                }

                // do replace!!
                function doReplace() {

                    // checking
                    $scope.Checking = false;

                    // go
                    var newText = $scope.OrginalText;
                    $scope.Words.forEach(function (word) {

                        // regex
                        var re = new RegExp(word.Original, "g");

                        // replace
                        newText = newText.replace(re, word.Word);

                    });

                    // set
                    $scope.Element.val(newText);
                    showSuccess();

                };

                // select a word in the suggestions list
                $scope.SelectWord = function (word, sug) {
                    if (word.Chosen == sug) {
                        word.Chosen = undefined;
                        word.Word = word.Original;
                    } else {
                        word.Chosen = sug;
                        word.Word = sug;
                    }
                    word.IsNew = false;
                }

                // get bold style
                $scope.GetBold = function (word, sug) {
                    if (word.Chosen == sug) {
                        return "bold";
                    }

                    return "normal";
                }

                // use word
                $scope.UseWord = function (word) {
                    if (word.Word != "") {

                        var indx = $scope.Words.indexOf(word);
                        $scope.Words[indx].Checking = false;
                        $scope.Words[indx].Checking = false;

                        // finally
                        if ($scope.Words.filter(function (w) { return w.Checking == true; }).length == 0) {
                            doReplace();
                        }
                        else {
                            $scope.Words[indx + 1].Current = true;
                        }
                    }
                }

                // skip word
                $scope.SkipWord = function (word) {

                    var indx = $scope.Words.indexOf(word);
                    word.Word = word.Original;
                    $scope.Words[indx].Checking = false;
                    $scope.Words[indx].Current = false;

                    // finally
                    if ($scope.Words.filter(function (w) { return w.Checking == true; }).length == 0) {
                        doReplace();
                    } else {
                        $scope.Words[indx + 1].Current = true;
                    }
                }

                // check spelling
                $scope.CheckSpelling = function () {

                    // before
                    $scope.$parent.$eval($scope.BeforeLoad);

                    // hide
                    $scope.Checking = false;
                    $scope.ErrorMessage = undefined;
                    $scope.SuccessMessage = undefined;
                    $scope.Words = undefined;
                    $scope.OrginalText = undefined;
                    $scope.WordsWithSpacesOnly = undefined;

                    // get text
                    $scope.OrginalText = $scope.Element.val();
                    $scope.WordsWithSpacesOnly = getWordsWithSpacesOnly($scope.OrginalText);

                    // get array
                    var arrayOfWords = $scope.WordsWithSpacesOnly.split(" ");

                    // get final array
                    var finalArray = [];
                    for (var itm in arrayOfWords) {
                        var item = arrayOfWords[itm];
                        if (item != "" && finalArray.indexOf(item) < 0) {
                            finalArray.push(item);
                        }
                    }

                    $http
                        .post(rootedUrl("api/spellcheck/post/") + $scope.LanguageCode + "/", finalArray)
                        .success(function (d) {

                            if (d.length < 1) {
                                showSuccess();
                            } else {

                                // show
                                $scope.Checking = true;
                                $scope.Words = d;
                                $scope.Words[0].Current = true;
                            }

                            $scope.$parent.$eval($scope.AfterLoad);

                        })
                        .error(function (err) {
                            alert(err.Message);
                            console.log(err);
                        });
                }

                // cancel
                $scope.Cancel = function () {

                    $scope.Checking = false;
                    $scope.Words = undefined;
                    showSuccess("Cancelled");

                };

                // add new word
                $scope.AddWord = function (word) {

                    $http.post(rootedUrl("/api/spellcheck/addword/") + word.Word + "/" + $scope.LanguageCode).success(function () { });
                    $scope.UseWord(word);
                }

                // check for change
                $scope.CheckChange = function (word) {

                    if (word.Chosen) {
                        word.IsNew = false;
                        return;
                    }

                    word.IsNew = true;

                }

                // is button disabled
                $scope.IsAddButtonDisabled = function (word) {
                    return word.IsNew == false;
                }

                // is button disabled
                $scope.IsConfirmButtonDisabled = function (word) {
                    return word.Original == word.Word;
                }

                // finish
                $scope.Finish = function () {
                    var stillToDo = $scope.Words.filter(function (word) { return word.Checking = true; });
                    for (var w in stillToDo) {
                        $scope.UseWord($scope.Words[w]);
                    }
                };

                // show word?
                $scope.ShowWord = function (word) {
                    return word.Checking == true && word.Current == true;
                }

                // positioning
                $scope.GetElTop = function () {
                    var theTop = $scope.Element[0].offsetTop;
                    if (theTop > 100) {
                        return "100px";
                    }
                    return theTop + "px";
                };
                $scope.GetElLeft = function () { return $scope.Element[0].offsetLeft + "px"; };
                $scope.GetElWidth = function () { return $scope.Element[0].clientWidth + "px"; };
                $scope.GetElHeight = function () { return $scope.Element[0].clientHeight + "px"; };



            }],
            scope: {
                BeforeLoad: '@spellcheckBeforeLoad',
                AfterLoad: '@spellcheckAfterLoad'

            },
            link: function (scope, element, attrs) {
                
                // check
                if (!attrs.spellcheckLangWatch) throw "Please enter a variable to watch for language code";

                // watch
                scope.$parent.$watch(function () { return scope.$parent[attrs.spellcheckLangWatch]; }, function (newVal) {
                    scope.LanguageCode = newVal;
                }, true);

                // set element for controller
                scope.Element = element;

                // html after
                var htmlAfter =
                    "<div ng-show='Checking == true || SuccessMessage != undefined' style='position:fixed; z-index: 99998; background: #333; opacity:0.8; top: 0; left: 0; width: 100%; height: 100%;'></div>" +
                        "<div ng-show='Checking == true || SuccessMessage != undefined' style='padding: 16px; border: 1px solid #333; border-radius: 8px; max-height: 400px; position:fixed; z-index: 99999; background: #eee; opacity:1; top: {{ GetElTop() }}; left: {{ GetElLeft() }}; width: {{ GetElWidth() }} ; overflow-y: auto;'>" +
                        //"<h4>Spellcheck</h4><hr />" +

                        // word repeater
                        "<div ng-repeat='word in Words' ng-show='ShowWord(word)'>" +
                            //"<div class='form-group'><label>Original value</label><p>{{ word.Original }}</p></div>" +
                            "<h3>{{ word.Original }}</h3><hr style='border-color: #333' />" +
                            "<div style='margin-bottom: 4px;'><label class='sr-only'>New value</label><input ng-change='CheckChange(word)' class='form-control' type='text' autocomplete='off' ng-model='word.Word' /></div>" +
                            "<div style='height: 100px; overflow-y: auto;'><label class='sr-only'>Suggested alternatives</label><span style='display: block; padding: 0 0 0 13px; font-style: italic;' ng-show='word.Suggestions.length < 1'>No suggestions</span><ul style='padding: 0 0 0 13px; line-height: 30px; list-style-type: none;' ng-show='word.Suggestions.length > 0'><li ng-repeat='sug in word.Suggestions'><a style='font-weight: {{ GetBold(word,sug) }};' href='' ng-click='SelectWord(word,sug)'>{{ sug }}</a></li></ul></div>" +
                        //"<hr />" +
                            "<div class='form-group' style='overflow: hidden;'>" +

                                "<button title='Add to dictionary' ng-disabled='IsAddButtonDisabled(word)' class='btn btn-default' type='button' ng-click='AddWord(word)'><i class='glyphicon glyphicon-plus'></i><span class='sr-only'>Add to dictionary</span></button>\n" +
                                "<button title='Use' ng-disabled='IsConfirmButtonDisabled(word)' class='btn btn-default' ng-click='UseWord(word)' type='button'><i class='glyphicon glyphicon-ok'></i><span class='sr-only'>Confirm new value</span></button>\n" +
                                "<button title='Skip' class='btn btn-default' type='button' ng-click='SkipWord(word)'><i class='glyphicon glyphicon-chevron-right'></i><span class='sr-only'>Skip to next word</span></button>\n" +
                                "<button title='Done' style='display: inline-block; float: right; margin-left: 2px;' type='button' class='btn btn-success' ng-click='Finish()'><i class='glyphicon glyphicon-ok'></i><span class='sr-only'>Complete</span></button>\n" +
                                "<button title='Cancel' style='display: inline-block; float: right; margin-left: 2px;' type='button' class='btn btn-danger' ng-click='Cancel()'><i class='glyphicon glyphicon-remove'></i><span class='sr-only'>Cancel</span></button>" +


                            "</div>" +


                        "</div>" +

                        "<div style='font-size: 24px; text-align: center; margin-bottom: -2px;' ng-show='SuccessMessage != undefined' class='alert alert-default'>{{ SuccessMessage }}</div>" +


                       // "<table style='margin-top: 4px; width: 100%; border-collapse: collapse;'>" +
                       // "<tbody><tr ng-repeat='word in Words' ng-show='word.Checking == true && word.Current == true'>" +
                       // "<td style='vertical-align: top; text-align: left; width: 32%; padding: 0 3% 10px 0;'><input class='form-control' style='font-size: 20px' type='text' autocomplete='off' ng-model='word.Word' /></td>" +
                       // "<td  style='vertical-align: top; text-align:left; width: 32%; padding: 0 2% 10px 0;'><span ng-show='word.Suggestions.length < 1'>No suggestions</span><ul ng-show='word.Suggestions.length > 0' ng-repeat='sug in word.Suggestions'><li><a style='font-weight: {{ GetBold(word,sug) }};' href='' ng-click='SelectWord(word,sug)'>{{ sug }}</a></li></ul></td>" +
                       // "<td style='vertical-align: top; text-align: right; width: 31%; padding: 0 0 10px 0;'>" +

                       // "<button class='btn btn-default' type='button' ng-click='AddWord(word)'>Add</button>\n" +
                       // "<button class='btn btn-default' ng-click='UseWord(word)' type='button'>Confirm</button>\n" +
                       // "<button class='btn btn-default' type='button' ng-click='SkipWord(word)'>Skip</button>" +


                       //"</td></tr></tbody></table>" +


                        //"<hr />" +
                        //"<p style='text-align: right;'><button type='button' class='btn btn-danger' ng-click='Checking=false;Words=undefined;'>Cancel spellchecking</button></p>" +
                        "</div>" +

                        "<div style='padding-top: 4px;text-align: right;' ng-show='!Checking'><button class='btn' ng-click='CheckSpelling()' type='button'>Spellcheck</button></div>";
                var htmlAfterCompiled = $compile(htmlAfter)(scope);
                element.after(htmlAfterCompiled);

            }
        }

    }]);

})(pxSpellModule);

