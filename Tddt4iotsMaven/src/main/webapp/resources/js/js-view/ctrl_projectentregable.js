/* global urlWebServicies, store, swal */

app.controller("projectentregable_controller", function ($scope, $http) {
    $scope.cadena=store.session.get("projectname");
    $scope.nameentregable = null;
    $scope.namecomponent = null;
    
    $scope.selected_project = null;
    $scope.alldata_selected_project = null;
    $scope.selected_component = -1;
    $scope.selected_entregable = null;

    $scope.project_entregable = [];
    $scope.project_members_entregable = [];
    $scope.project_entregable_components = [];
    $scope.project_entregable_components_tasks = [];

    $scope.history_update_task = [];

    $scope.flag_selected_entregable = false;
    $scope.flag_selected_component = false;
    $scope.flag_selected_task = false;

    $scope.project_entregable_component_selected = null;
    $scope.entregable_component_task_selected = null;

    $scope.actionToModal = null;
    $scope.todayDate = null;
    $scope.dataError = "Error the total percentage is bigger than 100%";

    $scope.flagShowingAlert = false;
    
    $scope.idcomponenteSelectedViewTask=null;
    $scope.pathProj=null;
    
$scope.loadComponentsEntregable =null;
    $scope.rolcomponent = "";
    $scope.rolentregable = "";
    $scope.rolusuario = store.session.get("user_tddm4iotbs");




    $(document).ready(function () {
        angular.element($('[ng-controller="application"]')).scope().changeTittlePage("My Projects - Deliverables", true);
        $scope.updateInformationElements();
        $scope.flagShowingAlert = true;

        $scope.todayDate = new Date();

        $scope.selected_project = window.sessionStorage.getItem("id_project");
        $scope.loadEntregablesProject();
        $scope.selectProjectMaster();
        $scope.selected_component = 1;
        $scope.flag_selected_entregable = true;
        $scope.flag_selected_component = false;
        $scope.flag_selected_task = false;
        //$scope.selectEntregableMembers();   
        $scope.pathProj=store.session.get("projectpath");
        $scope.appPage.Select = "entregablesproject";
        
    });

    $scope.executeLoadEntregables = () => {
        $scope.loadEntregablesProject();
        $scope.selectProjectMaster();
        $('#progress_bar_master_project').load();        
    };

    $scope.executeLoadComponents = () => {
        $scope.loadComponentsEntregable();
        //$scope.loadComponentEntregableSelected($scope.project_entregable_component_selected.id_entregable_component);
        $scope.getSelectedEntregableProject($scope.project_entregable_component_selected.id_entregable);

        $('#progress_bar_entregable_component').load();
        $('#progress_bar_project_entregable').load();
    };
    
    $scope.getProjectProperty = () => {        
        var dataUser = store.session.get("user_tddm4iotbs");
        if ($scope.selected_project !== undefined && $scope.selected_project !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getProjectProperty',
                data: JSON.stringify({
                    "idmasterproject": $scope.selected_project,
                    "emailperson": dataUser.email_person
                }),
                success: function (data) {                    
                    window.sessionStorage.setItem("permiProjectProperty", data);
                }
            });
        }
    };

    $scope.loadEntregablesProject = () => {
        var dataUser = store.session.get("user_tddm4iotbs");       
        if ($scope.selected_project !== undefined && $scope.selected_project !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'entregable/selectEntregables',
                data: JSON.stringify({
                    "idmasterproject": $scope.selected_project,
                    "type": 4,
                    "email": dataUser.email_person
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    // console.log(data);
                    $scope.$apply(function () {
                        $scope.project_entregable = data.data;
                        swal.close();
                        
                    });                                        
                    if ($scope.flagShowingAlert === false)
                        alertAll(data);
                    
                    $scope.getProjectProperty();
                }
            });
        }
    };

    $scope.loadComponentsEntregable = () => {
        var dataUser = store.session.get("user_tddm4iotbs");        
        if ($scope.selected_component !== undefined && $scope.selected_component !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'entregableComponents/getComponentas',
                data: JSON.stringify({
                    "id_entregable": $scope.selected_component,
                    "type": 4,
                    "email": dataUser.email_person
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    $scope.$apply(function () {
                        $scope.project_entregable_components = data.data;
                      
                        // console.log(data);
                    });
                    swal.close();
                    //alertAll(data.information);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.loadComponentEntregableSelected = (id_component) => {
        if (id_component !== undefined && id_component !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'entregableComponents/getComponentas',
                data: JSON.stringify({
                    "id_entregable": id_component,
                    "type": 3
                }),
                beforeSend: function (xhr) {
                    //loading();
                },
                success: function (data) {
                    $scope.$apply(function () {
                        $scope.project_entregable_component_selected = data.data[0];
                    });                    
                    //alertAll(data.information);                   
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.selectEntregableMembers = (idtype, idElement) => {
        if ($scope.selected_component !== undefined && $scope.selected_component !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'members/getMembers',
                data: JSON.stringify({
                    "id_project_task": idElement,
                    "type": idtype
                }),
                success: function (data) {
                    $scope.$apply(function () {
                        $scope.project_members_entregable = data.data;
                    });                    
                    alertAll(data.information);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.selectProjectMaster = function () {
        if ($scope.selected_project !== undefined && $scope.selected_project !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/getProject',
                data: JSON.stringify({
                    "idmasterproject": $scope.selected_project
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    
                    $scope.$apply(() => {
                        $scope.alldata_selected_project = {
                        
                            "idproj": data[0]["id_masterproject"],
                            "creationdate_mp": data[0]["creationdate_mp"],
                            "updatedate_mp": data[0]["updatedate_mp"],
                            "stimateddate_mp": data[0]["stimateddate_mp"],
                            "name_mp": data[0]["name_mp"],
                            "path_mp": data[0]["path_mp"],
                            "code_mp": data[0]["code_mp"],
                            "description_mp": data[0]["description_mp"],
                            "permit_mp": data[0]["permit_pm"],
                            "general_percent": data[0]["general_percent"]
                        };
                    });
                    swal.close();
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        }        
    };

    $scope.getSelectedEntregableProject = (id_entregable) => {        
        if (id_entregable !== undefined && id_entregable !== null) {
            $.ajax({
                method: "POST",
                type: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'entregable/selectEntregables',
                data: JSON.stringify({
                    "idmasterproject": id_entregable,
                    "type": 3
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    $scope.$apply(function () {
                        $scope.selected_entregable = data.data[0];                        
                        alertAll(data);
                        swal.close();
                    });
                }
            });
        }
    };
    
    $scope.typeMemberViewSelected = -1;

    $scope.openModalViewMembers = (element, type) => {        
        $scope.typeMemberViewSelected = type;
        if(type === 0){
            document.getElementById("modal_title_view_members").textContent = element.name_entregable + ": Members";
            
            $scope.selected_entregable = element;            
            $scope.selectEntregableMembers(type, element.id_entregable);          
        }
        if(type === 1){
            document.getElementById("modal_title_view_members").textContent = element.name_component + ": Members";
            
            //document.getElementById("modal_members_role_show_label").visibility = "hidden";
            //document.getElementById("modal_members_role_show_select").visibility = "hidden";
            
            $scope.project_entregable_component_selected = element;
            $scope.selectEntregableMembers(type, element.id_entregable_component);
        }
        if(type === 2){
            document.getElementById("modal_title_view_members").textContent = element.name_task + ": Members";
            $scope.entregable_component_task_selected = element;
            $scope.selectEntregableMembers(type, element.id_task);
        }
        

        $("#modalViewMembers").modal();
    };

    $scope.selectProjectEntregable = (id_entregable, entregableSelected,nameentregable) => {
        $scope.nameentregable = nameentregable;
        $scope.tittlereport(2);
        $scope.selected_component = id_entregable;
        $scope.flag_selected_component = true;
        $scope.loadComponentsEntregable();
        $scope.loadComponentsEntregable();
        $scope.selected_entregable = entregableSelected;
    };

    $scope.newEntregable = ((form) => {        
        if (form.$valid) {
            let
                    id_masterproject = form.id_masterproject.$$attr.value,
                    name_entregable = form.name_entregable.$viewValue,
                    description_entregable = form.description_entregable.$viewValue,
                    status_entregable = form.status_entregable.$viewValue,
                    path_entregable = form.path_entregable.$$attr.value,
                    creationdate_entregable = "CreationDate",
                    updatedate_entregable = "updateDate",
                    //stimateddate_entregable=form.stimateddate_entregable.$viewValue,
                    stimateddate_entregable = document.getElementById("stimateddate_entregable_create").value,
                    finishdate_entregable = "Finished",
                    prioritylevel_entregable = form.prioritylevel_entregable.$viewValue,
                    base_percentage_entregable = form.base_percentage_entregable.$viewValue,
                    startdate_entregable = form.startdate_entregable.$viewValue;

            let dateone = new Date(startdate_entregable);
            let datetwo = new Date(stimateddate_entregable);
            if ((datetwo - dateone) / (1000 * 60 * 60 * 24) < 0) {
                let jsonError = {status: 3, information: "The dates are not valid.", data: "[]"};
                alertAll(jsonError);
                return;
            }

            var dataUser = store.session.get("user_tddm4iotbs");
            if (dataUser !== undefined && dataUser !== null) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + 'entregable/saveEntregable',
                    data: JSON.stringify({
                        "idmasterproject": $scope.selected_project,
                        "name_entregable": name_entregable,
                        "description_entregable": description_entregable,
                        "status_entregable": status_entregable,
                        "stimateddate_entregable": stimateddate_entregable,
                        "path_entregable": path_entregable,
                        "prioritylevel_entregable": prioritylevel_entregable,
                        "base_percentage_entregable": base_percentage_entregable,
                        "actual_percentage_entregable": 100,
                        "develop_status_entregable": "P",
                        "path_master_project": $scope.alldata_selected_project.path_mp,
                        "startdate_entregable": startdate_entregable,
                        "emailperson": dataUser.email_person
                    }),
                    beforeSend: function (xhr) {
                        loading();
                    },
                    success: function (data) {
                        swal.close();
                        $scope.dataError = data.information;                        

                        if (data.information === 'Error the total sum of the percentages in entregables is bigger than 100%') {
                            $scope.openErrorModal();
                        } else {
                            $scope.$apply(() => {
                                $scope.loadEntregablesProject();

                                $("#modalCreateEntre").modal('hide');
                                swal.close();

                                $scope.selectProjectMaster();
                                $('#progress_bar_master_project').load();
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
        }
    });

    $scope.updateEntregable = ((form) => {        
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");            
            let
                    id_entregable = $scope.selected_entregable.id_entregable,
                    name_entregable = form.name_entregable_edit.$viewValue,
                    description_entregable = form.description_entregable_edit.$viewValue,
                    status_entregable = form.status_entregable_edit.$viewValue,
                    path_entregable = form.path_entregable_edit.$$attr.value,
                    stimateddate_entregable = form.stimateddate_entregable_edit.$viewValue,
                    prioritylevel_entregable = form.prioritylevel_entregable_edit.$viewValue;
            base_percentage_entregable = form.base_percentage_entregable_edit.$viewValue;
            startdate_entregable = form.startdate_entregable_edit.$viewValue;
                        
            var dataUser = store.session.get("user_tddm4iotbs");
            if (dataUser !== undefined && dataUser !== null) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + 'entregable/updateEntregable',
                    data: JSON.stringify({
                        "id_entregable": id_entregable,
                        "id_masterproject": $scope.selected_entregable.id_masterproject,
                        "name_entregable": name_entregable,
                        "description_entregable": description_entregable,
                        "status_entregable": status_entregable,
                        "stimateddate_entregable": stimateddate_entregable,
                        "path_entregable": path_entregable,
                        "prioritylevel_entregable": prioritylevel_entregable,
                        "base_percentage_entregable": base_percentage_entregable,
                        "actual_percentage_entregable": $scope.selected_entregable.actual_percentage_entregable,
                        "startdate_entregable": startdate_entregable,
                        "emailperson":dataUser.email_person
                    }),
                    beforeSend: function (xhr) {
                        loading();
                    },
                    success: function (data) {
                        swal.close();                        

                        //alert("hecho");
                        $scope.$apply(() => {
                            $scope.loadEntregablesProject();
                            $scope.selectProjectMaster();
                            $('#progress_bar_master_project').load();
                        });

                        alertAll(data);

                        $("#modalEditEntre").modal('hide');
                    },
                    error: function (objXMLHttpRequest) {
                        // console.log("error: ", objXMLHttpRequest);
                    }
                });
            } else {
                location.href = "index";
            }
        }
    });


    $scope.newComponent = (form) => {
       var dataUser = store.session.get("user_tddm4iotbs"); 
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            if (dataUser !== undefined && dataUser !== null) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + 'entregableComponents/saveEntregableTask',
                    data: JSON.stringify({
                        "id_entregable": $scope.selected_component,
                        "name_component": form.name_component.$viewValue,
                        "description_component": form.description_component.$viewValue,
                        "status_component": form.status_component.$viewValue,
                        "visibility_component": "1",
                        "stimateddate_component": form.stimateddate_component.$viewValue,
                        "finishdate_component": "",
                        "path_component": form.name_component.$viewValue,
                        "base_percentage_component": form.base_percentage_component.$viewValue,
                        "actual_percentage_component": 100,
                        "develop_status_component": "P",
                        "path_master_project": $scope.alldata_selected_project.path_mp,
                        "path_project_entregable": $scope.selected_entregable.path_entregable,
                        "startdate_component": form.startdate_component.$viewValue,
                        "emailperson":dataUser.email_person,
                        "id_tcejorpmaster": $scope.selected_project
                    }),
                    beforeSend: function (xhr) {
                        loading();
                    },
                    success: function (data) {

                        $scope.$apply(() => {
                            $scope.loadComponentsEntregable();
                            $("#modalCreateComponent").modal('hide');                            
                            swal.close();
                            $scope.getSelectedEntregableProject($scope.selected_component);
                            $('#progress_bar_project_entregable').load();
                        });

                        alertAll(data);
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


    $scope.returnToEntregables = () => {
        $scope.flag_selected_entregable = false;
    };


    $scope.closeModalViewMembers = () => {
        $("#modalViewMembers").modal('hide');
    };

    $scope.openEntregableModal = (actionModal, entregable_selected) => {
        $scope.actionToModal = actionModal;
        if (actionModal === 'edit') {
            $scope.selected_entregable = entregable_selected;
        }
        $("#modalCreateEntre").modal();
    };

    $scope.openEntregableEditModal = (actionModal, entregable_selected, rol) => {
        $scope.actionToModal = actionModal;
        if (actionModal === 'edit') {
            $scope.selected_entregable = entregable_selected;

            $scope.getSelectedEntregableProject(entregable_selected.id_entregable);
            $scope.name_entregable_edit = $scope.selected_entregable.name_entregable;
            $scope.id_entregable_edit = $scope.selected_entregable.id_entregable;
            $scope.id_masterproject_edit = $scope.selected_entregable.id_masterproject;
            $scope.description_entregable_edit = $scope.selected_entregable.description_entregable;
            $scope.stimateddate_entregable_edit = new Date($scope.selected_entregable.stimateddate_entregable);
            $scope.status_entregable_edit = $scope.selected_entregable.status_entregable;
            $scope.prioritylevel_entregable_edit = $scope.selected_entregable.prioritylevel_entregable.toString();
            $scope.path_entregable_edit = $scope.selected_entregable.path_entregable;
            $scope.base_percentage_entregable_edit = $scope.selected_entregable.base_percentage_entregable;
            $scope.startdate_entregable_edit = new Date($scope.selected_entregable.startdate_entregable);
            $scope.rolentregable = rol;
        }
        $("#modalEditEntre").modal();
    };

    $scope.closeEntregableEditModal = () => {
        $("#modalEditEntre").modal('hide');
    };


    $scope.closeEntregableModal = () => {
        $("#modalCreateEntre").modal('hide');
    };

    $scope.returnToMyProjects = () => {
        window.location = "app.html#!/myprojects";
    };

    $scope.openCreateTask = function () {
        $("#modalCreateComponent").modal();
    };

    $scope.closeCreateTask = function () {
        $("#modalCreateComponent").modal('hide');
    };

    $scope.closeErrorModal = function () {
        $("#modalError").modal('hide');
    };

    $scope.openErrorModal = function () {
        $("#modalError").modal();
    };


    $scope.updateComponent = (form) => {
       
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + "entregableComponents/updateEntregableComponent",
                data: JSON.stringify({
                    'id_entregable': $scope.project_entregable_component_selected.id_entregable,
                    'name_component': form.name_component_edit.$viewValue,
                    'description_component': form.description_component_edit.$viewValue,
                    'status_component': form.status_component_edit.$viewValue,
                    'stimateddate_component': form.stimateddate_component_edit.$viewValue,
                    'base_percentage_component': form.base_percentage_component_edit.$viewValue,
                    'identregablecomponent': $scope.project_entregable_component_selected.id_entregable_component,
                    'actual_percentage_component': $scope.project_entregable_component_selected.actual_percentage_component,
                    'startdate_component': form.startdate_component_edit.$viewValue,
                    "emailperson":dataUser.email_person,
                    "id_tcejorpmaster": $scope.selected_entregable.id_masterproject
                }),
                beforeSend: function () {
                    loading();
                },
                success: function (data) {
                    $scope.$apply(() => {
                        $scope.loadComponentsEntregable();
                        $scope.closeModalEditComponent();
                        $scope.getSelectedEntregableProject($scope.project_entregable_component_selected.id_entregable);
                        $('#progress_bar_project_entregable').load();

                        swal.close();
                    });
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.openModalTaskEditProccess = (task_selected) => {
        $scope.entregable_component_task_selected = task_selected;
        $scope.actual_percentage_task_before_edit = $scope.entregable_component_task_selected.actual_percentage_task;
        //alert(component_selected);
        $("#modalTaskEditProccess").modal();
    };

    $scope.closeModalTaskEditProccess = () => {
        $("#modalTaskEditProccess").modal('hide');
    };

    $scope.openModalEditComponent = (component_selected, rol) => {
        $scope.project_entregable_component_selected = component_selected;

        if ($scope.project_entregable_component_selected !== null && $scope.project_entregable_component_selected !== undefined) {
            $scope.name_component_edit = $scope.project_entregable_component_selected.name_component;
            $scope.description_component_edit = $scope.project_entregable_component_selected.description_component;
            $scope.status_component_edit = $scope.project_entregable_component_selected.status_component;
            $scope.base_percentage_component_edit = $scope.project_entregable_component_selected.base_percentage_component;
            $scope.stimateddate_component_edit = new Date($scope.project_entregable_component_selected.stimateddate_component);
            $scope.path_component_edit = $scope.project_entregable_component_selected.base_percentage_component;
            $scope.startdate_component_edit = new Date($scope.project_entregable_component_selected.startdate_component);
            $scope.rolcomponent = rol;
            $("#modalEditComponent").modal();
        }
    };

    $scope.closeModalEditComponent = () => {
        $("#modalEditComponent").modal('hide');
    };

    $scope.updateActualPercentageTask = (form) => {
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + "componentTask/updateComponentTask",
                data: JSON.stringify({
                    'id_task': $scope.entregable_component_task_selected.id_task,
                    'id_component': $scope.entregable_component_task_selected.id_component,
                    'name_task': $scope.entregable_component_task_selected.name_task,
                    'description_task': $scope.entregable_component_task_selected.description_task,
                    'status_task': $scope.entregable_component_task_selected.status_task,
                    'path_task': $scope.entregable_component_task_selected.path_task,
                    'base_percentage_task': $scope.entregable_component_task_selected.base_percentage_task,
                    'actual_percentage_task': form.actual_percentage_task_after_edit.$viewValue,
                    'stimateddate_task': $scope.entregable_component_task_selected.stimateddate_task,
                    'develop_status_task': $scope.entregable_component_task_selected.develop_status_task,
                    "path_master_project": $scope.alldata_selected_project.path_mp,
                    "path_project_entregable": $scope.selected_entregable.path_entregable,
                    'path_component': $scope.project_entregable_component_selected.path_component,
                    'description_update_task': form.description_task_after_edit.$viewValue,
                    'startdate_task': $scope.entregable_component_task_selected.startdate_task,
                    "emailperson":dataUser.email_person,
                    "id_masterproject": $scope.selected_project
                }),
                beforeSend: function () {
                    loading();
                },
                success: function (data) {                    
                    $scope.loadComponentTasks();
                    $scope.closeModalTaskEditProccess();

                    alertAll(data);
                    swal.close();

                    $scope.loadComponentEntregableSelected($scope.project_entregable_component_selected.id_entregable_component);
                    $('#progress_bar_component_task').load();
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error", objXMLHttpRequest);
                }
            });
        }
    };


    $scope.viewTasks = (component_selected,namecomponent) => {
        $scope.namecomponent=namecomponent;
        $scope.tittlereport(3);
        $scope.project_entregable_component_selected = component_selected;
        $scope.idcomponenteSelectedViewTask=component_selected.id_entregable_component;
        $scope.flag_selected_task = true;
        $scope.loadComponentTasks();
    };

    $scope.closeViewTasks = () => {
        $scope.flag_selected_task = false;
    };

    $scope.openEditTaskModal = (taskEdit) => {
        $scope.entregable_component_task_selected = taskEdit;

        $scope.base_percentage_task_edit = $scope.entregable_component_task_selected.base_percentage_task;
        $scope.stimateddate_task_edit = new Date($scope.entregable_component_task_selected.stimateddate_task);
        $scope.path_task_edit = $scope.entregable_component_task_selected.path_task;
        $scope.status_task_edit = $scope.entregable_component_task_selected.status_task;
        $scope.description_task_edit = $scope.entregable_component_task_selected.description_task;
        $scope.name_task_edit = $scope.entregable_component_task_selected.name_task;
        $scope.startdate_task_edit = new Date($scope.entregable_component_task_selected.startdate_task);

        $("#modalUpdateComponentTask").modal();
    };

    $scope.closeEditTaskModal = () => {
        $("#modalUpdateComponentTask").modal('hide');
    };

    $scope.openCreateComponentTask = () => {
        $("#modalCreateTask").modal();
    };

    $scope.closeCreateComponentTask = () => {
        $("#modalCreateTask").modal('hide');
    };

    $scope.newTask = (form) => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (form.$valid) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + "componentTask/insertComponentTask",
                data: JSON.stringify({
                    'id_component': $scope.project_entregable_component_selected.id_entregable_component,
                    'name_task': form.name_task_create.$viewValue,
                    'description_task': form.description_task_create.$viewValue,
                    'status_task': form.status_task_create.$viewValue,
                    'path_task': form.path_task_create.$viewValue,
                    'base_percentage_task': form.base_percentage_task_create.$viewValue,
                    'actual_percentage_task': 100,
                    'stimateddate_task': form.stimateddate_task_create.$viewValue,
                    'develop_status_task': "P",
                    "path_master_project": $scope.alldata_selected_project.path_mp,
                    "path_project_entregable": $scope.selected_entregable.path_entregable,
                    'path_component': $scope.project_entregable_component_selected.path_component,
                    'startdate_task': form.startdate_task.$viewValue,
                    'emailperson':dataUser.email_person,
                    "id_masterproject": $scope.selected_project
                }),
                beforeSend: function () {
                    loading();
                },
                success: function (data) {                    
                    $scope.loadComponentTasks();
                    $scope.closeCreateComponentTask();
                    alertAll(data);
                    swal.close();
                    $scope.loadComponentEntregableSelected($scope.project_entregable_component_selected.id_entregable_component);
                    $('#progress_bar_component_task').load();


                },
                error: function (objXMLHttpRequest) {
                    // console.log("error", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.loadComponentTasks = () => {
        var dataUser = store.session.get("user_tddm4iotbs");        
        if ($scope.selected_component !== undefined && $scope.selected_component !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'componentTask/selectTasks',
                data: JSON.stringify({
                    "id_element": $scope.project_entregable_component_selected.id_entregable_component,
                    "type": 3,
                    "email": dataUser.email_person
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    
                    $scope.$apply(function () {
                        $scope.project_entregable_components_tasks = data.data;
                    });                    
                    
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error: ", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.updateTask = (form) => {        
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + "componentTask/updateComponentTask",
                data: JSON.stringify({
                    'id_task': $scope.entregable_component_task_selected.id_task,
                    'id_component': $scope.entregable_component_task_selected.id_component,
                    'name_task': form.name_task_edit.$viewValue,
                    'description_task': form.description_task_edit.$viewValue,
                    'status_task': form.status_task_edit.$viewValue,
                    'path_task': $scope.entregable_component_task_selected.path_task,
                    'base_percentage_task': form.base_percentage_task_edit.$viewValue,
                    'actual_percentage_task': $scope.entregable_component_task_selected.actual_percentage_task,
                    'stimateddate_task': form.stimateddate_task_edit.$viewValue,
                    'develop_status_task': "P",
                    "path_master_project": $scope.alldata_selected_project.path_mp,
                    "path_project_entregable": $scope.selected_entregable.path_entregable,
                    'path_component': $scope.project_entregable_component_selected.path_component,
                    'startdate_task': form.startdate_task_edit.$viewValue,
                    "emailperson":dataUser.email_person,
                    "id_masterproject": $scope.selected_project
                }),
                beforeSend: function () {
                    loading();
                },
                success: function (data) {                    
                    $scope.loadComponentTasks();
                    $scope.closeEditTaskModal();
                    swal.close();
                    alertAll(data);

                    $scope.loadComponentEntregableSelected($scope.project_entregable_component_selected.id_entregable_component);
                    $('#progress_bar_component_task').load();
                },
                error: function (objXMLHttpRequest) {
                    // console.log("error", objXMLHttpRequest);
                }
            });
        }
    };

    $scope.openModalViewHistoryTask = (task) => {
        $scope.entregable_component_task_selected = task;
        $scope.viewUpdateHistory();

        $("#modalViewHistoryTask").modal();
    };

    $scope.closeModalViewHistoryTask = () => {
        $("#modalViewHistoryTask").modal('hide');
    };

    $scope.viewUpdateHistory = () => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + "componentTask/viewUpdateHistory",
            data: JSON.stringify({
                'id_task': $scope.entregable_component_task_selected.id_task,
                'path_task': $scope.entregable_component_task_selected.path_task,
                "path_master_project": $scope.alldata_selected_project.path_mp,
                "path_project_entregable": $scope.selected_entregable.path_entregable,
                'path_component': $scope.project_entregable_component_selected.path_component
            }),
            beforeSend: function () {
                loading();
            },
            success: function (data) {
                for (let i = 0; i < data.data.dataUpdate.length; i++) {
                    data.data.dataUpdate[i].update_date = data.data.dataUpdate[i].update_date.toString().replaceAll("/", "-");
                }
                $scope.history_update_task = data.data.dataUpdate;
                
                $scope.loadComponentTasks();
                swal.close();
            },
            error: function (objXMLHttpRequest) {
                // console.log("error", objXMLHttpRequest);
            }
        });
    };


    $scope.openModalEntregablesBasePercentage = () => {
        $("#modalEntregablesBasePercentage").modal();
    };

    $scope.closeModalEntregablesBasePercentage = () => {
        $("#modalEntregablesBasePercentage").modal('hide');
    };

    $scope.openModalComponentBasePercentage = () => {
        $("#modalComponentsBasePercentage").modal();
    };

    $scope.closeModalComponentBasePercentage = () => {
        $("#modalComponentsBasePercentage").modal('hide');
    };

    $scope.openModalTaskBasePercentage = () => {

        $("#modalTasksBasePercentage").modal();
    };

    $scope.closeModalTaskBasePercentage = () => {
        $("#modalTasksBasePercentage").modal('hide');
    };


    $scope.getSumBasePercentages = (type) => {
        let totalSum = 0;
        if (type === 1) {
            for (let i = 0; i < $scope.project_entregable.length; i++) {
                totalSum += $scope.project_entregable[i].base_percentage_entregable;
            }
        }
        if (type === 2) {
            for (let i = 0; i < $scope.project_entregable_components.length; i++) {
                totalSum += $scope.project_entregable_components[i].base_percentage_component;
            }
        }
        if (type === 3) {
            for (let i = 0; i < $scope.project_entregable_components_tasks.length; i++) {
                totalSum += $scope.project_entregable_components_tasks[i].base_percentage_task;
            }
        }

        return totalSum;
    };

    $scope.updateBasePercentagesGeneralEntregable = (form) => {
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            myArray = document.getElementsByName("base_percentage_entregable_edit_all");            
            for (let i = 0; i < $scope.project_entregable.length; i++) {
                //alert($scope.project_entregable[i].id_masterproject);
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + 'entregable/updateEntregable',
                    data: JSON.stringify({
                        "idmasterproject": $scope.project_entregable[i].id_masterproject,
                        "id_masterproject": $scope.project_entregable[i].id_masterproject,
                        "id_entregable": $scope.project_entregable[i].id_entregable,
                        "name_entregable": $scope.project_entregable[i].name_entregable,
                        "description_entregable": $scope.project_entregable[i].description_entregable,
                        "status_entregable": $scope.project_entregable[i].status_entregable,
                        "stimateddate_entregable": $scope.project_entregable[i].stimateddate_entregable,
                        "path_entregable": $scope.project_entregable[i].path_entregable,
                        "prioritylevel_entregable": $scope.project_entregable[i].prioritylevel_entregable,
                        "base_percentage_entregable": myArray[i].value,
                        "develop_status_entregable": $scope.project_entregable[i].develop_status_entregable,
                        "actual_percentage_entregable": $scope.project_entregable[i].actual_percentage_entregable,
                        "startdate_entregable": $scope.project_entregable[i].startdate_entregable,
                        "emailperson": dataUser.email_person
                    }),
                    beforeSend: function () {
                        loading();
                    },
                    success: function (data) {
                        $scope.loadEntregablesProject();
                        $scope.closeModalEntregablesBasePercentage();

                        alertAll(data);

                        $scope.selectProjectMaster();
                        $('#progress_bar_master_project').load();
                        swal.close();
                    },
                    error: function (objXMLHttpRequest) {
                        // console.log("error", objXMLHttpRequest);
                    }
                });
            }
        }
    };

    $scope.updateBasePercentagesGeneralComponents = (form) => {
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            myArray = document.getElementsByName("base_percentage_component_edit_all");
            for (let i = 0; i < $scope.project_entregable_components.length; i++) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + "entregableComponents/updateEntregableComponent",
                    data: JSON.stringify({
                        "identregablecomponent": $scope.project_entregable_components[i].id_entregable_component,
                        "id_entregable": $scope.project_entregable_components[i].id_entregable,
                        "name_component": $scope.project_entregable_components[i].name_component,
                        "description_component": $scope.project_entregable_components[i].description_component,
                        "status_component": $scope.project_entregable_components[i].status_component,
                        "stimateddate_component": $scope.project_entregable_components[i].stimateddate_component,
                        "path_component": $scope.project_entregable_components[i].path_component,
                        "base_percentage_component": myArray[i].value,
                        "develop_status_component": $scope.project_entregable_components[i].develop_status_component,
                        "actual_percentage_component": $scope.project_entregable_components[i].actual_percentage_component,
                        "startdate_component": $scope.project_entregable_components[i].startdate_component,
                        "emailperson": dataUser.email_person,
                        "id_tcejorpmaster": $scope.selected_entregable.id_masterproject
                    }),
                    beforeSend: function () {
                        loading();
                    },
                    success: function (data) {                        
                        $scope.loadComponentsEntregable();
                        $scope.closeModalComponentBasePercentage();
                        $scope.loadEntregablesProject();
                        $scope.getSelectedEntregableProject($scope.project_entregable_components[i].id_entregable);
                        swal.close();
                        $('#progress_bar_project_entregable').load();
                    },
                    error: function (objXMLHttpRequest) {
                        // console.log("error", objXMLHttpRequest);
                    }
                });
            }
        }
    };

    $scope.updateBasePercentagesGeneralTasks = (form) => {
        if (form.$valid) {
            var dataUser = store.session.get("user_tddm4iotbs");
            myArray = document.getElementsByName("base_percentage_task_edit_all");
            for (let i = 0; i < $scope.project_entregable_components_tasks.length; i++) {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: urlWebServicies + "componentTask/updateComponentTask",
                    data: JSON.stringify({
                        'id_task': $scope.project_entregable_components_tasks[i].id_task,
                        'id_component': $scope.project_entregable_components_tasks[i].id_component,
                        'name_task': $scope.project_entregable_components_tasks[i].name_task,
                        'description_task': $scope.project_entregable_components_tasks[i].description_task,
                        'status_task': $scope.project_entregable_components_tasks[i].status_task,
                        'path_task': $scope.project_entregable_components_tasks[i].path_task,
                        'base_percentage_task': myArray[i].value,
                        'actual_percentage_task': $scope.project_entregable_components_tasks[i].actual_percentage_task,
                        'stimateddate_task': $scope.project_entregable_components_tasks[i].stimateddate_task,
                        'develop_status_task': $scope.project_entregable_components_tasks[i].develop_status_task,
                        'startdate_task': $scope.project_entregable_components_tasks[i].startdate_task,
                        "path_master_project": $scope.alldata_selected_project.path_mp,
                        "path_project_entregable": $scope.selected_entregable.path_entregable,
                        'path_component': $scope.project_entregable_component_selected.path_component,
                        "emailperson":dataUser.email_person,
                        "id_masterproject": $scope.selected_project
                    }),
                    beforeSend: function () {
                        loading();
                    },
                    success: function (data) {                        
                        $scope.loadComponentTasks();
                        $scope.closeModalTaskBasePercentage();
                        swal.close();                        
                        
                        $scope.loadComponentEntregableSelected($scope.project_entregable_component_selected.id_entregable_component);
                        $('#progress_bar_component_task').load();
                    },
                    error: function (objXMLHttpRequest) {
                        // console.log("error", objXMLHttpRequest);
                    }
                });
            }
        }
    };

    $scope.getDevelopStatus = (letter) => {
        if (letter === 'P') {
            return {data: [{"Status": 'In process', "Class": 'bg-info'}]};
        }
        if (letter === 'R') {
            return {data: [{"Status": 'Delayed', "Class": 'bg-danger'}]};
        }
        if (letter === 'I') {
            return {data: [{"Status": 'In time', "Class": 'bg-warning'}]};
        }
        if (letter === 'F') {
            return {data: [{"Status": 'Finish', "Class": 'bg-success'}]};
        }
        return {data: [{"Status": 'Not founded', "Class": 'bg-danger'}]};
    };

    $scope.checkValidDate = (inputStartDate, inputFinishSDate) => {
        let start = document.getElementById(inputStartDate);
        let endS = document.getElementById(inputFinishSDate);
        endS.min = start.value;
    };


    $scope.openCreateMembers = function (task) {
        $scope.selected_Task = task.id_task;
        $scope.entregable_component_task_selected = task;
        $("#addMembers").modal();
    };

    $scope.closeCreateMembers = function () {
        $("#addMembers").modal('hide');        
    };
    
    $scope.openEditMembers = function (task) {    
         $scope.entregable_component_task_selected = task;
        $("#modalEditMembersTask").modal();
    };

    $scope.closeEditMembers = function () {
        $("#modalEditMembersTask").modal('hide');        
    };

    $scope.updateMembers = (form) =>
    {        
        var dataUser = store.session.get("user_tddm4iotbs");
        if (form.$valid)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + "members/updateMembers",
                data: JSON.stringify({
                    'email_member': form.email_member_edit.$viewValue,
                    'role_member': form.role_member_edit.$viewValue,                    
                    'status_member' : form.status_member_edit.$viewValue,
                    'id_task' : $scope.entregable_component_task_selected.id_task,
                    "emailperson":dataUser.email_person,
                    "idmasterproject": $scope.selected_project
                }),
                error: function (objXMLHttpRequest)
                {
                    
                },
                success: function (data) {
                   alertAll(data);
                   $scope.closeEditMembers();
                }
            });            
        }
    };


    //modalpdf

    $scope.openModalpdf = (type) => {

    };

    $scope.closeModalpdf = () => {
        $("#modalpdf").modal('hide');
    };

    $scope.tittlereport = (select) => {
        $scope.cadena=store.session.get("projectname");
        if (select === 2){
            $scope.cadena+=" - "+$scope.nameentregable;
        }else if (select === 3){
            $scope.cadena+=" - "+$scope.nameentregable+" - "+$scope.namecomponent;
        }
    };


      $scope.viewFile = (select, type,part,nameEntregable) => {        
        $scope.cadena=store.session.get("projectname");
        if (select === 1){
            $("#tituloReport").html("Deliverables");
        }else if (select === 2){
            $("#tituloReport").html("Components");
            $scope.cadena+=" - "+$scope.nameentregable;
        }else if (select === 3){
            $("#tituloReport").html("Tasks");
            $scope.cadena+=" - "+$scope.nameentregable+" - "+$scope.namecomponent;
        }else{
            if(part)
                $("#tituloReport").html("All elements");
            else
                $("#tituloReport").html(nameEntregable);
        }   // alert(urlWebServicies + `reportes/exportarPdf?select=${select}&type=${type}&part=${part}&rutap=${$scope.pathProj}`);
        // console.log($scope.cadena+" este es el reporte");
        $.ajax({
            method: "GET",
            xhrFields: {responseType: "arraybuffer"},
            url: urlWebServicies + `reportes/exportarPdf?select=${select}&type=${type}&part=${part}&rutap=${$scope.pathProj}&cad=${$scope.cadena}`,
            beforeSend: function (xhr) {
                //loading();
            },
            success: function (data) {                
                var blob = new Blob([data], {type: 'application/pdf'});
//                // console.log($scope.trustAsResourceUrl(window.URL.createObjectURL(blob)));
                //  $("#viewFiles").attr("href",window.URL.createObjectURL(blob));
                $("#obj").attr("src", window.URL.createObjectURL(blob));
                $("#modalpdf").modal();
            },
            error: function (objXMLHttpRequest) {
                // console.log("error: ", objXMLHttpRequest);
            }
        });
    };
    
    
     $scope.updateInformationElements = () => {
        var dataUser = store.session.get("user_tddm4iotbs");
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'componentTask/updateAllElements',
            data: JSON.stringify({
                'id_person': dataUser.email_person           
            }),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {               
            },
            error: function (objXMLHttpRequest) {
                // console.log("error: ", objXMLHttpRequest);
            }
        });
    };
    
    $scope.saveMembers = (form) =>
    {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (form.$valid)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + "members/saveMemberss",
                data: JSON.stringify({
                    'email': form.email.$viewValue,
                    'role': form.role.$viewValue,
                    'idTask': $scope.selected_Task,
                    'status': form.status_new_member.$viewValue,
                    "emailperson": dataUser.email_person,
                    "idmasterproject": $scope.selected_project
                }),
                error: function (objXMLHttpRequest)
                {
                    // console.log("error", objXMLHttpRequest);
                },
                success: function (data) {
                    alertAll(data);
                    $scope.shareprojectM(form.email.$viewValue);
                }
            });
            //alert("asssssssssss");
        }
    };


    $scope.shareprojectM=(emailp)=>
    {        
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + "projects/shareProjectMembers",
            data: JSON.stringify({
                'emailShare': emailp,
                'idproj': $scope.selected_project,
                'permit': 'SHARE_WRITER',
                "stateShare": 'WAITING'
            }),
            error: function (objXMLHttpRequest)
            {
                // console.log("error", objXMLHttpRequest);
            },
            success: function (data) {
                // console.log(data);
            }
        });
    };
    
    $scope.typeMembersI = null;
    
    $scope.openModalInformationMembers = (type) => {
        $("#modalInformationMembers").modal();
        
        $scope.typeMembersI = type;
        
        if(type === 'create')
            $scope.closeCreateMembers();
        else
            $scope.closeEditMembers();
    };

    $scope.closeModalInformationMembers = () => {
        $("#modalInformationMembers").modal('hide');        
        if($scope.typeMembersI === 'create')
            $scope.openCreateMembers($scope.entregable_component_task_selected);
        else
            $scope.openEditMembers($scope.entregable_component_task_selected);
    };
    
    $scope.hideButtons = (role) => {
        const valid_roles = ['A', 'F'];        
        if (valid_roles.some(v => role === v)) {
            return true;
        }       
        
        return false;
    };
});

