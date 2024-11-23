var app = angular.module('app', ["ngRoute"]);//, "ngAnimate"
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "home.html",
                controller: "home_controller"
            })
            .when("/home", {
                templateUrl: "home.html",
                controller: "home_controller"
//                controllerAs: "mapa"
            })
            .when("/myprojects", {
                templateUrl: "myprojects.html",
                controller: "myprojects_controller"
            })
            .when("/shareprojects", {
                templateUrl: "shareprojects.html",
                controller: "shareprojects_controller"
            })
            .when("/diagramsuml", {
                templateUrl: "diagramsuml.html",
                controller: "diagramsuml_controller"
            })
            .when("/dispositiveiot", {
                templateUrl: "dispositiveiot.html",
                controller: "dispositiveiot_controller"
            })
            .when("/componentsiot", {
                templateUrl: "componentsiot.html",
                controller: "component_controller"
            })
            .when("/usermanagement", {
                templateUrl: "usermanagement.html",
                controller: "users_controller"
            })
            .when("/interpret", {
                templateUrl: "interpret.html",
                controller: "interpret_controller"
            })
            .when("/entregablesproject", {
                templateUrl: "entregablesproject.html",
                controller: "projectentregable_controller"
            })
            .otherwise({
                redirectTo: 'notfound',
                templateUrl: 'notfound.html',
                controller: "notfound_controller"
            });
});


app.controller("application", function ($scope, $http) {

    $scope.DatoUsuario = {};
    $scope.rutaImgUser = location.origin + rutasStorage.imguser

    $scope.appPage = {
        tittle: "Home",
        Select: ''
    };

    $scope.validatePermit = (DatoUsuario) => {
        return  DatoUsuario["type_person"] === "U" ? "Usuario" :
            DatoUsuario["type_person"] === "A" ? "Administrator" :
                DatoUsuario["type_person"] === "R" ? "Root" : "Inactive";
    };

    $scope.nameUser = (DatoUsuario) => {
      return DatoUsuario.name_person + ' ' + DatoUsuario.lastname_person;
    };

    $(document).ready(function () {
        $scope.DatoUsuario = getDataSession();
        //let permitUser = document.getElementById("permitUser");
        let nameUser = document.getElementById("nameUser");
        //permitUser.innerHTML = $scope.validatePermit($scope.DatoUsuario);
        nameUser.innerHTML = $scope.nameUser($scope.DatoUsuario);
        // console.log($scope.DatoUsuario);
        // console.log("tddm4iots iniciado correctamente");
    });

    $scope.changeTittlePage = function (tittle, apply) {
        if (apply) {
            $scope.$apply(() => {
                $scope.appPage.tittle = tittle;
            });
        } else {
            $scope.appPage.tittle = tittle;
        }
    };

    $scope.redirect = function (page) {
        if (page) {
            $scope.appPage.Select = page;
            location.href = "#!" + page;
        }
    };

    $scope.logOut = () => {
        cerrarSesion();
    };

});

function verpunto(val) {
    // console.log("llamar a", val);
    angular.element($('[ng-view')).scope().verinfopunto(val);
}

function verRuta(val) {
    // console.log("llamar a", val);
    angular.element($('[ng-view')).scope().verinforuta(val);
}

//angular.element($('[ng-view')).scope().fun()
