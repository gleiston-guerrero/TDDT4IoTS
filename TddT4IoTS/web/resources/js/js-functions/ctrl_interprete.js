/* global angular, app */


app.controller("interpret_controller", function ($scope, $http) {

    $scope.interpretador = [];
    $scope.bigDiagram = {};

    $scope.flagJson = false;


    $scope.interprete = {
        newstring: "",
        transform: function () {
            if ($scope.interprete.newstring)
            {
                let minjson = getHackDiagram($scope.interprete.newstring);
                console.log(minjson);
                $scope.interpretador.push(minjson);

                if ($scope.bigDiagram.length === undefined)
                    $scope.bigDiagram = minjson;

                mergejson($scope.bigDiagram, minjson[1]);
                renderJson(JSON.stringify($scope.bigDiagram, null, 2));
                $scope.flagJson = true;
            }
        }
    };

    $(document).ready(() => {
        renderJson($("#codef").html());
        $scope.loadInterpret();
        $scope.appPage.Select = "interpret";
    });
    const renderJson = (code) => {
        document.querySelectorAll('#codef').forEach((block) => {
            $("#codef").html(code);
            $("#codef").addClass("json");

            hljs.highlightBlock(block);
            hljs.lineNumbersBlock(block);
        });

    };
    $scope.interpret = [];
    $scope.loadInterpret = function () {
//        console.log("buscar el:"+valuex);
        $.getJSON("resources/json/interpret.json", function (data) {
            $scope.$apply(function () {
                $scope.interpret = data;
                console.log($scope.interpret);
            });
        });
    };

    $scope.loadExample = (simbol) => {
        console.log(simbol);
        let message = '<div><b>' + simbol.example + '</b><div>';
        Swal.fire({
            title: '<strong>' + simbol.description + ' example <span class="badge badge-info">' + simbol.simbol + '</span> </strong>',
            icon: 'info',
            html: message
        });
    };

    const mergejson = (bigDiagram, mindiagram) => {
        mergeClassDiagram(bigDiagram, mindiagram);
    };

    $("#Symbols_use_cases").click(function () {
        $("#modal_Symbols").modal();
    });

});
