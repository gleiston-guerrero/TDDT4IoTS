/* global keyGroup, go, myDiagram, urlWebServicies, store, jsonCodeMirror, libraries, variables, setup, loop, loop, methods, swal, angular, app, rutasStorage, Swal */

app.controller("users_controller", function ($scope, $http) {

    $scope.arrayAdmins = [];
    $scope.arrayUsers = [];

    $(document).ready(() => {
        $scope.loadUsers();
    });

    $scope.loadUsers = () => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'personapis/getUsers',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    $scope.$apply(function () {// Se puede optimizar con una sola petición en un ArrayJSON
                        $scope.arrayAdmins = data.data.admins;
                        $scope.arrayUsers = data.data.users;
                        console.log($scope.arrayAdmins);
                        console.log($scope.arrayUsers);
                    });
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "index";
        }
    };
    $scope.stateUser = (action, id_person) => {
        swal.fire({
            title: 'Are you sure to take this action?',
            showDenyButton: true,
//                showCancelButton: true,
            confirmButtonText: `Confirm`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                var dataUser = store.session.get("user_tddm4iotbs");
                if (dataUser !== undefined && dataUser !== null) {
                    let api_param = {
                        user_token: dataUser.user_token,
                        id_person: id_person,
                        action: action
                    };
                    apiStateUser(api_param);
                }
            } else if (result.isDenied) {
                swal.fire("Okay ... think better next time");
            }
        });
    };

    apiStateUser = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'personapis/stateUsers',
            data: JSON.stringify({...api_param}),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {
                swal.close();
                console.log(data);
                alertAll(data);
                $scope.loadUsers();

            },
            error: function (objXMLHttpRequest) {
                console.log("error: ", objXMLHttpRequest);
            }
        });
    };

    $("#name_user").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($(".user_table tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
});
