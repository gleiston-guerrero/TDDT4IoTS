/* global store, urlWebServicies, swal, Swal */

app.controller("home_controller", function ($scope, $http) {

    $(document).ready(() => {
        angular.element($('[ng-controller="application"]')).scope().changeTittlePage("Shared Projects", true);
        $scope.loadInterpret();
        $scope.loadProjects();
        $scope.loadHome();
        $scope.appPage.Select = "home";
    });

    /*
     * Status
     * Active => A
     * Inactive => I
     * */

    $scope.projects_recent = [];

    //funcion para cargar los proyectos existentes
    $scope.loadProjects = function () {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/selectHomeProject',
                data: JSON.stringify({
                    "user_token": dataUser.user_token}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    $scope.$apply(function () {
                        $scope.projects_recent = data.data;
                    });
                    alertAll(data);
                    // console.log($scope.projects_recent);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "index";
        }
    };

    $scope.queryHome = [];

    $scope.loadHome = function () {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getHome',
                data: JSON.stringify({
                    "user_token": dataUser.user_token}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    $scope.$apply(function () {
                        $scope.queryHome = data.data[0];
                    });
                    alertAll(data);
                    // console.log($scope.queryHome[0]);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "index";
        }
    };

    $scope.interpret = [];
    $scope.loadInterpret = function () {
//        // console.log("buscar el:"+valuex);
        $.getJSON("resources/json/interpret.json", function (data) {
            $scope.$apply(function () {
                $scope.interpret = data;
                // console.log($scope.interpret);
            });
        });
    };

    $scope.loadExample = (simbol) => {
        // console.log(simbol);
        let message = '<div style="font-family: math;font-size: 16px;">' + simbol.example + '<div>';
        Swal.fire({
            title: '<strong>' + simbol.description + ' example <span class="badge badge-info">' + simbol.simbol + '</span> </strong>',
            icon: 'info',
            html: message
        });
    };

});
