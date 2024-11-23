/* global store, urlWebServicies, swal, Swal */

app.controller("shareprojects_controller", function ($scope, $http) {

    $(document).ready(() => {
        $scope.listShareProjects();
        $scope.listProjectsInvitations();
        $scope.appPage.Select = "shareprojects";
    });
    $scope.flag_selected_projectup = false;
    $scope.flag_selected_projectdowm = false;

    $scope.listInvitations = [];
    $scope.listSharedHave = [];

    $scope.selected_projectup = {};
    $scope.selected_projectdowm = {};

    $scope.openModalInvitation = () => {
        $("#modalInvitations").modal("show");
    }

    $scope.closeModalInvitation = () => {
        $("#modalInvitations").modal("hide");
    }

    $scope.listShareProjects = function () {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/listShareProject',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "typeSelect": "1",
                    "idProject": "0"}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    //swal.close();
                    // console.log(data);
                    $scope.$apply(function () {
                        $scope.listSharesWithMe = data.data;
                        // console.log($scope.listSharesWithMe);
                    });
                    alertAll(data);
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

    $scope.listProjectsInvitations = function () {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/listShareProject',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "typeSelect": "2",
                    "idProject": "0"}),
                beforeSend: function (xhr) {
                    //loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    $scope.$apply(function () {
                        $scope.listInvitations = data.data;
                        // console.log($scope.listInvitations);
                    });
                    alertAll(data);
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

    $scope.selectProjectUp = function (objetct_selected_projectup) {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getModules',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "folder": objetct_selected_projectup.path_mp,
                    "stateUml": objetct_selected_projectup.status_uml,
                    "stateIoT": objetct_selected_projectup.status_iot
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    $scope.flag_selected_projectup = true;
                    // console.log(objetct_selected_projectup);
                    $scope.$apply(() => {
                        $scope.selected_projectup = {
                            "idproj": objetct_selected_projectup.id_masterproject,
                            "creationdate_mp": objetct_selected_projectup.creationdate_mp,
                            "updatedate_mp": objetct_selected_projectup.updatedate_mp,
                            "name_mp": objetct_selected_projectup.name_mp,
                            "code_mp": objetct_selected_projectup.code_mp,
                            "permit_mp": objetct_selected_projectup.permit_pm,
                            "uml": {data: data.data.dataUml, "msgUml": data.data.msgUml},
                            "iot": {data: data.data.dataIoT, "msgIoT": data.data.msgIoT},
                            "download": objetct_selected_projectup.download,
                            "id_masterproject" : objetct_selected_projectup.id_masterproject
                        };
                    });
                    // console.log($scope.selected_projectup);
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
    
    $scope.selectProjectEntregables = function (objetct_selected_projectup){
        var dataUser = store.session.get("user_tddm4iotbs");
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
                    download(data.data.nameFileZip, data.data.MavenApplication);
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

    $scope.openIoT = function () {
        location.href = "jobsAreaIoT.html?identifiquer=" + $scope.selected_projectup.idproj;
    };

    $scope.openUml = function () {
        location.href = "jobsAreaUml.html?identifiquer=" + $scope.selected_projectup.idproj;
    };


    // funcion para aceptar la invitacion del proyecto
    $scope.aceptInvitation = (project) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure to accept "+project.propietario+" invitation to collaborate in the development " +
                "of this project?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, accept invitation!'
        }).then((result) => {
            if (result.isConfirmed) {
                let dataAceptInvitation = {
                    "idProject": project.id_permitmaster,
                    "permit": project.permit_pm,
                    "joinActive": "A"
                };
                // console.log(dataAceptInvitation);
                wsAceptInvitation(dataAceptInvitation);
                $scope.$apply(() => {
                    $scope.listShareProjects();
                    $scope.listProjectsInvitations();
                    $scope.closeModalInvitation();
                });
            }
        });
    };

    // funcion para salir  del proyecto colaborativo
    $scope.stopColaborating = (project) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you are no longer a partner of this project?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, stop collaboration!'
        }).then((result) => {
            if (result.isConfirmed) {
                let dataAceptInvitation = {
                    "idProject": project.id_permitmaster,
                    "permit": project.permit_pm,
                    "joinActive": "I"
                };
                // console.log(dataAceptInvitation);
                wsAceptInvitation(dataAceptInvitation);
                $scope.$apply(() => {
                    $scope.listShareProjects();
                    $scope.listProjectsInvitations();
                    $scope.closeModalInvitation();
                });
            }
        });
    };

    let wsAceptInvitation = (api_param) => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/aceptInvitation',
                data: JSON.stringify({"user_token": dataUser.user_token, ...api_param}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    // console.log(data);
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "app.html#!/home";
        }
    }
    
    $scope.loadEntregablesProjectShare = () => {      
        if($scope.selected_projectup !== undefined && $scope.selected_projectup !== null){
            window.sessionStorage.setItem("id_project",  $scope.selected_projectup.idproj);
            window.location = "app.html#!/entregablesproject";
        } 
    }
    
});
