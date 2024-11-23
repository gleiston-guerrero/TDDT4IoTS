app.controller("notfound_controller", function ($scope, $http) {
    $(document).ready(() => {
        angular.element($('[ng-controller="application"')).scope().changeTittlePage("Not Found", true);
    });
});