function onChangeBasePercentage(type, showMessage) {
    totalSum = 0;
    let jsonError = {status: 4, information: "The percentages are not valid.", data: "[]"};
    let jsonSuccess = {status: 2, information: "The percentages was updated successfully.", data: "[]"};
    let isCorrect = true;

    if (type === 1) {
        myArray = document.getElementsByName("base_percentage_entregable_edit_all");
        sumElement = document.getElementById("base_percentage_entregable_sum");

        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i].value < 0) {
                myArray[i].value = myArray[i].defaultValue;
            }
        }
        for (let i = 0; i < myArray.length; i++) {
            totalSum += parseInt(myArray[i].value);
        }
        if (totalSum < 0 || totalSum > 100) {
            isCorrect = false;
            totalSum = 0;
            for (let i = 0; i < myArray.length; i++) {
                myArray[i].value = myArray[i].defaultValue;
                totalSum += parseInt(myArray[i].value);
            }
        }

        sumElement.value = totalSum;
    }
    if (type === 2) {
        myArray = document.getElementsByName("base_percentage_component_edit_all");
        sumElement = document.getElementById("base_percentage_component_sum");

        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i].value < 0) {
                myArray[i].value = myArray[i].defaultValue;
            }
        }
        for (let i = 0; i < myArray.length; i++) {
            totalSum += parseInt(myArray[i].value);
        }
        if (totalSum < 0 || totalSum > 100) {
            totalSum = 0;
            isCorrect = false;
            for (let i = 0; i < myArray.length; i++) {
                myArray[i].value = myArray[i].defaultValue;
                totalSum += parseInt(myArray[i].value);
            }
        }
        sumElement.value = totalSum;
    }
    if (type === 3) {
        myArray = document.getElementsByName("base_percentage_task_edit_all");
        sumElement = document.getElementById("base_percentage_task_sum");

        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i].value < 0) {
                myArray[i].value = myArray[i].defaultValue;
            }
        }
        for (let i = 0; i < myArray.length; i++) {
            totalSum += parseInt(myArray[i].value);
        }
        if (totalSum < 0 || totalSum > 100) {
            totalSum = 0;
            isCorrect = false;
            for (let i = 0; i < myArray.length; i++) {
                myArray[i].value = myArray[i].defaultValue;
                totalSum += parseInt(myArray[i].value);
            }
        }
        sumElement.value = totalSum;
    }
    if (showMessage)
        if (isCorrect)
            alertAll(jsonSuccess);
        else
            alertAll(jsonError);
}