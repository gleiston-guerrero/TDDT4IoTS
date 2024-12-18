/* global urlWebServicies, store, swal */

app.controller("myprojects_controller", function ($scope, $http) {

    $scope.mavenProject = "";

    $(document).ready(() => {
        angular.element($('[ng-controller="application"]')).scope().changeTittlePage("My Projects", true);
        $scope.loadProjects();
        $scope.appPage.Select = "myprojects";
    });

    /*
     * Status
     * Active => A
     * Inactive => I
     * */

    $scope.myprojects = [];
    $scope.myprojects_entregables = [];

    $scope.selected_project = {};
    $scope.flag_selected_project = false;

    $scope.loadEntregablesProject = () => {
        if ($scope.selected_project !== undefined && $scope.selected_project !== null) {

            window.sessionStorage.setItem("id_project", $scope.selected_project.idproj);
            window.location = "app.html#!/entregablesproject";

            /*$.ajax({
             method:"POST",
             dataType: "json",
             contentType: "application/json; charset=utf-8",
             url: urlWebServicies + 'entregable/selectEntregables',
             data: JSON.stringify({
             "idmasterproject": $scope.selected_project.idproj
             }),
             success: function(data){
             window.location = "app.html#!/home";
             }
             });*/
        }

    };

    //funcion para cargar los proyectos existentes
    $scope.loadProjects = () => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getProjects',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "type": "PROJECT_USER"
                }),
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
        } else {
            location.href = "index";
        }
    };

    $scope.alert = function (arg) {
        alert(arg);
    };
    $scope.selectProject = function (objetct_selected_project) {
        var dataUser = store.session.get("user_tddm4iotbs");
        window.sessionStorage.setItem("projectpath", objetct_selected_project.path_mp);
        window.sessionStorage.setItem("projectname", objetct_selected_project.name_mp);
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getModules',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "folder": objetct_selected_project.path_mp,
                    "stateUml": objetct_selected_project.status_uml,
                    "stateIoT": objetct_selected_project.status_iot
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    $scope.flag_selected_project = true;
                    // console.log(objetct_selected_project);

                    $scope.$apply(() => {
                        $scope.selected_project = {
                            "idproj": objetct_selected_project.id_masterproject,
                            "creationdate_mp": objetct_selected_project.creationdate_mp,
                            "updatedate_mp": objetct_selected_project.updatedate_mp,
                            "name_mp": objetct_selected_project.name_mp,
                            "code_mp": objetct_selected_project.code_mp,
                            "permit_mp": objetct_selected_project.permit_pm,
                            "uml": {data: data.data.dataUml, "msgUml": data.data.msgUml},
                            "iot": {data: data.data.dataIoT, "msgIoT": data.data.msgIoT},
                            "download": objetct_selected_project.download,
                            "id_masterproject" : objetct_selected_project.id_masterproject
                        };
                        $scope.mavenProject = rutasStorage.projects + objetct_selected_project.path_mp + "/ProjectMvnSpr.zip";
                    });
                    // console.log("PATH DEEL RPOYECTO ", objetct_selected_project.path_mp);
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "index";
        }
        // console.log($scope.selected_project);
    };

    $scope.deleteProject = function (objetct_selected_project) {
        swal.fire({
            title: '¿You want to delete this project?',
            showDenyButton: true,
//                showCancelButton: true,
            confirmButtonText: `Delete`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {

                var dataUser = store.session.get("user_tddm4iotbs");
                if (dataUser !== undefined && dataUser !== null) {
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        url: urlWebServicies + 'projects/deleteProject',
                        data: JSON.stringify({
                            "user_token": dataUser.user_token,
                            "idproj": objetct_selected_project.id_masterproject
                        }),
                        beforeSend: function (xhr) {
                            loading();
                        },
                        success: function (data) {
                            swal.close();
                            // console.log(data);
//                    $scope.$apply(() => {
//
//                    });
                            $scope.loadProjects();
                            alertAll(data);
                        },
                        error: function (objXMLHttpRequest) {
                            // console.log("error: ", objXMLHttpRequest);
                        }
                    });
                } else {
                    location.href = "index";
                }
            } else if (result.isDenied) {
                swal.fire("Okay ... think better next time");
            }
        });
    };

    $scope.deleteModule = function (objetct_selected_project, type) {

        swal.fire({
            title: '¿You want to delete this project?',
            showDenyButton: true,
//                showCancelButton: true,
            confirmButtonText: `Delete`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {

                var dataUser = store.session.get("user_tddm4iotbs");
                if (dataUser !== undefined && dataUser !== null) {
                    // console.log(objetct_selected_project);
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        url: urlWebServicies + 'projects/deleteModules',
                        data: JSON.stringify({
                            "user_token": dataUser.user_token,
                            "idproj": objetct_selected_project.idproj,
                            "type": type
                        }),
                        beforeSend: function (xhr) {
                            loading();
                        },
                        success: function (data) {
                            swal.close();
                            // console.log(data);
//                    $scope.$apply(() => {
//
//                    });
                            window.location.reload();
                            alertAll(data);
                        },
                        error: function (objXMLHttpRequest) {
                            // console.log("error: ", objXMLHttpRequest);
                        }
                    });

                } else {
                    location.href = "index";
                }
            } else if (result.isDenied) {
                swal.fire("Okay ... think better next time");
            }
        });
    };


    $scope.createModuleUml = function (selected_project) {
        // console.log(selected_project.idproj);
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/updateModule',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idproj": selected_project.idproj,
                    "module": "DiagramUml",
                    "state": "CREATE"
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    if (data.status === 2) {
                        $scope.$apply(() => {
                            selected_project.uml.data.push("true");
                        });
                        alertAll(data);
                    }
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "index";
        }

        // console.log(selected_project);
        //selected_project.uml.status = "A";
    };

    $scope.createModuleIoT = function (selected_project) {
        // console.log(selected_project.idproj);
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/updateModule',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idproj": selected_project.idproj,
                    "module": "EasyIoT",
                    "state": "CREATE"
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    if (data.status === 2) {
                        $scope.$apply(() => {
                            selected_project.iot.data.push("true");
                        });
                        alertAll(data);
                    }
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "index";
        }
        // console.log(selected_project);
        //selected_project.iot.status = "A";
    };

    $scope.openUml = function () {
        location.href = "jobsAreaUml.html";
    };

    $scope.openIoT = function () {
        location.href = "jobsAreaIoT.html?identifiquer=" + $scope.selected_project.idproj;
    };

    $scope.openUml = function () {
        location.href = "jobsAreaUml.html?identifiquer=" + $scope.selected_project.idproj;
    };

    $scope.newProject = (form) => {
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            if (dataUser !== undefined && dataUser !== null) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + 'projects/saveComponent',
                    data: JSON.stringify({
                        "user_token": dataUser.user_token,
                        "nameProject": form.name_np.$viewValue,
                        "description": form.description_np.$viewValue
                    }),
                    beforeSend: function (xhr) {
                        loading();
                    },
                    success: function (data) {
                        swal.close();
                        // console.log(data);
                        //actualizar la tabla de los proyectos
                        $scope.loadProjects();
                        alertAll(data);
                        $scope.name_np = "";
                        $scope.description_np = "";
                        $("#modalCreateProject").modal('hide');
                    },
                    error: function (objXMLHttpRequest) {
                        // console.log("error: ", objXMLHttpRequest);
                    }
                });
            } else {
                location.href = "index";
            }
        }
    };

    $scope.shareProject = (form) => {
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            if (form.shared_np.$viewValue === dataUser["email_person"]) {
                alertAll({status: 3, information: "You cannot share your project to yourself."});
                return;
            }
            if (dataUser !== undefined && dataUser !== null) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + 'projects/shareProject',
                    data: JSON.stringify({
                        "user_token": dataUser.user_token,
                        "emailShare": form.shared_np.$viewValue,
                        "idproj": id_masterprojectShare,
                        "permit": form.shared_sp.$modelValue,
                        "stateShare": 'WAITING'
                    }),
                    beforeSend: function (xhr) {
                        loading();
                    },
                    success: function (data) {
                        swal.close();
                        // console.log(data);
                        alertAll(data);
                        $scope.shared_np = "";
                        $("#modalShareProject").modal('hide');
                    },
                    error: function (objXMLHttpRequest) {
                        // console.log("error: ", objXMLHttpRequest);
                    }
                });
            } else {
                location.href = "index";
            }
        }
    };

    // descargar
    $scope.downloadPrjMav = () => {
        var dataUser = store.session.get("user_tddm4iotbs");
        let api_data = {
            "user_token": dataUser.user_token,
            "idProj": $scope.selected_project.id_masterproject,
            "module": 'DownloadMvn'
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
                loading();
            },
            success: (data) => {
                swal.close();
                alertAll(data);
                //$("#modal_package_maven").modal("show");
                $scope.$apply(() => {
                    swal.close();
                    // console.log(data);
                    $("#modal_package_maven").modal("hide");
                    $("#modal_download_maven").modal("hide");
                    $scope.mavenProject = data.data.MavenApplication;
                    download("ProjectMvnSpr.zip", data.data.MavenApplication);
                });
            },
            error: (objXMLHttpRequest) => {
                // console.log("error: ", objXMLHttpRequest);
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

    $scope.listEntregablesProject = (selected_project) => {
        alert(selected_project);
    };

    /* *
     * Abrir modal para mostrar los entregables existentes 
     * para el proyecto seleccionado
     * */
    $scope.selectEntregable = () => {
        $("#modalSelectEntregable").modal();
    };
    /**
     * Abrir modal para crear un nuevo proyecto
     * */
    $scope.openInsertProject = () => {
        $("#modalCreateProject").modal();
    };
    let id_masterprojectShare = '';
    $scope.openShareProject = function (objetct_selected_project) {
        $("#modalShareProject").modal();
        id_masterprojectShare = objetct_selected_project.id_masterproject;
    };

    $scope.cancelProject = () => {
        $scope.name_np = "";
        $scope.description_np = "";
        $("#modalCreateProject").modal('hide');
    };

    $scope.cancelShareProject = () => {
        $scope.shared_np = "";
        $("#modalShareProject").modal('hide');
    };


});
