app = angular.module('app', []);
app.controller('controllerIndex', function ($scope, $http) {
    
    $(document).ready(function () {
        var email_login = document.getElementById('email_login');
        email_login.onpaste = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

        email_login.oncopy = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };
        var password_login = document.getElementById('password_login');
        password_login.onpaste = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

        password_login.oncopy = function (e) {
            e.preventDefault();
            alertAll({"status": 3, "information": "Action not allowed"});
        };

    });
    
    $scope.login = (form) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'personapis/logIn',
            data: JSON.stringify({
                "email": form.email_login.$viewValue,
                "password": form.password_login.$viewValue}),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {
                swal.close();
                // console.log(data);
                if (data.status === 2) {
                    store.session.set("user_tddm4iotbs", data.data[0]);
                    location.href = 'app.html';
                }
                alertAll(data);
            },
            error: function (objXMLHttpRequest) {
                // console.log("error: ", objXMLHttpRequest);
            }
        });
    };

});