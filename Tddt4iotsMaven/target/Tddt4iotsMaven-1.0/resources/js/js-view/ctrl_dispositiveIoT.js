app.controller("dispositiveiot_controller", function ($scope, $http) {

    $(document).ready(() => {
        angular.element($('[ng-controller="application"]')).scope().changeTittlePage("My Projects", true);
        $scope.loadProjects();
        $scope.loadColors();
        $scope.appPage.Select = "componentsiot";
    });

    /*
    * Status
    * Active => A
    * Inactive => I
    * */

    $scope.myprojects = [];
    $scope.selected_project = {};
    $scope.flag_selected_project = false;


    //funcion para cargar los proyectos existentes
    $scope.loadProjects =  () => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getProjects',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "type": "PROJECT_USER"}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    $scope.$apply(function () {
                        $scope.myprojects = data.data;
                    });
                    alertAll(data);
                    // console.log($scope.myprojects);
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

});
