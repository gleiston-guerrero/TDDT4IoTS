/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global urlWebServicies, angular, app */
app.controller('controllerWords', function ($scope, $http) {
    $scope.Adjectives = [];
    $scope.Nouns = [];
    $scope.PastVerb = [];
    $scope.Verbs = [];
    $scope.UseCase = [];

    $scope.valueVerbsNouns = {};
    window.addEventListener("load", function () {
        $.when(loadVerbs()).then(function (data) {
            $.when(loadNouns()).then(function (data) {
                $.when(loadAdjectives()).then(function (data) {
                    $.when(loadPastVerb()).then(function (data) {
                        formatUseCase();
                    });
                });
            });
        });

    });

    function loadVerbs() {
        return $.when($scope.loadVerbs()).then(function (data) {
            $scope.$apply(function () {
                $scope.Verbs = data;
//                Verbs = covertJsonToArray(Verbs, "Verbs");
                console.log($scope.Verbs);
            });
        });
    }
    function loadNouns() {
        return  $.when($scope.loadNouns()).then(function (data) {
            $scope.$apply(function () {
                $scope.Nouns = data;
//                Nouns = covertJsonToArray(Nouns, "Nouns");
                console.log($scope.Nouns);
            });
        });
    }
    function loadAdjectives() {
        return  $.when($scope.loadAdjectives()).then(function (data) {
            $scope.$apply(function () {
                $scope.Adjectives = data;
//                Adjectives = covertJsonToArray(Adjectives, "Adjectives");
                console.log($scope.Adjectives);
            });
        });
    }
    function loadPastVerb() {
        return $.when($scope.loadPastVerb()).then(function (data) {
            $scope.$apply(function () {
                $scope.PastVerb = data;
//                PastVerb = covertJsonToArray(PastVerb, "PastVerb");
                console.log($scope.PastVerb);
            });
        });
    }

    $scope.loadAdjectives = function () {
        return $.getJSON("resources/Tddm4IoTbs/caseAdjectives.json", function (data) {
        });
    };

    $scope.loadNouns = function () {
        return $.getJSON("resources/Tddm4IoTbs/caseNouns.json", function (data) {
        });
    };

    $scope.loadPastVerb = function () {
        return $.getJSON("resources/Tddm4IoTbs/casePastVerb.json", function (data) {
        });
    };

    $scope.loadVerbs = function () {
        return $.getJSON("resources/Tddm4IoTbs/caseVerbs.json", function (data) {
        });
    };

    function formatUseCase() {
        for (var i = 0; i < Object.keys($scope.Verbs).length; i++) {
            for (var j = 0; j < Object.keys($scope.Nouns).length; j++) {
                $scope.UseCase.push($scope.Verbs[i].verb + " " + $scope.Nouns[j].noun);
            }
        }
    }












    document.getElementById("idVerb").addEventListener('keypress', function (e) {
//        e.preventDefault();
        if (e.keyCode === 32 || e.code === "Space") {
            document.getElementById("idNoun").focus();
        }
    });


    function covertJsonToArray(json, item) {
        let response = [];
        switch (item) {
            case "Verbs":
                for (let i = 0; i < json.length; i++) {
                    response.push(json[i].verb);
                }
                break;
            case "Nouns":
                for (let i = 0; i < json.length; i++) {
                    response.push(json[i].noun);
                }
                break;
            case "Adjectives":
                for (let i = 0; i < json.length; i++) {
                    response.push(json[i].adjective);
                }
                break;
            case "PastVerb":
                for (let i = 0; i < json.length; i++) {
                    response.push(json[i].pastVerb);
                }
                break;
        }
        return response;
    }

//    
    let onlyVerbs;
    $('html').keyup(function (e) {
        if (document.getElementById("idVerbsNouns").value !== '') {
            if (e.keyCode === 46 || e.keyCode === 8) {
                onlyVerbs = (document.getElementById("idVerbsNouns").value).split(" ", 3);
                console.log(onlyVerbs);
                document.getElementById("verbsnouns_list").hidden = true;
                $scope.valueVerbsNouns.text = "";
                document.getElementById("verbsnouns_list").hidden = false;
                document.getElementById("idVerbsNouns").value = onlyVerbs[0];
            }
        }
    })

    /**
     *
     * 
     */
    $("#idTeclas").bind("keypress keyup keydown", function (event) {
//En html
//        <input class="inputTxt" type="text" />
//        <div id="log"></div>
        var evtType = event.type;
        var eWhich = event.which;
        var echarCode = event.charCode;
        var ekeyCode = event.keyCode;

        switch (evtType) {
            case 'keypress':
                $("#log").html($("#log").html() + "<b>" + evtType + "</b>" + " keycode: " + ekeyCode + " charcode: " + echarCode + " which: " + eWhich + "<br>");
                break;
            case 'keyup':
                $("#log").html($("#log").html() + "<b>" + evtType + "</b>" + " keycode: " + ekeyCode + " charcode: " + echarCode + " which: " + eWhich + "<p>");
                break;
            case 'keydown':
                $("#log").html($("#log").html() + "<b>" + evtType + "</b>" + " keycode: " + ekeyCode + " charcode: " + echarCode + " which: " + eWhich + "<br>");
                break;
            default:
                break;
        }
    });
//    function loadJQueryAutocomplete() {
//            $("#Verbs").autocomplete({
//            source: Verbs === undefined ? "" : Verbs,
//            minLength: 1
//        });
//        $("#Verbs").autocomplete("widget").addClass('fixed-height');
//        $("#Nouns").autocomplete("widget").addClass('fixed-height');
//        $("#Adjectives").autocomplete("widget").addClass('fixed-height');
//        $("#PastVerb").autocomplete("widget").addClass('fixed-height');
//    }

});
