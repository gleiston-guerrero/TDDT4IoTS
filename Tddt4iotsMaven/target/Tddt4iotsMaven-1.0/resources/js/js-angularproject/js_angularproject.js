/* global urlWebServicies, swal, app */

app.expandControllerAngularProject = function ($scope) { 
    
    $scope.angularProject = {};
    $scope.jsonAngularProject = {entities: []};
    
    // crear proyecto angular
    $scope.createAngularProject = () => {
        $scope.jsonAngularProject.entities = Object.assign([], $scope.jsonClass.diagram[0].class);
        $scope.addNewParams($scope.jsonAngularProject.entities);
        // validar campos de la tabla de los atributos
        $scope.addClassFront($scope.jsonAngularProject.entities);
        
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonAngularProject),
            "module": 'createAng'
        };
        apiAngularProject(api_data);
    };
    
    // empaquetar proyecto
    $scope.packagePrjAng = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'zipAng'
        };
        apiAngularProject(api_data);
    };
    
    // empaquetar todo el proyecto
    $scope.packagePrjAll = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'zipAll'
        };
        apiAngularProject(api_data);
    };
    
    // descargar todo
    $scope.downloadPrjAll = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'downloadAll'
        };
        apiAngularProject(api_data);
    };
    
    // descargar
    $scope.downloadPrjAng = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'downloadAng'
        };
        apiAngularProject(api_data);
    };
    
    apiAngularProject = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'projects/angularProject',
            data: JSON.stringify({...api_param}),
            beforeSend: () => {
                if(api_param.module === "createAng")
                    loadingAng();
                else
                    loading();
            },
            success: (data) => {
                swal.close();
                console.log(data);
                alertAll(data);
                $scope.$apply(() => {
                    if (api_param.module === "createAng") {
                        $("#modal_package_angular").modal("show");
                        $scope.angularProject = data;
                    } else if (api_param.module === "zipAng") {
                        swal.close();
                        $("#modal_package_angular").modal("hide");
                        $("#modal_download_angular").modal("show");
                        console.log(data);
                        $scope.angularProject = data;
                    } else if (api_param.module === "downloadAng") {
                        swal.close();
                        console.log(data);
                        $("#modal_package_angular").modal("hide");
                        $("#modal_download_angular").modal("hide");
                        $scope.angularProject = data;
                        download(data.data.nameFileZip, data.data.angularApplication);
                    } else if (api_param.module === "downloadAll") { 
                        swal.close();
                        console.log(data);
                        download(data.data.nameFileZip, data.data.angularApplication);
                    }
                });
            },
            error: (objXMLHttpRequest) => {
                console.log("error: ", objXMLHttpRequest);
            }
        });
    };
    
    function download(filename, textInput) {
        var element = document.createElement('a');
        //element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
        element.setAttribute('href', location.origin + "/storageTddm4IoTbs/" + textInput);
        element.setAttribute('download', filename);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    
};

