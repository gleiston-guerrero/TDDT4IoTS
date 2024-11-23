/* global swal, urlWebServicies */

app = angular.module('app', []);
app.controller('controllerSingUp', function ($scope, $http) {

    $(document).ready(function () {
        var email_sup = document.getElementById('email_sup');
        email_sup.onpaste = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

        email_sup.oncopy = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

        var password_sup = document.getElementById('password_sup');
        password_sup.onpaste = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

        password_sup.oncopy = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };
        var password_confirm_sup = document.getElementById('password_confirm_sup');
        password_confirm_sup.onpaste = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

        password_confirm_sup.oncopy = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };
    });

    $scope.registerUser = (form) => {
        if (form.$valid) {
            if (form.password_sup.$viewValue === form.password_confirm_sup.$viewValue) {
                let user_data = {
                    "name": form.first_name.$viewValue,
                    "lastname": form.last_name.$viewValue,
                    "email": form.email_sup.$viewValue,
                    "password": form.password_confirm_sup.$viewValue,
                    "provider": "native",
                    "base64": ""
                };
                apiRegisterUser(user_data, form);
            } else {
                alertAll({"status": 3, "information": "Passwords do not match"});
            }
        }
    };


    $scope.resetForm = (form) => {
        $scope.first_name = "";
        $scope.last_name = "";
        $scope.email_sup = "";
        $scope.password_sup = "";
        $scope.password_confirm_sup = "";

        form.$setPristine();
        form.$setUntouched();
    };

    apiRegisterUser = (api_param, form) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'personapis/register',
            data: JSON.stringify({...api_param}),
            beforeSend: (xhr) => {
                loading();
            },
            success: (data) => {
                swal.close();
                // console.log(data);
                if(data.status === 2) {
                    location.href = "messageSingUp.html";
                } else {
                    alertAll(data);
                }
                /*$scope.$apply(() => {
                    $scope.resetForm(form);
                });*/
            },
            error: (objXMLHttpRequest) => {
                // console.log("error: ", objXMLHttpRequest);
            }
        });
    };

});
