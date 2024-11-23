/* global keyGroup, go, myDiagram, urlWebServicies, store, jsonCodeMirror, libraries, variables, setup, loop, loop, methods, swal, angular, app, rutasStorage, Swal */

app.controller("component_controller", function ($scope, $http) {
    $(document).ready(() => {
        angular.element($('[ng-controller="application"]')).scope().changeTittlePage("Component", true);
    });

    let node = [];
    $scope.routeImgComponent = rutasStorage.components;

    $scope.arrayComponentes = [];
    $scope.arrayComponentesAll = [];
    $scope.arrayComponentesEvaluate = [];
    $scope.ports = [];
    $scope.modelComponentload = {};
    $scope.editPort = false;
    $scope.obj_edit_port = {};
    var base64Component = "";
    var canvas;
    $scope.flag_update = false;
    var masDeUnaImage = false;
    var flagAlert;
    $scope.viewMyComponents = true;
    $scope.viewComunityComponents = false;
    $scope.viewDetailsComponent = false;
    $scope.viewTypeListSelected = "0";
    $scope.detailsComponenteSelected = {};
    $scope.viewComponentsProposals = false;

    $(document).ready(() => {
        flagAlert = true;
        loadEditCode();
        $scope.loadComponentsHome();
        initDiagram();
        $("#newComponent").hide();
        initViewDiagram();
        $scope.appPage.Select = "componentsiot";
    });

    $scope.clickViewMyComponents = () => {
        $scope.viewMyComponents = true;
        $scope.viewComunityComponents = false;
        $scope.viewComponentsProposals = false;
    }

    $scope.clickViewComunityComponents = () => {
        $scope.viewMyComponents = false;
        $scope.viewComunityComponents = true;
    }

    $scope.clickViewComponentAdmin = () => {
        $scope.viewComponentsProposals = true;
        $scope.viewMyComponents = false;
    };

    $scope.selectedComponent = (componente, typeList) => {
        // M - my componentes - C - comunity componentes - A - details Admin
        $scope.viewTypeListSelected = typeList;
        // cerramos las 2 listas de modales
        $scope.viewMyComponents = false;
        $scope.viewComunityComponents = false;
        //mostramos los detalles
        $scope.viewDetailsComponent = true;
        // obtenemos los datos del componente
        $scope.detailsComponenteSelected = componente;

        myDiagramView.model = go.Model.fromJson(JSON.stringify($scope.detailsComponenteSelected.data_json.model));

        var modelView = new go.GraphLinksModel();
        modelView.nodeIsGroupProperty = "_isg";
        modelView.nodeGroupKeyProperty = "_g";

        let nodeView = [];
        console.log(location.origin + '/' + $scope.routeImgComponent + $scope.detailsComponenteSelected.pathimg_component +'/component.png');
        nodeView.push({
            key: 1,
            img: location.origin + '/' +$scope.routeImgComponent + $scope.detailsComponenteSelected.pathimg_component +'/component.png',
            loc: "0 0",
            ports: $scope.detailsComponenteSelected.data_json.parameters
        });


        for (var i = 0; i < nodeView.length; i++) {
            var nodedata = nodeView[i];
            nodedata._isg = true;
        }

        modelView.addNodeDataCollection(nodeView);
        modelView.addNodeDataCollection(nodeView[0].ports);
        myDiagramView.model = modelView;

        console.log($scope.detailsComponenteSelected);
    };

    $scope.returnDetailsComponent = () => {
        // cerramos los detalles
        $scope.viewDetailsComponent = false;
        if($scope.viewTypeListSelected === "M"){
            $scope.viewMyComponents = true;
            $scope.viewComunityComponents = false;
        } else if ($scope.viewTypeListSelected === "C"){
            $scope.viewMyComponents = false;
            $scope.viewComunityComponents = true;
        }
        $scope.viewTypeListSelected = "0";
    }

    $scope.loadComponentsHome = () => {
        $scope.loadComponents("ACTIVE");
        $scope.loadComponents("ACTIVE ALL");
        if (($scope.DatoUsuario.type_person === 'R' || $scope.DatoUsuario.type_person === 'A')) {
            $scope.loadComponents("SLEEP");
        }
    };

    $scope.loadComponents = (type) => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'components/getComponents',
                data: JSON.stringify({"user_token": dataUser.user_token, "type": type}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    console.log(data);
                    $scope.$apply(function () {// Se puede optimizar con una sola petición en un ArrayJSON
                        if (type === 'ACTIVE') {
                            $scope.arrayComponentes = data.data;
                        } else if (type === 'ACTIVE ALL') {
                            $scope.arrayComponentesAll = data.data;
                        } else if ((type === 'SLEEP') &&
                                ($scope.DatoUsuario.type_person === 'R' || $scope.DatoUsuario.type_person === 'A')) {
                            $scope.arrayComponentesEvaluate = data.data;
                        }
                    });

                    if (flagAlert) {
                        alertAll(data);
                        flagAlert = false;
                    }

                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "index";
        }
    };

    //funcion para abrir el formulario del nuevo componente
    $scope.openFormNewComponent = () => {
        $("#newComponent").show();
        $("#listComponent").hide();
        //loadEditCode();
        $scope.flag_update = false;
    };

    $("#loadImage").change(() => {
        if (node.length > 0) {
            let data = {
                status: 3,
                information: "Selects a single image for the component."
            };
            alertAll(data);
        } else {
            loadImageComponent();
        }

    });

    loadImageComponent = () => {
        if (!masDeUnaImage) {
            let inputfile = document.getElementById("loadImage");
            let curFile = inputfile.files;
            console.log(curFile[0]);
            let ext = curFile[0].type.toString().split("/")[1];
            console.log(ext);
            if (ext === "png") {

                let rutaImage = window.URL.createObjectURL(curFile[0]);
                getBase64ImgComponent(rutaImage);

                node.push({
                    key: keyGroup,
                    img: rutaImage,
                    loc: "0 0",
                    ports: []
                });

                var model = new go.GraphLinksModel();

                model.nodeIsGroupProperty = "_isg";
                model.nodeGroupKeyProperty = "_g";

                for (var i = 0; i < node.length; i++) {
                    var nodedata = node[i];
                    nodedata._isg = true;
                }
                model.addNodeDataCollection(node);
                myDiagram.model = model;
                masDeUnaImage = true;
            } else {
                let data = {
                    status: 3,
                    information: "The extension chosen is not the correct one, verify that the file is .png."
                };
                alertAll(data);
            }
        }
    };

    getBase64ImgComponent = (rutaImage) => {
        canvas = document.createElement("canvas");
        let img = new Image();
        img.src = rutaImage;
        console.log("width: " + img.width + ", heigth: " + img.height);
        let ctx = canvas.getContext("2d");
        //ctx.clearRect(0, 0, img.width, img.height);
        ctx.clearRect(0, 0, img.width, img.height);
        console.log(img);
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
    };

    $scope.newPort = () => {
        if (node.length > 0) {
            $scope.editPort = false;
            $("#modalNewPort").modal();
        } else {
            let data = {
                status: 3,
                information: "Please insert at least one component image."
            };
            alertAll(data);
        }
    };

    $scope.createPorst = (form) => {
        if (form.$valid) {
            $scope.ports.push({
                "name_port": form.ip_nameport.$viewValue,
                "digital": form.ip_isdigital.$viewValue,
                "analog": form.ip_isanalog.$viewValue,
                "data": form.ip_isdata.$viewValue,
                "loc": "0 0",
                "energy": form.ip_isenergy.$viewValue,
                "min": form.ip_voltmin.$viewValue,
                "max": form.ip_voltmax.$viewValue,
                "_g": keyGroup
            });
            console.log($scope.ports);
            for (var j = 0; j < $scope.ports.length; j++) {
                var portdata = $scope.ports[j];
                portdata.id = j;
            }
            node[0].ports = $scope.ports;
            myDiagram.model.addNodeDataCollection(node[0].ports);
            $("#modalNewPort").modal("hide");
        }
    };

    $scope.selectedPort = (obj_port) => {
        $scope.editPort = true;
        $scope.obj_edit_port = obj_port;
        $("#modalNewPort").modal();
        $scope.$apply(() => {
            $scope.ip_nameport = obj_port.name_port;
            $scope.ip_isdigital = obj_port.digital;
            $scope.ip_isanalog = obj_port.analog;
            $scope.ip_isdata = obj_port.data;
            $scope.ip_isenergy = obj_port.energy;
            $scope.ip_voltmax = obj_port.max;
            $scope.ip_voltmin = obj_port.min;
        });
        console.log(obj_port);
    };

    $scope.selectedPortView = (obj_port) => {
        $scope.editPort = false;
        $("#modalPortView").modal();
        $scope.$apply(() => {
            $scope.ip_nameport_v = obj_port.name_port;
            $scope.ip_isdigital_v = obj_port.digital;
            $scope.ip_isanalog_v = obj_port.analog;
            $scope.ip_isdata_v = obj_port.data;
            $scope.ip_isenergy_v = obj_port.energy;
            $scope.ip_voltmax_v = obj_port.max;
            $scope.ip_voltmin_v = obj_port.min;
        });
        console.log(obj_port);
    };

    $scope.cancelPortView = () => {
        $("#modalPortView").modal("hide");
    }

    $scope.deletePort = (position) => {
        $scope.ports.splice(position, 1);
        console.log($scope.ports);
    };

    $scope.updatePort = (form) => {
        if (form.$valid) {
            $scope.obj_edit_port.name_port = form.ip_nameport.$viewValue;
            $scope.obj_edit_port.digital = form.ip_isdigital.$viewValue;
            $scope.obj_edit_port.analog = form.ip_isanalog.$viewValue;
            $scope.obj_edit_port.data = form.ip_isdata.$viewValue;
            $scope.obj_edit_port.energy = form.ip_isenergy.$viewValue;
            $scope.obj_edit_port.max = form.ip_voltmax.$viewValue;
            $scope.obj_edit_port.min = form.ip_voltmin.$viewValue;

            $scope.editPort = false;
            $("#modalNewPort").modal("hide");
        }
    };

    $scope.cancelNewPort = () => {
        $scope.editPort = $scope.editPort === true ? false : true;
        $("#modalNewPort").modal("hide");
        $scope.ip_nameport = "";
        $scope.ip_isdigital = false;
        $scope.ip_isanalog = false;
        $scope.ip_isdata = false;
        $scope.ip_isenergy = false;
        $scope.ip_voltmax = "";
        $scope.ip_voltmin = "";
    };

    $scope.cancelComponent = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "All data entered will be permanently deleted.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancels all!'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(myDiagram.model.toJson());
                //limpiar el lienzo para editar los puertos del componente
                myDiagram.clear();
                //limpias el vector de puertos
                $scope.ports.length = 0;
                //limpiar el componente donde esta la imagen
                node.length = 0;
                $scope.ip_namecomponent = "";
                $scope.ip_descriptioncomponent = "";
                masDeUnaImage = false;
                reloadCode();
                $("#newComponent").hide();
                $("#listComponent").show();
            }
            ;
        });
    };

    $scope.updateComponent = (id_component) => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            let api_param = {
                user_token: dataUser.user_token,
                id_component: id_component
            };
            $scope.flag_update = true;
            apiUpdateComponent(api_param);
        }
    };

    $scope.stateComponent = (action, id_component) => {
        swal.fire({
            title: 'Are you sure to remove this component?',
            showDenyButton: true,
//                showCancelButton: true,
            confirmButtonText: `Confirm`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                var dataUser = store.session.get("user_tddm4iotbs");
                if (dataUser !== undefined && dataUser !== null) {
                    let api_param = {
                        user_token: dataUser.user_token,
                        id_component: id_component,
                        action: action
                    };
                    $scope.flag_update = true;
                    apiStateComponent(api_param);
                }
            } else if (result.isDenied) {
                swal.fire("Okay ... think better next time");
            }
        });

    };

    apiStateComponent = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'components/stateComponent',
            data: JSON.stringify({...api_param}),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {
                swal.close();
                console.log(data);
                $scope.loadComponentsHome();
            },
            error: function (objXMLHttpRequest) {
                console.log("error: ", objXMLHttpRequest);
            }
        });
    };

    apiUpdateComponent = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'components/getInfoComponent',
            data: JSON.stringify({...api_param}),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {
                swal.close();
                console.log(data);
                $("#newComponent").show();
                $("#listComponent").hide();
                data.data[0].data_json.model.nodeDataArray[0].img =
                        location.origin + "/" + rutasStorage.components + data.data[0].pathimg_component + "/component.png";
                $scope.dataProject = data.data[0];
                $scope.modelComponentload = data.data[0].data_json.model;

                myDiagram.model = go.Model.fromJson(JSON.stringify(data.data[0].data_json.model));

                var model = new go.GraphLinksModel();
                model.nodeIsGroupProperty = "_isg";
                model.nodeGroupKeyProperty = "_g";

                node.push({
                    key: keyGroup,
                    img: $scope.modelComponentload.nodeDataArray[0].img,
                    loc: "0 0",
                    ports: $scope.modelComponentload.nodeDataArray[0].ports
                });

                for (var i = 0; i < node.length; i++) {
                    var nodedata = node[i];
                    nodedata._isg = true;
                }

                model.addNodeDataCollection(node);
                model.addNodeDataCollection(node[0].ports);
                myDiagram.model = model;

                //Datos
                $scope.ports = $scope.modelComponentload.nodeDataArray[0].ports;
                $scope.$apply(() => {
                    $scope.ip_namecomponent = data.data[0].name_component;
                    $scope.ip_descriptioncomponent = data.data[0].description_component;
                });
                libraries.setValue(b64_to_utf8(data.data[0].data_json.code.Libraries));
                variables.setValue(b64_to_utf8(data.data[0].data_json.code.Variables));
                loop.setValue(b64_to_utf8(data.data[0].data_json.code.Loop));
                setup.setValue(b64_to_utf8(data.data[0].data_json.code.Setup));
                methods.setValue(b64_to_utf8(data.data[0].data_json.code.Methods));
                //loadEditCode();
                console.log(data.data[0].name_component);
                alertAll(data);
            },
            error: function (objXMLHttpRequest) {
                console.log("error: ", objXMLHttpRequest);
            }
        });
    };

    $scope.saveComponent = (form) => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            if (form.$valid) {
                let jsonComponent = {
                    "parameters": $scope.ports,
                    "code": getCodeComponent(), //obtener el codigo del componente
                    "model": JSON.parse(myDiagram.model.toJson())
                };
                let api_param = {
                    "user_token": dataUser.user_token,
                    "nameComponent": form.ip_namecomponent.$viewValue,
                    "descriptionComponent": form.ip_descriptioncomponent.$viewValue,
                    "type": form.ip_typecomponent.$viewValue,
                    "base64component": canvas.toDataURL(),
                    "dataPorts": JSON.stringify(jsonComponent)
                };
                console.log(api_param);
                apiSaveComponent(api_param);
                $scope.flag_update = false;
            }
        } else {
            location.href = "index";
        }
    };

    apiSaveComponent = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'components/saveComponent',
            data: JSON.stringify({...api_param}),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {
                swal.close();
                console.log(data);
                //limpiar el lienzo para editar los puertos del componente
                myDiagram.clear();
                //limpias el vector de puertos
                $scope.ports.length = 0;
                //limpiar el componente donde esta la imagen
                node.length = 0;
                $scope.ip_namecomponent = "";
                $scope.ip_descriptioncomponent = "";
                masDeUnaImage = false;
                reloadCode();
                $("#newComponent").hide();
                $("#listComponent").show();
                $scope.loadComponents();
                alertAll(data);
            },
            error: function (objXMLHttpRequest) {
                console.log("error: ", objXMLHttpRequest);
            }
        });
    };

    getCodeComponent = () => {
        jsonCodeMirror.Libraries = b64EncodeUnicode(libraries.getValue());
        jsonCodeMirror.Variables = b64EncodeUnicode(variables.getValue());
        jsonCodeMirror.Loop = b64EncodeUnicode(loop.getValue()); 
        jsonCodeMirror.Setup = b64EncodeUnicode(setup.getValue());
        jsonCodeMirror.Methods = b64EncodeUnicode(methods.getValue());
        return jsonCodeMirror;
    };

    $scope.updateSaveComponente = (form) => {
        var dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            if (form.$valid) {
                let jsonComponent = {
                    "parameters": $scope.ports,
                    "code": getCodeComponent(), //obtener el codigo del componente
                    "model": JSON.parse(myDiagram.model.toJson())
                };
                let api_param = {
                    "user_token": dataUser.user_token,
                    "idComponent": $scope.dataProject.id_component,
                    "nameComponent": form.ip_namecomponent.$viewValue,
                    "descriptionComponent": form.ip_descriptioncomponent.$viewValue,
                    "type": form.ip_typecomponent.$viewValue,
                    "dataPorts": JSON.stringify(jsonComponent),
                    "folderName": $scope.dataProject.pathimg_component
                };
                console.log(api_param);
                apiUpdateSaveComponent(api_param);
                $scope.flag_update = false;
            }
        } else {
            location.href = "index";
        }
    };

    apiUpdateSaveComponent = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'components/updateComponent',
            data: JSON.stringify({...api_param}),
            beforeSend: function (xhr) {
                loading();
            },
            success: function (data) {
                swal.close();
                console.log(data);
                //limpiar el lienzo para editar los puertos del componente
                myDiagram.clear();
                //limpias el vector de puertos
                $scope.ports.length = 0;
                //limpiar el componente donde esta la imagen
                node.length = 0;
                $scope.ip_namecomponent = "";
                $scope.ip_descriptioncomponent = "";
                masDeUnaImage = false;
                reloadCode();
                $("#newComponent").hide();
                $("#listComponent").show();
                $scope.loadComponents();
                $scope.loadComponentsHome();
                alertAll(data);
            },
            error: function (objXMLHttpRequest) {
                console.log("error: ", objXMLHttpRequest);
            }
        });
    };

    $("#name_component").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#component_table tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });

    $("#name_componentAll").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#component_tableAll tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });

    $("#name_componentEvaluate").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#component_tableEvaluate tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
});
