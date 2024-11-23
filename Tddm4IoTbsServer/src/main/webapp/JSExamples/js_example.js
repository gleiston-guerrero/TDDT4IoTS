/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var urlWebServicies = location.origin + "/examples/webresources/";
app = angular.module('app', []);
app.controller('controllerexample', function ($scope, $http) {
    $scope.result = [];
    document.getElementById("btnSend").addEventListener('click', function (e) {
        btnSendJSON({"email": document.getElementById("email").value,
            "affair": document.getElementById("affair").value,
            "message": document.getElementById("message").value});
    });

    function btnSendJSON(jsonParam) {
       
        var urlWebServicies2 = urlWebServicies + 'example/exampleJSON';
         console.log(urlWebServicies2);
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'example/exampleJSON',
            data: JSON.stringify({jsonParam}),
            beforeSend: function () {
            },
            success: function (data) {
                alert(data.information);
            },
            error: function (objXMLHttpRequest) {
                console.log("error", objXMLHttpRequest);
            }
        });
    }

});

