/* global urlWebServicies, swal, app */

app.expandControllerMavenProject = function ($scope) {

    $scope.mavenProject = '';
    $scope.selectedEntitieObj = {};
    $scope.jsonMavenProject = {entities: [], conectionDB: {}, test: []};

    /**
     * ##############################################################################################################
     * DESCARGAR Y ENCAPSULAR PROYECTO
     * ##############################################################################################################
     * */

    // descargar
    $scope.downloadPrjMav = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'DownloadMvn'
        };
        apiencapsulateProject(api_data);
    };

    // empaquetar proyecto
    $scope.packagePrjMav = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'ZipMvn'
        };
        apiencapsulateProject(api_data);
    };

    // crear proyecto maven
    $scope.encapsulateProject = () => {
        let urlParams = new URLSearchParams(window.location.search);
        let id_project = urlParams.get('identifiquer');
        let api_data = {
            "user_token": $scope.DatoUsuario.user_token,
            "idProj": id_project,
            "info": JSON.stringify($scope.jsonMavenProject),
            "module": 'CreateMvn'
        };
        apiencapsulateProject(api_data);
    };

    apiencapsulateProject = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'projects/MavenProject',
            data: JSON.stringify({...api_param}),
            beforeSend: () => {
                if(api_param.module === "CreateMvn")
                    loadingMvn();
                else
                    loading();
            },
            success: (data) => {
                swal.close();
                console.log(data);
                alertAll(data);
                //$("#modal_package_maven").modal("show");
                $scope.$apply(() => {
                    /*$scope.mavenProject = rutasStorage.projects + data.data.MavenApplication;
                    console.log($scope.mavenProject);*/
                    if (api_param.module === "CreateMvn") {
                        $("#modal_class_conecction").modal("hide");
                        $("#modal_package_maven").modal("show");
                        //$scope.downloadPrjMav();
                        $scope.mavenProject = data.MavenApplication;
                    } else if (api_param.module === "ZipMvn") {
                        swal.close();
                        $("#modal_package_maven").modal("hide");
                        $("#modal_download_maven").modal("show");
                        console.log(data);
                        $scope.mavenProject = data.data.MavenApplication;
                        //download("ProjectMvnSpr.zip", data.data.MavenApplication);
                    } else if (api_param.module === "DownloadMvn") {
                        swal.close();
                        console.log(data);
                        $("#modal_package_maven").modal("hide");
                        $("#modal_download_maven").modal("hide");
                        $scope.mavenProject = data.data.MavenApplication;
                        download(data.data.nameFileZip, data.data.MavenApplication);
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

    $scope.openModalCreateMavenProject = () => {
        // abrir modal
        $("#modal_create_mavenproject").modal();
        // realizar una copia del json del diagrama de clases
        $scope.jsonMavenProject.entities = Object.assign([], $scope.jsonClass.diagram[0].class);
        // realizar una copia del json de los enums
        $scope.jsonMavenProject.enums = Object.assign([], $scope.jsonClass.diagram[0].enums);
        // realizar una copia del json de las test
        $scope.jsonMavenProject.test = Object.assign([], $scope.jsonTdd.receiveTDDJSOM); 
        // aumentar los nuevos parametros
        $scope.addNewParams($scope.jsonMavenProject.entities);
        // validar campos de la tabla de los atributos
        $scope.addClassFront($scope.jsonMavenProject.entities);
        console.log("JSON MANVE PROJEECT", $scope.jsonMavenProject);
    };

    $scope.addClassFront = (entities) => {
        for (let i = 0; i < entities.length; i++) {
            entities[i]["classFront"] = "btn btn-sm button-dt mr-2 mt-1";
        }
    };

    $scope.removeClassFront = (entities, index) => {
        for (let i = 0; i < entities.length; i++) {
            entities[i]["classFront"] = index === i ? "btn btn-sm button-active mr-2 mt-1" : "btn btn-sm button-dt mr-2 mt-1";
        }
    };

    $scope.cancelDownload = () => {
        $('#modal_download_maven').modal('hide');
    };
    
    $scope.cancelPackage = () => { $("#modal_package_maven").modal("hide"); };

    // funcion para obtener los atributos de la clase seleccionada
    $scope.selectedEntitie = (entitie, index) => {
        console.log(entitie);
        entitie.classFront = "btn btn-sm button-active mr-2 mt-1";
        $scope.removeClassFront($scope.jsonMavenProject.entities, index);
        $scope.selectedEntitieObj = entitie;
    };

    // funcion para agregar los nuevos parametros a los atributos de cada entidad
    $scope.addNewParams = (entities) => {
        for (let positionEntitie = 0; positionEntitie < entities.length; positionEntitie++) {
            let attributes = entities[positionEntitie].attributes;
            for (let positionAttributes = 0; positionAttributes < attributes.length; positionAttributes++) {
                let attribute = attributes[positionAttributes];
                // aumentar los nuevos parametros
                attribute["not_null"] = positionAttributes === 0;
                attribute["primary_key"] = positionAttributes === 0;
                attribute["length_precision"] = attribute["type"] === "String" ? 30 : -1;
            }
        }
    };

    // actualizar el tipo de dato
    $scope.updateDataTypeMavenProject = (attribute, index) => {
        let newDataType = $("#datatype_maven" + index).val();
        console.log(newDataType);
        attribute["type"] = newDataType.split(":")[1];
    };

    // actualizar el length/preicison
    $scope.updateLengthMavenProject = (attribute, index) => {
        let newLength = $("#length_maven" + index).val();
        console.log(newLength);
        attribute["length_precision"] = parseInt(newLength);
    };

    // actualizar el notnull
    $scope.updateNotNullMavenProject = (attribute) => {
        attribute["not_null"] = !attribute["not_null"];
    };

    // actualizar el primary key
    $scope.updatePrimaryKeyMavenProject = (attribute, index) => {
        let checkpk = $("#notNull_" + index);

        if (attribute["not_null"] && !attribute["primary_key"]) {
            attribute["primary_key"] = !attribute["primary_key"];
            // aseguramos que este en verdadero
            attribute["not_null"] = true
            // aseguramos que el check en la interfaz este en true
            checkpk.prop('checked', true);
            // deshabilitamos el check
            checkpk.attr('disabled', 'disabled');
        } else {
            attribute["primary_key"] = !attribute["primary_key"];
            attribute["not_null"] = !attribute["not_null"];
            checkpk.prop('checked', attribute["not_null"]);
            if (attribute["not_null"] === true) {
                checkpk.attr('disabled', 'disabled');
            } else {
                checkpk.prop('checked', false);
                checkpk.removeAttr('disabled');
            }
        }

        // desactivar el check de primary key a los demas
        for (let x = 0; x < $scope.selectedEntitieObj.attributes.length; x++) {
            let checkAllPk = $("#primary_key" + x);
            let checkAllNotNull = $("#notNull_" + x);
            let attributteAll = $scope.selectedEntitieObj.attributes[x];
            if (x !== index) {
                if (attributteAll["not_null"] && attributteAll["primary_key"]) {
                    checkAllPk.prop('checked', false);
                    checkAllNotNull.removeAttr('disabled');
                    checkAllNotNull.prop('checked', false);
                    attributteAll["primary_key"] = false;
                    attributteAll["not_null"] = false;
                }
            }
        }
    };

    $scope.nextStep = () => {
        $("#modal_create_mavenproject").modal("hide");
        $("#modal_class_conecction").modal();
    };

    $scope.returnStep = () => {
        $("#modal_create_mavenproject").modal();
        $("#modal_class_conecction").modal("hide");
    };

    $scope.createMavenProject = (form) => {
        let url_data_base = "";
        let jdbc = "";

        switch (form.db_driver.$modelValue) {
            case "pg":
                url_data_base = "org.postgresql.Driver";
                jdbc = "jdbc:postgresql://" + form.db_server.$modelValue + ":" + form.db_port.$modelValue + "/" + form.db_name.$modelValue;
                break;
            case "mq":
                url_data_base = "com.mysql.jdbc.Driver";
                jdbc = "jdbc:mysql://" + form.db_server.$modelValue + ":" + form.db_port.$modelValue + "/" + form.db_name.$modelValue;
                break;
            case "sq":
                url_data_base = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
                jdbc = "jdbc:sqlserver://" + form.db_server.$modelValue + ":" + form.db_port.$modelValue + ";databaseName=" + form.db_name.$modelValue;
                break;
        }

        // obtener datos del form para la clase conexion
        $scope.jsonMavenProject.conectionDB = {
            db_name: form.db_name.$modelValue,
            db_user: form.db_user.$modelValue,
            db_password: form.db_password.$modelValue,
            db_server: form.db_server.$modelValue,
            db_port: form.db_port.$modelValue,
            db_port_app: form.db_port_app.$modelValue,
            create: form.create.$modelValue,
            createDrop: form.createDrop.$modelValue,
            url_data_base: url_data_base,
            jdbc: jdbc
        };
        console.log($scope.jsonMavenProject);
        $scope.encapsulateProject();
    };
    /**
     * ##############################################################################################################
     * FIN DESCARGAR Y ENCAPSULAR PROYECTO
     * ##############################################################################################################
     * */


}
