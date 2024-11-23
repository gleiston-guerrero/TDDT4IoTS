/* global angular, Swal, rutasStorage, UMLUseCaseDiagram, UMLClassDiagram, UMLSequenceDiagram, UMLCommunication, UMLGeneralization, UMLExtend, UMLInclude, XMLSerializer, urlWebServicies, swal, JSONE, elementsClass */

app = angular.module('app', []);
controller = app.controller("workAreaController", function ($scope) {

    // expandir el controlador a otro script js
    app.expandControllerA($scope);

    // expandir el controlador al archivo de socket
    app.expandControllerSocket($scope);

    // expandir el controlador al script de maven project
    app.expandControllerMavenProject($scope);
    
    // expandir el controlador al script de angular project
    app.expandControllerAngularProject($scope);

    $scope.DatoUsuario = {};
    $scope.rutaImgUser = location.origin + rutasStorage.imguser;

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $scope.showLS = false;

    // json para almacenar los datos del diagrama de caso de uso
    $scope.jsonUseCase = {
        "useCase": [],
        "actors": [],
        "relations": []
    };
    // vector para controlar los actores que seran agregados automaticamente por los casos de uso
    $scope.actorsUseCase = [];

    // json para el escenario principal y el flujo alternativo de la descripcion del caso de uso
    $scope.manager_maf = {
        "main_stage": [],
        "alternative_flow": []
    };

    // json para el diagrama de clases
    $scope.jsonClass = {};

    //variable para activar la edicion de los objetos
    $scope.flag_update = false;

    //objeto para obtener el objeto que se va a selelccionar
    $scope.object_update = [];

    //posicion de la descripcion del de caso de uso que se va editar
    $scope.encontrado = -1;

    //objeto para editar las acciones de la descripcion de los casos de uos
    $scope.update_action = {};

    //botones para interactuar entre los diagramas
    $scope.diagramsUml = [];

    $scope.btnDiagramUml = [];

    $scope.showTool = "UMLUseCaseDiagram";

    $scope.notifications = [];

    //datos para el diagrama de secuencia
    $scope.secuenceData = {
        package: [],
        secuence: {normal: [], loop: {}, alternative: {condition_if: "", else: "", mr_if: [], mr_else: [], index: ""}}
    };

    $scope.dataProject = {}; // datos del proyecto abierto

    var id_project = "";

    $scope.selectedClass = null;

    //########################## variables de dibujo ###################################

    //########################## variables de dibujo ###################################

    // funcion que se ejecuta al cargar la pagina e inicializa el diagrama de caso de uso
    $(document).ready(function () {
        if (window.location.search !== "") {
            loading();
            let urlParams = new URLSearchParams(window.location.search);
            id_project = urlParams.get('identifiquer');
            $scope.$apply(() => {
                $scope.DatoUsuario = getDataSession();
                $scope.showLS = false;
            });
            $scope.loadDataProject(id_project, $scope.DatoUsuario.user_token);
            initDiagramUml();
            $scope.loadUseCase();
            $scope.loadInterpret();
            $scope.initCode();
            // conectar los usuarios por websocket
            $scope.webSocketInit(id_project);
            // verificar si existe un proyecto maven a descargar
            //$scope.downloadPrjMav();
            //swal.close();
        }
    });

    $scope.loadDataProject = (idProject, user_token) => {
        let dataLoadDataProject = {
            "user_token": user_token,
            "typeSelect": "4",
            "idProject": idProject
        };
        wsLoadDataProject(dataLoadDataProject);
    };

    /**
     * FUNCION PARA CARGAR LOS DATOS DEL PROYECTO
     * */
    let nameProject = "";
    let wsLoadDataProject = (api_param) => {
        let dataUser = store.session.get("user_tddm4iotbs");
        if (dataUser !== undefined && dataUser !== null) {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: urlWebServicies + 'projects/listShareProject',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    ...api_param
                }),
                beforeSend: function (xhr) {
                    //loading();
                },
                success: function (data) {
                    //swal.close();
                    console.log(data);
                    $scope.$apply(() => {
                        $scope.dataProject = data.data[0];
                        nameProject = $scope.dataProject.name_mp;
                    });
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else {
            location.href = "index.html";
        }
    };

    initDiagramUml = () => {
        $.getJSON("resources/js/js-uml/diagramsUml.json", function (data) {
            $scope.$apply(function () {
                $scope.diagramsUml = data;
            });

            for (let posDiagram = 0; posDiagram < $scope.diagramsUml.length; posDiagram++) {
                $scope.$apply(function () {
                    $scope.btnDiagramUml.push({
                        diagram: createDiagram({
                            "width": 100,
                            "height": 81,
                            "id_div": "areaDiagram",
                            "diagram": $scope.diagramsUml[posDiagram].type === "UMLUseCaseDiagram" ? UMLUseCaseDiagram :
                                    $scope.diagramsUml[posDiagram].type === "UMLClassDiagram" ? UMLClassDiagram : undefined,
                            "name": $scope.diagramsUml[posDiagram].name,
                            "interaction": $scope.diagramsUml[posDiagram].interaction,
                            "draw": $scope.diagramsUml[posDiagram].draw
                        }),
                        "name": $scope.diagramsUml[posDiagram].name,
                        "type": $scope.diagramsUml[posDiagram].type,
                        "status": $scope.diagramsUml[posDiagram].status,
                        "btnactive": $scope.diagramsUml[posDiagram].btnactive
                    });
                });
            }

            diagramUseCase = getDiagramUseCase();
            diagramClass = getDiagramClass();
        });
    };

    $scope.changeDiagramA = (new_diagram_open) => {
        let open_current_diagram = {};
        for (let i = 0; i < $scope.btnDiagramUml.length; i++) {
            if ($scope.btnDiagramUml[i].status === "O") {
                open_current_diagram = $scope.btnDiagramUml[i].diagram;
                $scope.btnDiagramUml[i].status = "C";
                $scope.btnDiagramUml[i].btnactive = "btn btn-sm button-dt mr-2 mt-1";
            }
        }
        new_diagram_open.status = "O";
        $scope.showTool = new_diagram_open.type;
        new_diagram_open.btnactive = "btn btn-sm button-active mr-2 mt-1";
        changeDiagram(open_current_diagram, new_diagram_open.diagram);
    };

    getDiagramUseCase = () => {
        for (let i = 0; i < $scope.btnDiagramUml.length; i++) {
            if ($scope.btnDiagramUml[i].type === "UMLUseCaseDiagram") {
                return $scope.btnDiagramUml[i].diagram;
            }
        }
    };

    getDiagramClass = () => {
        for (let i = 0; i < $scope.btnDiagramUml.length; i++) {
            if ($scope.btnDiagramUml[i].type === "UMLClassDiagram") {
                return $scope.btnDiagramUml[i].diagram;
            }
        }
    };

    $scope.loadDiagram = () => {
        $.getJSON("resources/js/js-uml/diagramsUml.json", function (data) {
            $scope.$apply(function () {
                $scope.diagramsUml = data;
                console.log($scope.diagramsUml);
            });
        });
    };

    //funcion para cerrar sesion
    $scope.logOut = () => {
        cerrarSesion();
    };

    /**
     * funcion para crear los valores aleatorios en Y para los objetos de los casos de uso
     * */
    function randomPosition(max, min) {
        return Math.floor(Math.random() * (+max - +min)) + +min;
    }

    /**
     * ###############################################################################################################
     * Inicio Eventos clicks que abren  y cierran los modales para ingresar los datos correspondientes a los objetos
     * del diagrama
     * ###############################################################################################################
     * */

    let areadiagram = document.getElementById("areaDiagram");
    var statusDropEnd = "";
    areadiagram.addEventListener('dragleave', function () {
        switch (statusDropEnd) {
            case "actor":
                $("#modal_actor").modal();
                statusDropEnd = "";
                break;
            case "usecase":
                $scope.actorsUseCase.length = 0;
                statusDropEnd = "";
                $("#modal_usecase").modal();
                break;
            case "newclass":
                statusDropEnd = "";
                $("#modal_newclass").modal();
                break;
        }
    });

    let actor = document.getElementById("btnactor");
    actor.addEventListener('dragstart', function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        statusDropEnd = "actor";
        console.log(statusDropEnd);
    });

    let usecase = document.getElementById("btnusecase");
    usecase.addEventListener('dragstart', function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        statusDropEnd = "usecase";
        console.log(statusDropEnd);
    });

    let newclass = document.getElementById("btnclass");
    newclass.addEventListener('dragstart', function () {

        if (!$scope.editionClasDiagram) {
            alertAll({"status": 3, "information": "You cannot modify the class diagram if editing is disabled."});
            return;
        }

        statusDropEnd = "newclass";
        console.log(statusDropEnd);
    });

    //cerrar actor
    $("#btn_close_actor").click(function () {
        $scope.$apply(function () {
            //determinamos que la accion de editar se establece en false
            $scope.flag_update = false;
        });
        //cerramos el modal del caso de uso
        $("#modal_actor").modal('hide');
    });

    //cerrar caso de uso
    $scope.cancelUseCase = (form) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "All information entered will be permanently deleted",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(() => {
                    //limpiamos los actores que pertenecen al caso de uso
                    $scope.actorsUseCase.length = 0;
                    //limpiamos el escenario principal y el flujo alternativo del caso de uso
                    $scope.manager_maf.main_stage.length = 0;
                    $scope.manager_maf.alternative_flow.length = 0;

                    //determinamos que la accion de editar se establece en false
                    $scope.flag_update = false;
                    clearFormUseCase(form);

                    form.$setPristine();
                    form.$setUntouched();

                    $scope.flag_update = false;
                });
                //cerramos el modal del caso de uso
                $("#modal_usecase").modal('hide');
            }
        });
    };

    $scope.interpret = [];
    $scope.loadInterpret = function () {
//        console.log("buscar el:"+valuex);
        $.getJSON("resources/json/interpret.json", function (data) {
            $scope.$apply(function () {
                $scope.interpret = data;
            });
        });
    };

    $scope.loadExample = (simbol) => {
        console.log(simbol);
        let message = '<div style="font-family: math;font-size: 16px;">' + simbol.example + '<div>';
        Swal.fire({
            title: '<strong>' + simbol.description + ' example <span class="badge badge-info">' + simbol.simbol + '</span> </strong>',
            icon: 'info',
            html: message
        });
    };

    //cerrar edicion de la accion seleciconada
    $("#btn_cancel_update_action").click(function () {
        $("#modal_update_duc").modal('hide');
    });

    $("#Symbols_use_cases").click(function () {
        $("#modal_Symbols").modal();
    });

    $("#btninheritanceactor").click(function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        $("#modal_inheritance_actor").modal();
    });

    $("#btnassociationusecase").click(function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        $("#modal_association_usecase").modal();
    });

    $("#btnasosition").click(function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        $("#modal_association").modal();
    });

    $("#btninclusion").click(function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        $("#modal_inclusion").modal();
    });

    $("#btnextend").click(function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        $("#modal_extend").modal();
    });

    $("#btngeneralization").click(function () {

        if ($scope.editionClasDiagram) {
            alertAll({
                "status": 3,
                "information": "You cannot modify the use case diagram while the class diagram editing is active."
            });
            return;
        }

        $("#modal_generalization").modal();
    });


    /**
     * ###############################################################################################################
     * Fin de Eventos clicks que abren los modales para ingresar los datos correspondientes a los objetos del diagrama
     * ###############################################################################################################
     * */

    /**
     * @function funcion para crear los actores
     * @param {form} form
     * */
    $scope.createActor = function (form, flag) {
        if (form.$valid) {
            if (!$scope.nameEquals(form.actor_name.$viewValue, -1)) {
                let actorobject = createActorTools({
                    "name": form.actor_name.$viewValue,
                    "pos_Y": randomPosition(400, 70)
                });
                $scope.jsonUseCase.actors.push({
                    "obj_actor": actorobject,
                    "name": actorobject.getName()
                });
                $("#modal_actor").modal('hide');
                if (flag)
                    $scope.utilWebSocket("createActor", {"form": JSON.decycle(form)});

                console.log($scope.jsonUseCase.actors);
                console.log($scope.jsonUseCase.actors[0].obj_actor.getName());
            }
        }
    };

    // funcion para crear la herencia entre actores
    $scope.createInHeritanceActor = function (form) {
        if (form.$valid) {
            let relation = {};

            relation = createRelation({
                "type": UMLGeneralization,
                "a": $scope.jsonUseCase.actors[form.selecactor1.$viewValue].obj_actor,
                "b": $scope.jsonUseCase.actors[form.selecactor2.$viewValue].obj_actor
            });

            $scope.jsonUseCase.relations.push({
                "type": "UMLGeneralization",
                "obj_relation": relation
            });

            $("#modal_inheritance_actor").modal("hide");
        } else {
            alert("aguante :v");
        }
    };

    $scope.createAssociationUseCase = function (form) {
        if (form.$valid) {
            let relation = {};

            relation = createRelation({
                "type": UMLCommunication,
                "a": $scope.jsonUseCase.useCase[form.selectusecase1.$viewValue].obj_usecase,
                "b": $scope.jsonUseCase.useCase[form.selectusecase2.$viewValue].obj_usecase
            });

            $scope.jsonUseCase.relations.push({
                "type": "UMLCommunication",
                "obj_relation": relation
            });

            $("#modal_association_usecase").modal("hide");
        } else {
            alert("aguante :v");
        }
    };

    //funcion para editar los actores
    $scope.updateActor = function (form, flag) {
        try {
            if (form.$valid) {
                if ($scope.nameEquals(form.actor_name.$modelValue, -1)) {
                    return;
                }
                $scope.object_update.setName(form.actor_name.$modelValue);

                diagramUseCase.draw();
                $scope.flag_update = false;
                $("#modal_actor").modal('hide');
                if (flag)
                    $scope.utilWebSocket("updateActor", {"form": JSON.decycle(form)});
            }
        } catch (ErrorMessage) {
            console.log(ErrorMessage);
            alertAll({
                "status": 4,
                "information": "[updateActor]: " + ErrorMessage.message
            });
        }
    };

    /**
     * ##############################################################################################################
     * INICIO BLOQUE DE CODIGO PARA LA DESCRIPCION DEL CASO DE USO
     * ##############################################################################################################
     * */

    //funcion para crear los actores dentro de la descripcion de los casos de uso
    $scope.createActorUC = function (flag) {
        try {
            if ($scope.usecase_actorname !== undefined && $scope.usecase_actorname.trim() !== '') {

                if (!$scope.nameEquals($scope.usecase_actorname, -1)) {
                    //crear lista de actores
                    let actorobject = createActorTools({
                        "name": $scope.usecase_actorname,
                        "pos_Y": randomPosition(400, 70)
                    });

                    $scope.actorsUseCase.push({
                        "obj_actor": actorobject,
                        "name": actorobject.getName()
                    });

                    $scope.jsonUseCase.actors.push({
                        "obj_actor": actorobject,
                        "name": actorobject.getName()
                    });

                    if (flag)
                        $scope.utilWebSocket("createActorUC", {"form": $scope.usecase_actorname});

                    $scope.usecase_actorname = "";
                } else {
                    alertAll({"status": 3, "information": "Enter at least one actor's name"});
                }
            }
        } catch (ErrorMessage) {
            console.log(ErrorMessage);
            alertAll({
                "status": 4,
                "information": "[createActorUC]: " + ErrorMessage.message
            });
        }

    };

    $scope.addActorCreated = function (actorobject) {
        $scope.actorsUseCase.push({
            "obj_actor": actorobject,
            "name": actorobject.getName()
        });

    };

    // funcion para crear los casos de uso y reelacionarlo con los actores que desee de forma automatica
    $scope.createUseCaseUC = function (form, flag) {

        try {

            if ($scope.nameEquals(form.usecase_name_i.$modelValue, -1)) {
                return;
            }

            //crear objeto use case
            let usecase = createUseCase({
                "name": form.usecase_name_i.$modelValue,
                "pos_Y": randomPosition(400, 70)
            });

            /**
             * recorre todos los actores que fueron agregados dentro de la descripcion del caso de uso para realizar su
             * respectiva relacion a todos los actores
             **/
            for (let index = 0; index < $scope.actorsUseCase.length; index++) {
                let actorUC = $scope.actorsUseCase[index].obj_actor;
                console.log("ACTOR USE CASE", actorUC);
                let relation = {};
                relation = createRelation({
                    "a": actorUC,
                    "b": usecase,
                    "type": UMLCommunication
                });

                //agrega las relaciones al json de los datos para el diagrama de casos de uso
                $scope.jsonUseCase.relations.push({
                    "type": "UMLCommunication",
                    "obj_relation": relation
                });

                if (!$scope.nameEqualsNoMess(actorUC.getName(), -1)) {
                    //agrega los actores que fueron creados por la descripcion del caso de uso existente
                    $scope.jsonUseCase.actors.push({
                        "obj_actor": actorUC,
                        "name": actorUC.getName()
                    });
                }


            }
            /**
             * Agrega finalmente el objeto del caso de uso y los datos de la descripcion del caso de uso al json de los
             * DATOS del json del diagrama de casos de uso
             **/
            //variable para agregar los diagramas de secuencia por cada caso de uso
            let secuence_diagram = {};

            secuence_diagram = createDiagram({
                "width": 100,
                "height": 81,
                "id_div": "areaDiagram",
                "diagram": UMLSequenceDiagram,
                "name": "Secuence Diagram - " + usecase.getName(),
                "interaction": false,
                "draw": false
            });

            $scope.btnDiagramUml.push({
                diagram: secuence_diagram,
                "name": "Secuence Diagram - " + usecase.getName(),
                "type": "UMLSequenceDiagram",
                "status": "C",
                "btnactive": "btn btn-sm button-dt mr-2 mt-1"
            });

            $scope.jsonUseCase.useCase.push({
                "obj_usecase": usecase,
                "name": form.usecase_name.$modelValue,
                "name_i": usecase.getName(),
                "porpuse": form.usecase_porpuse.$modelValue,
                "porpuse_i": form.usecase_porpuse_i.$modelValue,
                "pre_condition": form.usecase_precondition.$modelValue,
                "pre_condition_i": form.usecase_precondition_i.$modelValue,
                "post_condition": form.usecase_postcondition.$modelValue,
                "post_condition_i": form.usecase_postcondition_i.$modelValue,
                "description_interpret": form.usecase_description_interpret.$modelValue,
                "description_original": form.usecase_description_original.$modelValue,
                "main_stage": Object.assign([], $scope.manager_maf.main_stage),
                "alternative_flow": Object.assign([], $scope.manager_maf.alternative_flow),
                "secuence_diagram": secuence_diagram,
                "secuence_data": {
                    "table_normal_flow": Object.assign([], $scope.table_normal_flow),
                    "table_loop": Object.assign([], $scope.table_loop),
                    "table_alternative_if": Object.assign([], $scope.table_alternative_if),
                    "table_alternative_else": Object.assign([], $scope.table_alternative_else)
                }
            });
            superInterpret();
            if (flag)
                $scope.utilWebSocket("createUseCase", {
                    "form": JSON.decycle(form),
                    "manager_maf": Object.assign({}, $scope.manager_maf),
                    "table_normal_flow": Object.assign([], $scope.table_normal_flow),
                    "table_loop": Object.assign([], $scope.table_loop),
                    "table_alternative_if": Object.assign([], $scope.table_alternative_if),
                    "table_alternative_else": Object.assign([], $scope.table_alternative_else)
                });

            clearFormUseCase(form, flag);
            updateClassDiagram($scope.jsonClass, "C");

            for (ipack = 0; ipack < $scope.jsonClass.diagram.length; ipack++) {
                for (isec = 0; isec < $scope.jsonUseCase.useCase.length; isec++) {
                    let secuence = $scope.jsonUseCase.useCase[isec];
                    if (secuence.name === usecase.getName())
                        updateSecuenceDiagram(secuence.secuence_diagram, secuence.secuence_data);
                }
            }

            //$scope.flag_update = true;
            diagramUseCase.draw();
            //cerramos el modal del caso de uso
            $("#modal_usecase").modal('hide');
            console.log($scope.jsonUseCase);

        } catch (ErrorMessage) {
            console.log(ErrorMessage);
            alertAll({
                "status": 4,
                "information": "[createUseCaseUC]: " + ErrorMessage.message
            });
        }
    };

    $scope.angularSuperInterpret = function () {
        superInterpret();
    };

    $scope.angularUpdateClassDiagram = function () {
        updateClassDiagram($scope.jsonClass, "C");
    };

    //funcion para interpretar la descripcion del caso de uso y sus acciones
    function superInterpret() {
        try {
            $scope.jsonClass.diagram.length = 0; // siempre reiniciar el json de las clases al momento de editar
            $scope.jsonClass.relationships.length = 0; // siempre reiniciar el json de las clases al momento de editar
            let useCase = $scope.jsonUseCase.useCase;
            let minjson = [];
            for (let x = 0; x < useCase.length; x++) {
                let usecase_name = useCase[x].name;
                let description_interpret = useCase[x].description_interpret;
                let usecase_postcondition_i = useCase[x].postcondition;
                let usecase_precondition_i = useCase[x].precondition;
                let usecase_porpuse_i = useCase[x].porpuse;
                minjson = getHackDiagram(usecase_name === undefined ? "" : usecase_name);
                //$scope.notifications.push(minjson)
                console.log("NOTIFICACIONES !! - " + minjson);

                mergeClassDiagram($scope.jsonClass, minjson[1]);
                minjson = getHackDiagram(usecase_porpuse_i === undefined ? "" : usecase_porpuse_i);
                mergeClassDiagram($scope.jsonClass, minjson[1]);
                minjson = getHackDiagram(usecase_precondition_i === undefined ? "" : usecase_precondition_i);
                mergeClassDiagram($scope.jsonClass, minjson[1]);
                minjson = getHackDiagram(usecase_postcondition_i === undefined ? "" : usecase_postcondition_i);
                mergeClassDiagram($scope.jsonClass, minjson[1]);
                minjson = getHackDiagram(description_interpret == undefined ? "" : description_interpret);
                mergeClassDiagram($scope.jsonClass, minjson[1]);
                for (let y = 0; y < useCase[x].main_stage.length; y++) {
                    // action_original
                    let action_original = useCase[x].main_stage[y].action_original;
                    minjson = getHackDiagram(action_original);
                    mergeClassDiagram($scope.jsonClass, minjson[1]);
                }

                for (let z = 0; z < useCase[x].alternative_flow.length; z++) {
                    // action_original
                    let action_original = useCase[x].alternative_flow[z].action_original;
                    minjson = getHackDiagram(action_original);
                    mergeClassDiagram($scope.jsonClass, minjson[1]);
                }
            }

            if ($scope.jsonClass.diagram.length > 0) {
                // agregar ls fk a las tablas relacionadas
                $scope.addForeingKey($scope.jsonClass.diagram[0].class, $scope.jsonClass.relationships);
            }

            console.log($scope.jsonClass);

        } catch (ErrorMessage) {
            console.log(ErrorMessage);
            alertAll({
                "status": 4,
                "information": "[superInterpret]: " + ErrorMessage.message
            });
        }
    }

    $scope.addForeingKey = (arrayClass, arrayRelations) => {
        for (let positionRel = 0; positionRel < arrayRelations.length; positionRel++) {

            let rel = arrayRelations[positionRel];

            if (rel !== undefined) {

                let nameClassFrom = rel.from === undefined ? "" : rel.from;
                let nameClassTo = rel.to === undefined ? "" : rel.to;
                let from_fk = rel.from_fk === undefined ? "" : rel.from_fk;
                let to_fk = rel.to_fk === undefined ? "" : rel.to_fk;
                let simbol = rel.simbol === undefined ? "" : rel.simbol;
                let type = "fk";

                if (simbol === "->") {
                    type = "enumeration";
                }
                for (let positionClass = 0; positionClass < arrayClass.length; positionClass++) {
                    if (arrayClass[positionClass].modifiers === "") {
                        let objectClass = arrayClass[positionClass];
                        if (objectClass.className === nameClassFrom) {
                            objectClass.attributes.push({
                                name: from_fk,
                                type: type,
                                visibility: "private",
                                cardinalidate: arrayRelations[positionRel].cardinalidate,
                                idToOrFrom: $scope.getIdClass(arrayRelations[positionRel].to)
                            });
                        } else if (objectClass.className === nameClassTo) {
                            let cardinalidate = arrayRelations[positionRel].cardinalidate;
                            let cardSplit = cardinalidate.toString().split("..");

                            objectClass.attributes.push({
                                name: to_fk,
                                type: type,
                                visibility: "private",
                                cardinalidate: cardSplit[1] + ".." + cardSplit[0],
                                idToOrFrom: $scope.getIdClass(arrayRelations[positionRel].from)
                            }
                            );
                        }
                    }
                }
            }
        }
    };

    // obtener el id de una clase
    $scope.getIdClass = (nameClass) => {
        let varReturn = "-1";
        if ($scope.jsonClass.diagram[0].class.length > 0) {
            for (let i = 0; i < $scope.jsonClass.diagram[0].class.length; i++) {
                classObject = $scope.jsonClass.diagram[0].class[i];
                if (classObject.className === nameClass) {

                    // pregunto si se encuentra al menos un atributo de la clase
                    if (classObject.attributes[0] === undefined) {
                        if (classObject.modifiers === "") {
                            classObject.attributes.push({name: "id", type: "Int", visibility: "private"});
                            varReturn = classObject.attributes[0].name;
                        }

                    } else {
                        // procedo a retornar la posicion 0 que es el id de la clase
                        varReturn = classObject.attributes[0].name;
                    }
                }
            }
        }
        return varReturn;
    };

    //funcion para editar los casos de uso
    $scope.updateUseCase = function (form, flag) {

        try {

            if ($scope.nameEquals(form.usecase_name_i.$modelValue, $scope.encontrado)) {
                return;
            }

            //asignamos el nuevo nombre del caso de uso
            $scope.object_update.setName(form.usecase_name_i.$modelValue);
            diagramUseCase.draw();
            //asignamos los nuevos datos al casos de uso
            $scope.jsonUseCase.useCase[$scope.encontrado].name = form.usecase_name.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].name_i = form.usecase_name_i.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].porpuse = form.usecase_porpuse.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].porpuse_i = form.usecase_porpuse_i.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].pre_condition = form.usecase_precondition.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].precondition_i = form.usecase_precondition_i.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].post_condition = form.usecase_postcondition.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].post_condition_i = form.usecase_postcondition_i.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].description_interpret = form.usecase_description_interpret.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].description_original = form.usecase_description_original.$modelValue;
            $scope.btnDiagramUml[$scope.encontrado + 2].name = "Secuence Diagram - " + form.usecase_name_i.$modelValue;
            $scope.jsonUseCase.useCase[$scope.encontrado].secuence_diagram.setName("Secuence Diagram - " + form.usecase_name_i.$modelValue);

            //preguntaremos si se agregaron nuevos actores dentro del caso de uso
            let relations_usecase = $scope.object_update.getRelations(); // sacamos las relaciones del caso de uso
            let index_Y = 0, index_actor_relation = 0;
            console.log(relations_usecase);
            if (relations_usecase.length > 0) {
                for (let index_X = 0; index_X < $scope.actorsUseCase.length;
                        index_Y === relations_usecase.length ? index_X++ : index_X) {
                    for (index_Y = 0; index_Y < relations_usecase.length; index_Y++) {
                        //pregunto si este actor no se encuentra en las relaciones de este caso de uso
                        if ($scope.actorsUseCase[index_X].obj_actor.getName() !==
                                relations_usecase[index_Y]._elemA.getName()) {
                            index_actor_relation++;
                        }

                        if (index_actor_relation === relations_usecase.length) {
                            let relation = createRelation({
                                "a": $scope.actorsUseCase[index_X].obj_actor,
                                "b": $scope.object_update,
                                "type": UMLCommunication
                            });

                            //agrega las relaciones al json de los datos para el diagrama de casos de uso
                            $scope.jsonUseCase.relations.push({
                                "obj_relation": relation
                            });

                            if (!$scope.nameEqualsNoMess($scope.actorsUseCase[index_X].obj_actor.getName(), -1)) {
                                //agrega los actores que fueron creados por la descripcion del caso de uso existente
                                $scope.jsonUseCase.actors.push({
                                    "obj_actor": $scope.actorsUseCase[index_X].obj_actor
                                });
                            }
                            index_actor_relation = 0;
                        }
                    }
                    index_actor_relation = 0;
                }
            } else {
                for (let index_X = 0; index_X < $scope.actorsUseCase.length; index_X++) {
                    let relation = createRelation({
                        "a": $scope.actorsUseCase[index_X].obj_actor,
                        "b": $scope.object_update,
                        "type": UMLCommunication
                    });

                    //agrega las relaciones al json de los datos para el diagrama de casos de uso
                    $scope.jsonUseCase.relations.push({
                        "obj_relation": relation
                    });

                    if (!$scope.nameEqualsNoMess($scope.actorsUseCase[index_X].obj_actor.getName(), -1)) {
                        //agrega los actores que fueron creados por la descripcion del caso de uso existente
                        $scope.jsonUseCase.actors.push({
                            "obj_actor": $scope.actorsUseCase[index_X].obj_actor
                        });
                    }
                }
            }

            $scope.jsonUseCase.useCase[$scope.encontrado].main_stage =
                    Object.assign([], $scope.manager_maf.main_stage);
            $scope.jsonUseCase.useCase[$scope.encontrado].alternative_flow =
                    Object.assign([], $scope.manager_maf.alternative_flow);

            $scope.jsonUseCase.useCase[$scope.encontrado].secuence_data.table_normal_flow =
                    Object.assign([], $scope.table_normal_flow);
            $scope.jsonUseCase.useCase[$scope.encontrado].secuence_data.table_loop =
                    Object.assign([], $scope.table_loop);
            $scope.jsonUseCase.useCase[$scope.encontrado].secuence_data.table_alternative_if =
                    Object.assign([], $scope.table_alternative_if);
            $scope.jsonUseCase.useCase[$scope.encontrado].secuence_data.table_alternative_else =
                    Object.assign([], $scope.table_alternative_else);

            $scope.flag_update = false;
            superInterpret();

            if (flag)
                $scope.utilWebSocket("updateUseCase", {
                    "form": JSON.decycle(form),
                    "encontrado": $scope.encontrado,
                    "main_stage": Object.assign([], $scope.jsonUseCase.useCase[$scope.encontrado].main_stage),
                    "alternative_flow": Object.assign([], $scope.jsonUseCase.useCase[$scope.encontrado].alternative_flow),
                    "table_normal_flow": Object.assign([], $scope.jsonUseCase.useCase[$scope.encontrado].table_normal_flow),
                    "table_loop": Object.assign([], $scope.jsonUseCase.useCase[$scope.encontrado].table_loop),
                    "table_alternative_if": Object.assign([], $scope.jsonUseCase.useCase[$scope.encontrado].table_alternative_if),
                    "table_alternative_else": Object.assign([], $scope.jsonUseCase.useCase[$scope.encontrado].table_alternative_else)
                });

            clearFormUseCase(form, flag);
            updateClassDiagram($scope.jsonClass, "U");
            for (ipack = 0; ipack < $scope.jsonClass.diagram.length; ipack++) {
                for (isec = 0; isec < $scope.jsonUseCase.useCase.length; isec++) {
                    let secuence = $scope.jsonUseCase.useCase[isec];
                    if (secuence.name === form.usecase_name_i.$modelValue)
                        updateSecuenceDiagram(secuence.secuence_diagram, secuence.secuence_data);
                }
            }
            diagramUseCase.draw();
            //cerramos el modal del caso de uso
            $("#modal_usecase").modal('hide');
        } catch (ErrorMessage) {
            console.log(ErrorMessage);
            alertAll({
                "status": 4,
                "information": "[updateUseCase]: " + ErrorMessage.message
            });
        }

    };

    //funcion para limpiar el formuario de caso de uso
    function clearFormUseCase(form, flag) {
        //$scope.$apply(() => {
        //limpiar formulario
        $scope.usecase_name_i = "";
        $scope.usecase_name = "";
        $scope.usecase_porpuse = "";
        $scope.usecase_porpuse_i = "";
        $scope.usecase_precondition = "";
        $scope.usecase_precondition_i = "";
        $scope.usecase_postcondition = "";
        $scope.usecase_postcondition_i = "";
        $scope.usecase_description_interpret = "";
        $scope.usecase_description_original = "";

        //});

        if (flag) {
            if (form !== undefined) {
                form.$setPristine();
                form.$setUntouched();
            }
        }

        //limpiamos mi variable auxiliar
        $scope.actorsUseCase.length = 0;
        $scope.manager_maf.main_stage.length = 0;
        $scope.manager_maf.alternative_flow.length = 0;

        $scope.table_normal_flow.length = 0;
        $scope.table_loop.length = 0;
        $scope.table_alternative_if.length = 0;
        $scope.table_alternative_else.length = 0;
        $scope.index_secuence = 0;
        $scope.step = 0;
        // });s
    }

    //funcion para interpretar la descripcion general del caso de uso
    $scope.interpretUseCaseDescription = function (flag, scope_usecase, scope_original) {
        let minjson = getHackDiagram(scope_usecase.$modelValue);
        console.log(minjson);
        switch (scope_original) {
            case "usecase_description_original" :
                $scope.usecase_description_original = minjson[0];
                break;
            case "usecase_postcondition_i":
                $scope.usecase_postcondition_i = minjson[0];
                break;
            case "usecase_precondition_i":
                $scope.usecase_precondition_i = minjson[0];
                break;
            case "usecase_porpuse_i":
                $scope.usecase_porpuse_i = minjson[0];
                break;
            case "usecase_name_i":
                $scope.usecase_name_i = minjson[0];
                break;
        }
        //scope_original.$modelValue = minjson[0];
        mergeClassDiagram($scope.jsonClass, minjson[1]);
        $scope.updateSecuence($scope.jsonClass);
        if (flag)
            $scope.utilWebSocket("interpretUseCaseDescription", {"form": scope_usecase.$modelValue});
        console.log($scope.jsonClass);
        alertAll({
            "status": 2,
            "information": "Text interpreted successfully."
        });
    };

    //funcion para interpretar la accion a editar
    $scope.interpretUseCaseAction = function () {
        let minjson = getHackDiagram($scope.action_original);
        console.log(minjson);
        mergeClassDiagram($scope.jsonClass, minjson[1]);
        $scope.updateSecuence($scope.jsonClass);
        $scope.action_interpret = minjson[0];
        alertAll({
            "status": 2,
            "information": "Text interpreted successfully."
        });
    };

    //funcion para agregar el escenario principal del caso de uso
    $scope.mainStage = function (form) {
        let minjson = getHackDiagram(form.action_ms.$viewValue);
        console.log(minjson);
        mergeClassDiagram($scope.jsonClass, minjson[1]);
        $scope.updateSecuence($scope.jsonClass);
        $scope.manager_maf.main_stage.push({
            "actor": form.actor_ms.$viewValue,
            "action_interpret": minjson[0],
            /*"action_interpret": $scope.manager_maf.main_stage.length > 0 && form.check_final_step.$viewValue === false ? minjson[0] :
             form.check_final_step.$viewValue === true ? 'This use case ends when ' + minjson[0] :
             form.check_final_step.$viewValue === false ? 'This use case starts when ' + minjson[0] :
             minjson[0]*/
            "action_original": form.action_ms.$viewValue
        });

        //limpiar form
        $scope.actor_ms = "";
        $scope.action_ms = "";
        $scope.check_final_step = false;
        form.$setPristine();
        form.$setUntouched();

        console.log(form.check_final_step.$viewValue);
        console.log($scope.jsonClass);
    };

    //funcion para eliminar una accion del escenario principal
    $scope.removeActionMS = function (index, fluje) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (fluje === 'M') {
                    $scope.$apply(function () {
                        $scope.manager_maf.main_stage.splice(index, 1);
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.manager_maf.alternative_flow.splice(index, 1);
                    });
                }
            }
        });
    };

    //funcion para eliminar un actor dentro de la descripcion del caso de uso con sus respectivas acciones
    $scope.removeActorUC = function (obj, positionActor) {
        Swal.fire({
            title: 'Are you sure?',
            text: "All data entered will be permanently deleted.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deletes all!'
        }).then((result) => {
            if (result.isConfirmed) {
                let elem = diagramUseCase.getElementByPoint(obj.obj_actor.getX(), obj.obj_actor.getY());
                diagramUseCase.delElement(elem);
                diagramUseCase.draw();
                console.log(positionActor);
                let lengthMainStage = $scope.manager_maf.main_stage.length;
                if (lengthMainStage > 0) {
                    for (let indexX = (lengthMainStage - 1); indexX > -1; indexX--) {
                        if ($scope.manager_maf.main_stage[indexX].actor === obj.obj_actor.getName()) {
                            $scope.$apply(() => {
                                $scope.manager_maf.main_stage.splice(indexX, 1);
                            });
                        }
                    }
                    $scope.$apply(() => {
                        let positionObj = searchPositionEqualsObject($scope.jsonUseCase.actors, "name", $scope.actorsUseCase[positionActor].name);
                        if (positionObj[0]) {
                            $scope.jsonUseCase.actors.splice(positionObj[1], 1);
                            $scope.actorsUseCase.splice(positionActor, 1);
                        }
                    });
                    alertAll({
                        "status": 2,
                        "information": "Actor successfully eliminated, shares belonging to the actor were also eliminated."
                    });
                } else {
                    $scope.$apply(() => {
                        let positionObj = searchPositionEqualsObject($scope.jsonUseCase.actors, "name", $scope.actorsUseCase[positionActor].name);
                        if (positionObj[0]) {
                            $scope.jsonUseCase.actors.splice(positionObj[1], 1);
                            $scope.actorsUseCase.splice(positionActor, 1);
                        }
                    });
                    alertAll({
                        "status": 2,
                        "information": "Actor successfully eliminated, shares belonging to the actor were also eliminated."
                    });
                }
            }
        });
    };

    
    /**
     * funcion para abrir el modal y editar la acciono
     * @param {obj} obj
     * @param {fluje} fluje 
     * 
     * @version 1.0.1 - 22-07-2023
     * */
    $scope.openModalUpdateAction = function (obj, fluje) {
        $("#modal_update_duc").modal();
        $scope.update_action = obj;
        console.log("$scope.manager_maf.main_stage", $scope.manager_maf.main_stage);
        console.log($scope.manager_maf.main_stage.indexOf(obj));
        if (fluje === 'M') {
            $scope.action_interpret = $scope.update_action.action_interpret;
            $scope.action_original = $scope.update_action.action_original;
            $scope.actor = $scope.update_action.actor;
            $scope.position = $scope.manager_maf.main_stage.indexOf(obj);
            $scope.positionActual = $scope.manager_maf.main_stage.indexOf(obj) + 1;
            console.log($scope.position);
            console.log($scope.update_action);
        } else {
            $scope.action_interpret = $scope.update_action.action_interpret;
            $scope.action_original = $scope.update_action.action_original;
            $scope.actor = $scope.update_action.actor;
            $scope.position = $scope.manager_maf.main_stage.indexOf(obj);
            $scope.positionActual = $scope.manager_maf.main_stage.indexOf(obj) + 1;
            console.log($scope.update_action);
        }
    };
    
    /**
     * funcion para editar las acciones del flujo normal de eventos
     * */ 

    //funcion para actualizar los datos de la accion editada
    $scope.updateActionMSFA = function (form) {
        if (form.$valid) {
            $scope.update_action.action_interpret = form.action_interpret.$viewValue;
            $scope.update_action.action_original = form.action_original.$viewValue;
            $scope.update_action.actor = form.actor.$viewValue;
            
            let objectActual =  $scope.manager_maf.main_stage.splice($scope.positionActual - 1, 1)[0];
            $scope.manager_maf.main_stage.splice($scope.position, 0, objectActual);
            
            // buscar la posicion a donde se va cambiar los datos
            /*let objetoCambiarPosicion =  $scope.manager_maf.main_stage[$scope.position];
            let objectActual = $scope.update_action;*/
            
            /*objectActual.action_interpret = objetoCambiarPosicion.action_interpret;
            objectActual.action_original = objetoCambiarPosicion.action_original;
            objectActual.actor = objetoCambiarPosicion.actor;
            
            $scope.manager_maf.main_stage[$scope.position].action_interpret = form.action_interpret.$viewValue;
            $scope.manager_maf.main_stage[$scope.position].action_original = form.action_original.$viewValue;
            $scope.manager_maf.main_stage[$scope.position].actor = form.actor.$viewValue;
            */
            $("#modal_update_duc").modal('hide');
        }
    };

    //funcion para agregar el flujo alternativo del caso de uso
    $scope.flowAlternate = function (form) {
        let minjson = getHackDiagram(form.action_fa.$viewValue);
        console.log(minjson);
        mergeClassDiagram($scope.jsonClass, minjson[1]);
        $scope.updateSecuence($scope.jsonClass);
        $scope.manager_maf.alternative_flow.push({
            "he_passed": form.alternate_flow_begins.$viewValue,
            "action_interpret": minjson[0] + '(return to step ' + form.return_step.$viewValue + ')',
            "action_original": form.action_fa.$viewValue,
            "return": form.return_step.$viewValue
        });
        $scope.alternate_flow_begins = "";
        $scope.return_step = "";
        $scope.action_fa = "";
        form.$setPristine();
        form.$setUntouched();
        console.log($scope.jsonClass);
    };

    //funcion para agregar las clases y metodos para generar el diagrama de clases
    $scope.updateSecuence = (jsonClass) => {
        if (jsonClass.diagram === undefined) {
            return;
        }
        if (jsonClass.diagram.length > 0) {
            $scope.secuenceData.package.length = 0;
            for (let ipackage = 0; ipackage < jsonClass.diagram.length; ipackage++) {
                let package = jsonClass.diagram[ipackage];
                $scope.secuenceData.package.push({packagename: package.packName, objects: []});
                //buscamos las clases
                for (let iclass = 0; iclass < package.class.length; iclass++) {
                    let classdiagram = package.class[iclass];
                    $scope.secuenceData.package[ipackage].objects.push({
                        objectname: classdiagram.className.toString().toLowerCase() + ":" + classdiagram.className,
                        methods: []
                    });
                    for (let imethods = 0; imethods < classdiagram.methods.length; imethods++) {
                        let methods = classdiagram.methods[imethods];
                        $scope.secuenceData.package[ipackage].objects[iclass]
                                .methods.push({methodname: methods.name + "(" + getParamethersSecuence(methods.parameters) + ")"});
                    }
                }
            }
        }
    };

    getParamethersSecuence = (parameters) => {
        let rparam = "";
        if (parameters.length > 0) {
            for (let i = 0; i < parameters.length; i++) {
                if (i === parameters.length - 1) {
                    rparam += parameters[i].name;
                } else {
                    rparam += parameters[i].name + ",";
                }
            }
        }
        return rparam;
    };

    /**
     * ###############################################################################################
     * DIAGRAMA DE SECUENCIA
     * ###############################################################################################
     * */

    $scope.table_normal_flow = [];
    $scope.table_loop = [];
    $scope.table_alternative_if = [];
    $scope.table_alternative_else = [];
    $scope.index_secuence = 0;
    $scope.step = 0;

    $scope.addNormalFlow = (form) => {
        if (form.$valid) {
            $scope.step = $scope.step + 1;
            // $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object2].methods[form.nf_objectmethods1.$modelValue].methodname
            $scope.table_normal_flow.push({
                from: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].objectname,
                to: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object2].objectname,
                message: $scope.step.toString() + ")" + form.nf_objectmethods1.$modelValue === undefined || form.nf_objectmethods1.$modelValue === null ? form.nf_objectmethods2x.$modelValue : form.nf_objectmethods1.$modelValue,
                message_type: form.mnf_message.$modelValue,
                response: form.nf_objectresponse2.$modelValue === undefined || form.mnf_message.$modelValue === "async_message" ? "" : form.nf_objectresponse2.$modelValue,
                response_type: form.rnf_response.$modelValue === undefined || form.mnf_message.$modelValue === "async_message" ? "" : form.rnf_response.$modelValue,
                index: $scope.index_secuence = ($scope.index_secuence + 1)
            });

            $scope.nf_objectmethods1 = null;
            $scope.nf_objectmethods2 = "";
            $scope.mnf_message = "";
            $scope.rnf_response = "";
            form.$setPristine();
            form.$setUntouched();

            console.log("SECUENCIA FLUJO NORMAL", $scope.table_normal_flow);
            $scope.secuenceData.secuence.normal.push($scope.table_normal_flow);
        }
    };

    $scope.addLoop = (form) => {
        if (form.$valid) {
            $scope.step = $scope.step + 1;
            $scope.table_loop.push({
                from: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].objectname,
                to: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object2].objectname,
                message: $scope.step.toString() + ")" + $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].methods[form.slip_objectmethods1.$modelValue].methodname,
                message_type: form.msl_message.$modelValue,
                response: form.loop_objectmethods2.$modelValue === undefined || form.msl_message.$modelValue === "async_message" ? "" : form.loop_objectmethods2.$modelValue,
                response_type: form.rsl_response.$modelValue === undefined || form.msl_message.$modelValue === "async_message" ? "" : form.rsl_response.$modelValue
            });

            $scope.slip_objectmethods1 = "";
            $scope.msl_message = null;
            $scope.loop_objectmethods2 = "";
            $scope.rsl_response = null;

            console.log("LOOP", $scope.table_loop);
            $scope.secuenceData.secuence.loop = {
                condition: form.slip_condition.$modelValue,
                mr: $scope.table_loop,
                index: $scope.index_secuence++
            };
        }
    };

    $scope.addAlternativeIf = (form) => {
        if (form.$valid) {
            $scope.step = $scope.step + 1;
            $scope.table_alternative_if.push({
                from: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].objectname,
                to: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object2].objectname,
                message: $scope.step.toString() + ")" + $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].methods[form.scif_objectmethods1.$modelValue].methodname,
                message_type: form.smcif_message.$modelValue,
                response: form.scif_objectmethods2.$modelValue === undefined ? "" : form.scif_objectmethods2.$modelValue,
                response_type: form.srcif_response.$modelValue === undefined ? "" : form.srcif_response.$modelValue
            });
            console.log("ALTERNATIVE IF", $scope.table_alternative_if);
            $scope.secuenceData.secuence.alternative.condition_if = form.ipscif_condition_if.$modelValue;
            $scope.secuenceData.secuence.alternative.mr_if = $scope.table_alternative_if;
            $scope.secuenceData.secuence.alternative.index = $scope.index_secuence++;
        }
    };

    $scope.addAlternativeElse = (form) => {
        if (form.$valid) {
            $scope.step = $scope.step + 1;
            $scope.table_alternative_else.push({
                from: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].objectname,
                to: $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object2].objectname,
                message: $scope.step.toString() + ")" + $scope.secuenceData.package[$scope.s_package].objects[$scope.s_object1].methods[form.celse_objectmethods1.$modelValue].methodname,
                message_type: form.smcelse_message.$modelValue,
                response: form.celse_objectmethods2.$modelValue === undefined ? "" : form.celse_objectmethods2.$modelValue,
                response_type: form.smcelse_response.$modelValue === undefined ? "" : form.smcelse_response.$modelValue
            });
            console.log("ALTERNATIVE IF", $scope.table_alternative_else);
            $scope.secuenceData.secuence.alternative.else = form.ipscelse_condition_else.$modelValue;
            $scope.secuenceData.secuence.alternative.mr_else = $scope.table_alternative_else;

            console.log("JSON DIAGRAMA DE SECUENCIA", $scope.secuenceData.secuence);
        }
    };

    $scope.changeSM = () => {
        $scope.rsl_response = null;
    };

    /**
     * ##############################################################################################################
     * FIN BLOQUE DE CODIGO PARA LA DESCRIPCION DEL CASO DE USO
     * ##############################################################################################################
     * */

    /**
     * ##############################################################################################################
     * INICIO RELACIONES
     * ##############################################################################################################
     * */

    // funcion para crear la relacion de inclusion de los casos de uso
    $scope.createInclusion = function (form) {
        if (form.$valid) {
            let relation = {};
            relation = createRelation({
                "type": UMLInclude,
                "a": $scope.jsonUseCase.useCase[form.selectusecase1.$viewValue].obj_usecase,
                "b": $scope.jsonUseCase.useCase[form.selectusecase2.$viewValue].obj_usecase
            });
            $scope.jsonUseCase.relations.push({
                "type": "UMLInclude",
                "obj_relation": relation
            });
            $("#modal_inclusion").modal("hide");
        } else {
            alert("aguante :v");
        }
    };

    // funcion para crear la relacion de extension de los casos de uso
    $scope.createExtend = function (form) {
        if (form.$valid) {
            let relation = {};
            relation = createRelation({
                "type": UMLExtend,
                "a": $scope.jsonUseCase.useCase[form.selectusecase1.$viewValue].obj_usecase,
                "b": $scope.jsonUseCase.useCase[form.selectusecase2.$viewValue].obj_usecase
            });
            $scope.jsonUseCase.relations.push({
                "type": "UMLExtend",
                "obj_relation": relation
            });
            $("#modal_extend").modal("hide");
        } else {
            alert("aguante :v");
        }
    };

    // funcion para crear la relacion de generalizacion de los casos de uso
    $scope.createGeneralization = function (form) {
        if (form.$valid) {
            let relation = {};
            relation = createRelation({
                "type": UMLGeneralization,
                "a": $scope.jsonUseCase.useCase[form.selectusecase1.$viewValue].obj_usecase,
                "b": $scope.jsonUseCase.useCase[form.selectusecase2.$viewValue].obj_usecase
            });
            $scope.jsonUseCase.relations.push({
                "type": "UMLGeneralization",
                "obj_relation": relation
            });
            $("#modal_generalization").modal("hide");
        } else {
            alert("aguante :v");
        }
    };

    // funcion para crear la relacion de asociacion de los casos de uso
    $scope.createAssociation = function (form) {
        if (form.$valid) {
            let relation = {};
            relation = createRelation({
                "type": UMLCommunication,
                "a": $scope.jsonUseCase.actors[form.selecactor.$viewValue].obj_actor,
                "b": $scope.jsonUseCase.useCase[form.selectusecase.$viewValue].obj_usecase
            });
            $scope.jsonUseCase.relations.push({
                "type": "UMLCommunication",
                "obj_relation": relation
            });
            $("#modal_association").modal("hide");
        } else {
            alert("aguante :v");
        }
        console.log($scope.jsonUseCase);
    };

    /**
     * ##############################################################################################################
     * FIN RELACIONES
     * ##############################################################################################################
     * */

    /**
     * ##############################################################################################################
     * GUARDAR Y CARGAR EL MODELADO UML
     * ##############################################################################################################
     * */

    $scope.saveModeling = () => {
        console.log($scope.jsonUseCase);
        console.log(JSON.parse(JSON.stringify($scope.jsonClass)));
        var xml = (new DOMParser()).parseFromString('<applicationtag/>', 'text/xml');
        let secuence_data = [];
        let secuence_diagram = [];

        //obtener los diagramas de secuencia
        for (let position_diagram_secuence = 0; position_diagram_secuence < $scope.jsonUseCase.useCase.length; position_diagram_secuence++) {
            secuence_data.push({data: $scope.jsonUseCase.useCase[position_diagram_secuence].secuence_data});
            let secuence_diagram_usecase = $scope.jsonUseCase.useCase[position_diagram_secuence].secuence_diagram;
            secuence_diagram.push({graph: (new XMLSerializer()).serializeToString(secuence_diagram_usecase.getXML(xml))});
        }
        $scope.jsonClass["edition"] = $scope.editionClasDiagram;
        if ($scope.jsonClass["diagram"] === undefined) {
            $scope.jsonClass["diagram"] = [];
        }

        if ($scope.jsonClass["relationships"] === undefined) {
            $scope.jsonClass["relationships"] = [];
        }

        let api_param = {
            "user_token": $scope.DatoUsuario.user_token,
            "idproj": id_project,
            "dataJson": JSON.stringify([
                {
                    diagramType: "duml",
                    dataJson: {
                        "data": JSON.decycle($scope.jsonUseCase),
                        graph: (new XMLSerializer()).serializeToString(diagramUseCase.getXML(xml))
                    },
                    base64: ""
                }, {
                    diagramType: "dclass",
                    dataJson: {
                        "data": Object.assign({}, $scope.jsonClass),
                        graph: (new XMLSerializer()).serializeToString(diagramClass.getXML(xml))
                    },
                    base64: ""
                }, {
                    diagramType: "dseq",
                    dataJson: {
                        "data": secuence_data,
                        graph: secuence_diagram
                    },
                    base64: ""
                }, {
                    diagramType: "ctest",
                    dataJson: {
                        "data": $scope.jsonTdd,
                        graph: ""
                    },
                    base64: ""
                }
            ]),
            "module": "DiagramUml"
        };
        console.log(JSON.parse(api_param.dataJson));
        console.log(JSON.stringify(api_param));
        apiSaveModeling(JSON.stringify(api_param));
    };

    apiSaveModeling = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'projects/saveModuleFile',
            data: api_param,
            beforeSend: function () {
                loading();
            },
            success: function (data) {
                swal.close();
                alertAll(data);
            },
            error: function (objXMLHttpRequest) {
                console.log("error", objXMLHttpRequest);
                swal.fire("Error Severe", "Details: " + objXMLHttpRequest, "error");
            }
        });
    };

    $scope.loadUseCase = () => {
        let api_param = {
            "user_token": $scope.DatoUsuario.user_token,
            "idproj": id_project,
            "module": "DiagramUml"
        };
        apiLoadModeling(api_param);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });
    };

    $scope.loadClass = () => {
        let api_param = {
            "user_token": $scope.DatoUsuario.user_token,
            "idproj": id_project,
            "module": "ClassDiagram"
        };
        apiLoadModeling(api_param);
    };

    $scope.loadSecuence = () => {
        let api_param = {
            "user_token": $scope.DatoUsuario.user_token,
            "idproj": id_project,
            "module": "SeguenceDiagram"
        };
        apiLoadModeling(api_param);
    };

    $scope.loadTddJUnit = () => {
        let api_param = {
            "user_token": $scope.DatoUsuario.user_token,
            "idproj": id_project,
            "module": "Test"
        };
        apiLoadModeling(api_param);
    };

    apiLoadModeling = (api_param) => {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: urlWebServicies + 'projects/loadModuleFile',
            data: JSON.stringify({...api_param}),
            beforeSend: function () {
                //loading();
            },
            success: function (data) {

                switch (api_param.module) {
                    case "DiagramUml":
                        if (!isObjEmpty(data.data)) {
                            clearDiagram();
                            let jsonresponse = data.data.data;
                            $scope.$apply(() => {
                                $scope.jsonUseCase = jsonresponse;
                            });
                            importDiagram(diagramUseCase, data.data.graph, "UseCase");
                            getDataDiagram(diagramUseCase, $scope.jsonUseCase);
                        } else {
                            // crea el sistema principal dentro del diagrama (rectangulo central)
                            createSystem(nameProject);
                        }
                        diagramUseCase.draw();
                        $scope.loadClass();
                        break;
                    case "ClassDiagram":
                        if (data.data.graph !== "") {
                            importDiagram(diagramClass, data.data.graph, "ClassDiagram");
                            if (!isObjEmpty(data.data.data)) {
                                let jsonresponse = data.data.data;
                                $scope.jsonClass = Object.assign([], jsonresponse);
                                // eliminar las relaciones por la parte grafica
                                diagramClass._relations.length = 0;
                                diagramClass.draw();
                                // actualizar diagrama de secuencia
                                $scope.updateSecuence($scope.jsonClass);
                                for (let iclass = 0; iclass < diagramClass._nodes.length; iclass++) {
                                    let nclass = diagramClass._nodes[iclass];
                                    if (nclass._type === "UMLClass") {
                                        elementsClass.push({element: nclass});
                                        $scope.data_type.push(nclass.getName().split(" ")[1]);
                                    }
                                }
                                // actualizar la grafica de las lineas de las relaciones
                                relationsClass($scope.jsonClass.relationships);
                                $scope.editionClasDiagram = $scope.jsonClass.edition;
                            }
                            diagramUseCase.draw();
                            $scope.loadSecuence();
                        }
                        break;
                    case "SeguenceDiagram":
                        if (!isObjEmpty(data.data.data)) {
                            let jsonresponse = data.data.data;
                            for (let isecuence = 2; isecuence < $scope.btnDiagramUml.length; isecuence++) {
                                let secuence = $scope.btnDiagramUml[isecuence];
                                //importDiagram(secuence.diagram, data.data.graph[isecuence - 2].graph, "SequenceDiagram");
                                updateSecuenceDiagram(secuence.diagram, jsonresponse[isecuence - 2].data);
                            }
                        }
                        diagramUseCase.draw();
                        $scope.loadTddJUnit();
                        break;
                    case "Test":
                        swal.close();
                        if (!isObjEmpty(data.data.data)) {
                            let jsonresponse = data.data.data;
                            $scope.jsonTdd = Object.assign({}, jsonresponse);
                            $scope.classTdd = Object.assign([], jsonresponse.receiveTDDJSOM);
                            $scope.jsonTdd["receiveTDDJSOM"] = $scope.classTdd;
                        }
                        alertAll(data);
                        break;
                }
            },
            error: function (objXMLHttpRequest) {
                swal.fire("!Oh no¡", "Se ha producido un problema: " + objXMLHttpRequest, "error");
            }
        });
    };

    getDataDiagram = (diagram, data) => {
        let arrayNodes = diagram._nodes;
        let arrayNodesRelations = diagram._relations;

        let arrayActors = [];
        let arrayUseCase = [];
        let arrayRelations = [];

        for (let inodes = 0; inodes < arrayNodes.length; inodes++) {
            let node = arrayNodes[inodes];
            if (node._type === "UMLActor") {
                arrayActors.push({obj: node});
            } else if (node._type === "UMLUseCase") {
                arrayUseCase.push({obj: node});
            }
        }

        for (let irelations = 0; irelations < arrayNodesRelations.length; irelations++) {
            let noderelation = arrayNodesRelations[irelations];
            arrayRelations.push({obj: noderelation});
        }

        for (let idata = 0; idata < data.actors.length; idata++) {
            let actorNode = data.actors[idata];
            for (let iobj = 0; iobj < arrayActors.length; iobj++) {
                if (actorNode.name === arrayActors[iobj].obj.getName()) {
                    actorNode.obj_actor = arrayActors[iobj].obj;
                }
            }
        }

        if (data.useCase.length === arrayUseCase.length) {
            for (let iusecase = 0; iusecase < data.useCase.length; iusecase++) {
                for (let iusecase_ = 0; iusecase_ < data.useCase.length; iusecase_++) {
                    if (data.useCase[iusecase].name === arrayUseCase[iusecase_].obj.getName()) {
                        data.useCase[iusecase].obj_usecase = arrayUseCase[iusecase_].obj;
                        iusecase_ = data.useCase.length;
                    }
                }
            }
        }

        for (let iusecase = 0; iusecase < data.useCase.length; iusecase++) {
            let usecaseNode = data.useCase[iusecase];
            for (let iusecasediagram = 0; iusecasediagram < arrayUseCase.length; iusecasediagram++) {
                if (usecaseNode.name_i === undefined)
                    usecaseNode["name_i"] = usecaseNode.name;

                if (usecaseNode.name_i === arrayUseCase[iusecasediagram].obj.getName()) {
                    usecaseNode.obj_usecase = arrayUseCase[iusecasediagram].obj;
                    let secuence_diagram = createDiagram({
                        "width": 100,
                        "height": 81,
                        "id_div": "areaDiagram",
                        "diagram": UMLSequenceDiagram,
                        "name": "Secuence Diagram - " + usecaseNode.name,
                        "interaction": false,
                        "draw": false
                    });
                    $scope.$apply(() => {
                        $scope.btnDiagramUml.push({
                            diagram: secuence_diagram,
                            "name": "Secuence Diagram - " + usecaseNode.name,
                            "type": "UMLSequenceDiagram",
                            "status": "C",
                            "btnactive": "btn btn-sm button-dt mr-2 mt-1"
                        });
                    });
                    usecaseNode.secuence_diagram = secuence_diagram;
                }
            }

        }

        if (data !== undefined) {
            if (data.relations !== undefined) {
                for (let irel = 0; irel < arrayRelations.length; irel++) {
                    data.relations[irel].obj_relation = arrayRelations[irel].obj;
                }
            }
        }

        if (arrayActors.length > 0 && data.actors.length === 0) {
            for (let iactor = 0; iactor < arrayActors.length; iactor++) {
                data.actors.push({
                    "obj_actor": arrayActors[iactor].obj,
                    "name": arrayActors[iactor].obj.getName()
                });
            }
        } else if (arrayActors.length === data.actors.length) {
            for (let iactor = 0; iactor < arrayActors.length; iactor++) {
                data.actors[iactor].obj_actor = arrayActors[iactor].obj;
                data.actors[iactor].name = arrayActors[iactor].obj.getName();
            }
        } else if (arrayActors.length !== data.actors.length) {
            data.actors.length = 0;
            for (let iactor = 0; iactor < arrayActors.length; iactor++) {
                if (arrayActors[iactor].obj.getName() !== undefined) {
                    data.actors.push({
                        "obj_actor": arrayActors[iactor].obj,
                        "name": arrayActors[iactor].obj.getName()
                    });
                }
            }
        }


    };

    /**
     * ##############################################################################################################
     * FIN GUARDAR Y CARGAR EL MODELADO UML
     * ##############################################################################################################
     * */

    $scope.exportImage = () => {
        exportImg();
    };

    $scope.deleteStepSecuence = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "All data entered will be permanently deleted.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deletes all!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(() => {
                    $scope.table_normal_flow.splice(index, 1);
                });
            }
        });
    };

    $scope.updateStepSecuence = () => {
        alertAll({status: 3, information: "Construction zone"});
    };

    /**
     * ##############################################################################################################
     * INICIO VALIDADORES NOMBRES DE ACTORES Y CASOS DE USO
     * ##############################################################################################################
     * */

    /**
     * @param {string} name
     * @param index indice
     * */
    $scope.nameEquals = (name, index) => {
        let isEquals = false;
        if ($scope.jsonUseCase.useCase.length > 0) {
            for (let indice = 0; indice < $scope.jsonUseCase.useCase.length; indice++) {
                let usecase = $scope.jsonUseCase.useCase[indice];
                if (indice !== index) {
                    if (name === usecase.name) {
                        isEquals = true;
                    }
                }
            }
        }

        if ($scope.jsonUseCase.actors.length > 0) {
            for (let indice = 0; indice < $scope.jsonUseCase.actors.length; indice++) {
                let actor = $scope.jsonUseCase.actors[indice];
                if (indice !== index) {
                    if (name === actor.name) {
                        isEquals = true;
                    }
                }
            }
        }

        if ($scope.actorsUseCase.length > 0) {
            for (let indice = 0; indice < $scope.actorsUseCase.length; indice++) {
                let actorusecase = $scope.actorsUseCase[indice];
                if (actorusecase.obj_actor._type !== "UMLUseCase") {
                    if (indice !== index) {
                        if (name === actorusecase.name) {
                            isEquals = true;
                        }
                    }
                }
            }
        }

        if ($scope.jsonUseCase.actors.length > 0) {
            for (let indice = 0; indice < $scope.jsonUseCase.actors.length; indice++) {
                let actor = $scope.jsonUseCase.actors[indice];
                if (indice !== index) {
                    if (name === actor.name) {
                        isEquals = true;
                    }
                }
            }
        }

        if (isEquals)
            alertAll({
                status: 3,
                information: "The name entered is already assigned to another object in the use case diagram."
            });

        return isEquals;
    };

    /**
     * @param {string} name
     * @param index indice
     * */
    $scope.nameEqualsNoMess = (name, index) => {
        let isEquals = false;
        if ($scope.jsonUseCase.useCase.length > 0) {
            for (let indice = 0; indice < $scope.jsonUseCase.useCase.length; indice++) {
                let usecase = $scope.jsonUseCase.useCase[indice];
                if (indice !== index) {
                    if (name === usecase.name) {
                        isEquals = true;
                    }
                }
            }
        }

        if ($scope.jsonUseCase.actors.length > 0) {
            for (let indice = 0; indice < $scope.jsonUseCase.actors.length; indice++) {
                let actor = $scope.jsonUseCase.actors[indice];
                if (indice !== index) {
                    if (name === actor.name) {
                        isEquals = true;
                    }
                }
            }
        }

        let encontrado = 0;
        if ($scope.actorsUseCase.length > 0) {
            for (let indice = 0; indice < $scope.actorsUseCase.length; indice++) {
                let actorusecase = $scope.actorsUseCase[indice];
                if (actorusecase.obj_actor._type !== "UMLUseCase") {
                    if (indice !== index) {
                        if (name === actorusecase.name) {
                            encontrado++;
                        }
                    }
                }
            }

            if (encontrado > 1) {
                isEquals = true;
            }
        }

        return isEquals;
    };

    /**
     * ##############################################################################################################
     * FIN VALIDADORES NOMBRES DE ACTORES Y CASOS DE USO
     * ##############################################################################################################
     * */

    /**
     * ##############################################################################################################
     * INICIO FUNCIONES DIAGRAMA DE CLASES
     * ##############################################################################################################
     * */

    $scope.editionClasDiagram = false;
    $scope.description = ["public", "private", "protected", "static", "abstract", "final", "interface"];
    $scope.data_type = ['String', 'Int', 'Float', 'Boolean', 'Double', 'Long'];
    $scope.dataType = [];
    $scope.visibility = [];
    $scope.attributes = [];
    $scope.methods = [];
    $scope.paramMethods = [];
    $scope.positionSelected = 0;
    $scope.updateClass = false;
    $scope.positionClass = -1;

    $scope.activeEditionParam = false;
    $scope.typeRelation = {"value": "", "object": ""};

    $scope.updateLegend = (form) => {
        if (form.$valid) {
            updateLegendTools($scope.selectedClass, form.up_legendclass.$modelValue);
        }
    };

    $scope.nameEqualsGeneric = (array, key, name) => {
        let flag = false;
        for (let x = 0; x < array.length; x++) {
            if (array[x][key] === name) {
                flag = true;
            }
        }
        return flag;
    }

    //#region atributos

    /**
     * INICIO METODOS PARA LOS ATRIBUTOS DE UNA CLASE
     * */

    // agregar atributos a una clase nueva
    $scope.addAttribute = () => {

        if ($scope.nameEqualsGeneric($scope.attributes, "name", $scope.att_name)) {
            alertAll({"status": 3, "information": "There is already a attribute with that name."});
            return;
        }

        $scope.attributes.push({
            "name": $scope.att_name,
            "type": $scope.att_datatype,
            "visibility": $scope.att_visibility
        });
        $scope.clearAtt();
    };

    //obtener los datos del atributo a editar
    $scope.selectedAtt = (object, index) => {
        console.log("OBJETO SELECCIONADO ", object);
        $scope.up_att_name = object.name;
        $scope.up_att_visibility = object.visibility;
        $scope.up_att_datatype = object.type;

        $scope.positionSelected = index;
        $("#modal_updateAtt").modal();
    };

    // editar el atributo seleccionado
    $scope.updateAttribute = (form) => {
        $scope.attributes[$scope.positionSelected].name = form.up_att_name.$modelValue;
        $scope.attributes[$scope.positionSelected].visibility = form.up_att_visibility.$modelValue;
        $scope.attributes[$scope.positionSelected].type = form.up_att_datatype.$modelValue;
        $("#modal_updateAtt").modal("hide");
    };

    //eliminar atributos de una clase nueva
    $scope.deleteAttribute = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Delete the selected attribute.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(() => {
                    $scope.attributes.splice(index, 1);
                });
            }
        });
    };

    /**
     * FIN METODOS PARA LOS ATRIBUTOS DE UNA CLASE
     * */

    //#endregion atributos

    //#region metodos

    // funcion para agregar un nuevo metodo
    $scope.addMethod = () => {

        if ($scope.nameEqualsGeneric($scope.methods, "name", $scope.mt_name)) {
            alertAll({"status": 3, "information": "There is already a method with that name."});
            return;
        }

        $scope.paramMethods = [];
        $scope.methods.push({
            "name": $scope.mt_name,
            "parameters": $scope.paramMethods,
            "type": $scope.mt_datatype,
            "visibility": $scope.mt_visibility
        });
        $scope.clearMeth();
    };

    // obtener los parametros del metodo seleccionado
    $scope.getParameters = (object, index) => {
        console.log(object.parameters);
        $scope.positionMethod = index;
        $scope.paramMethods = object.parameters;
        $("#modal_parameters").modal();
    };

    // agregar un nuevo parametro al metodo seleccionado
    $scope.addParameter = () => {
        $scope.paramMethods.push({
            "name": "",
            "type": "",
            "active": true
        })
    };

    $scope.positionMethod = -1;
    $scope.saveParameters = () => {
        $scope.methods[$scope.positionMethod].parameters = Object.assign([], $scope.paramMethods);
        $scope.paramMethods.length = 0;
        $("#modal_parameters").modal("hide");
    }

    // guardar el nuevo parametro
    $scope.saveParameter = (index) => {
        let nameParam = $("#param_name_" + index).val();

        let flag = false;
        for (let x = 0; x < $scope.paramMethods.length; x++) {
            if ($scope.paramMethods[x].name !== $scope.paramMethods[index].name) {
                if ($scope.paramMethods[x].name === nameParam) {
                    flag = true;
                }
            }
        }

        if (flag) {
            alertAll({"status": 3, "information": "There is already a parameter with that name."});
            return;
        }

        let datatype = $("#datatype_" + index).val();
        if (!$scope.activeEditionParam) {
            $scope.paramMethods[index].name = nameParam;
            $scope.paramMethods[index].type = datatype;
            $scope.paramMethods[index].active = false;
            //delete $scope.paramMethods[index]['active'];
            console.log($scope.paramMethods);
        } else {
            $scope.paramMethods[index].name = nameParam;
            $scope.paramMethods[index].type = datatype;
            $scope.paramMethods[index].active = false;
            let status = [];
            for (let x = 0; x < $scope.paramMethods.length; x++) {
                if (!$scope.paramMethods[x].active)
                    status.push($scope.paramMethods[x].active);
            }
            if (status.length === $scope.paramMethods.length)
                $scope.activeEditionParam = false;
        }
    };

    // eliminar parametro
    $scope.deleteParam = (index) => {
        $scope.paramMethods.splice(index, 1);
    };

    // metodo para seleccionar un parametro
    $scope.selectedTypeParameter = (value) => {
        let valueAux = value.split(":");
        if (valueAux[0] === "string") {
            return value;
        } else {
            return "string:" + value;
        }
    };

    // eliminar un metodo
    $scope.deleteMethod = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be reversed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, activate!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(() => {
                    $scope.methods.splice(index, 1);
                });
            }
        });
    }

    //#endregion metodos

    //#region relaciones

    $("#btnagregation").click(() => {

        if (!$scope.editionClasDiagram) {
            alertAll({"status": 3, "information": "You cannot modify the class diagram if editing is disabled."});
            return;
        }

        $scope.$apply(() => {
            $scope.typeRelation.value = "agregation";
            $scope.typeRelation.object = UMLAggregation;
        });
        $("#modal_relations_class").modal();
    })

    $("#btndependecy").click(() => {

        if (!$scope.editionClasDiagram) {
            alertAll({"status": 3, "information": "You cannot modify the class diagram if editing is disabled."});
            return;
        }

        $scope.$apply(() => {
            $scope.typeRelation.value = "dependency";
            $scope.typeRelation.object = UMLAssociation;
        });
        $("#modal_relations_class").modal();
    });

    $("#btngeneralizationc").click(() => {

        if (!$scope.editionClasDiagram) {
            alertAll({"status": 3, "information": "You cannot modify the class diagram if editing is disabled."});
            return;
        }

        $scope.$apply(() => {
            $scope.typeRelation.value = "generalization";
            $scope.typeRelation.object = UMLAssociation;
        });
        $("#modal_relations_class").modal();
    });

    $("#btnasositionc").click(() => {

        if (!$scope.editionClasDiagram) {
            alertAll({"status": 3, "information": "You cannot modify the class diagram if editing is disabled."});
            return;
        }

        $scope.$apply(() => {
            $scope.typeRelation.value = "association";
            $scope.typeRelation.object = UMLAssociation;
        });
        $("#modal_relations_class").modal();
    });

    $scope.createRelation = (form) => {

        if (form.class_from.$modelValue.className === form.class_to.$modelValue.className) {
            alertAll({"status": 3, "information": "Select different class."});
            return;
        }

        let flag = false;
        for (let x = 0; x < $scope.jsonClass.relationships.length; x++) {
            let from = $scope.jsonClass.relationships[x].from;
            let to = $scope.jsonClass.relationships[x].to;
            if ((from === form.class_from.$modelValue.className && to === form.class_to.$modelValue.className) ||
                    (from === form.class_to.$modelValue.className && to === form.class_from.$modelValue.className)) {
                flag = true;
            }
        }

        if (!flag) {
            let cardinalidateObject = form.cardinalidate.$modelValue.toString()
            let from_fk = "";
            let to_fk = "";
            if (cardinalidateObject === "1..1") {
                from_fk = form.class_to.$modelValue.className.toLowerCase() + ":" + form.class_to.$modelValue.className;
                to_fk = form.class_from.$modelValue.className.toLowerCase() + ":" + form.class_from.$modelValue.className;
            } else if (cardinalidateObject === "1..*") {
                from_fk = form.class_to.$modelValue.className.toLowerCase() + ":" + form.class_to.$modelValue.className + "[]";
                to_fk = form.class_from.$modelValue.className.toLowerCase() + ":" + form.class_from.$modelValue.className;
            } else if (cardinalidateObject === "*..1") {
                from_fk = form.class_to.$modelValue.className.toLowerCase() + ":" + form.class_to.$modelValue.className;
                to_fk = form.class_from.$modelValue.className.toLowerCase() + ":" + form.class_from.$modelValue.className + "[]";
            }

            let relationAux = [];
            relationAux.push({
                "from": form.class_from.$modelValue.className,
                "to": form.class_to.$modelValue.className,
                "typeRelatioship": $scope.typeRelation.value,
                "cardinalidate": cardinalidateObject,
                from_fk: from_fk,
                to_fk: to_fk
            });
            $scope.jsonClass.relationships.push(relationAux[0]);

            // agregar ls fk a las tablas relacionadas
            $scope.addForeingKey($scope.jsonClass.diagram[0].class, relationAux);

            let from = getFromToRelation(form.class_from.$modelValue.className);
            let to = getFromToRelation(form.class_to.$modelValue.className);
            from.addAttribute("- " + from_fk);
            to.addAttribute("- " + to_fk);
            let relation = createRelationClass({
                type: $scope.typeRelation.object,
                value: $scope.typeRelation.value,
                typeRelatioship: $scope.typeRelation.value,
                a: from,
                b: to,
                card_A: cardinalidateObject.split("..")[0],
                card_B: cardinalidateObject.split("..")[1]
            });

            elementsClass.push({"element": relation});
            diagramClass.draw();
            $("#modal_relations_class").modal("hide");
        } else {
            alertAll({"status": 3, "information": "The selected classes already have a relationship."});
        }
    };

    //#endregion relaciones

    // activar edicion de los parametros
    $scope.activeEdition = () => {
        $scope.activeEditionParam = true;
        for (let x = 0; x < $scope.paramMethods.length; x++) {
            $scope.paramMethods[x].active = true;
        }
    };

    // guardar los cambios al momento de tener activa la edicion de todos los campos
    $scope.saveUpateActive = (index) => {
        let datatype = $("#datatype_" + index).val();
        $scope.paramMethods[index].type = datatype;
    }

    // desactivar la edicion de los parametros
    $scope.disabledEdition = () => {
        $scope.activeEditionParam = false;
        for (let x = 0; x < $scope.paramMethods.length; x++) {
            $scope.paramMethods[x].active = false;
        }
    };

    /**
     * FIN METODOS PARA LOS METODOS DE UNA CLASE
     * */

    // activar la edicion del diagrama de clase
    $scope.activateEditionClassDiagram = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to manually edit the class diagram, if you edit the class diagram you will not be able to modify the changes in the descriptions or actions of the use case. ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, activate!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(() => {
                    $scope.editionClasDiagram = true;
                });
            }
        });
    };

    // desactivar la edicion del diagrama de clase
    $scope.restoreClassDiagram = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to revert all the changes made, everything done will be deleted definitively and the class diagram will be generated again from the use case descriptions.\n",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, restart!'
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.$apply(() => {
                    $scope.editionClasDiagram = false;
                    superInterpret();
                    updateClassDiagram($scope.jsonClass, "U");
                    diagramClass.draw();
                });
            }
        });
    }

    $scope.cancelClass = (form) => {
        $("#modal_newclass").modal("hide");
        $scope.clearFormClass();
        form.$setPristine();
        form.$setUntouched();
    };

    // METODOS PARA CREAR LOS OBJETOS EN LE DIAGRAMA
    $scope.newClass = (form) => {

        if ($scope.nameEqualsGeneric($scope.jsonClass.diagram[0].class, "className", form.nc_classname.$modelValue)) {
            alertAll({"status": 3, "information": "There is already a class with that name."});
            return;
        }

        if ($scope.attributes.length === 0) {
            alertAll({"status": 3, "information": "Enter at least one attribute for the class."});
            return;
        }

        if ($scope.methods.length === 0) {
            alertAll({"status": 3, "information": "Enter at least one method for the class."});
            return;
        }

        if (form.$valid) {
            $scope.jsonClass.diagram[0].class.push({
                "action": "create",
                "attributes": Object.assign([], $scope.attributes),
                "className": form.nc_classname.$modelValue,
                "derivative": [],
                "methods": Object.assign([], $scope.methods),
                "visibility": form.nc_visibility.$modelValue
            });
            // updateClassDiagram($scope.jsonClass, "C");
            let newclass = createClass({
                name: visibilityGlobal[form.nc_visibility.$modelValue] + " " + form.nc_classname.$modelValue,
                x: (Math.floor(Math.random() * 10) * 100),
                y: (Math.floor(Math.random() * 15) * 30)
            });
            for (let iattributes = 0; iattributes < $scope.attributes.length; iattributes++) {
                let attributes = $scope.attributes[iattributes];
                newclass.addAttribute(visibilityGlobal[attributes.visibility] + " " + attributes.name + ":" + attributes.type);
            }
            for (let imethods = 0; imethods < $scope.methods.length; imethods++) {
                let methods = $scope.methods[imethods];
                newclass.addOperation(visibilityGlobal[methods.visibility] + " " + methods.name + "(" + getParamethersReplace(methods.parameters) + "):" + methods.type);
            }
            $("#modal_newclass").modal("hide");
            elementsClass.push({"element": newclass});
            diagramClass.draw();
            $scope.clearFormClass();

            form.$setPristine();
            form.$setUntouched();

            alertAll({"status": 2, "information": "Class successfully adds."});
        }
    };

    $scope.modifyClass = (form) => {
        /*if($scope.nameEqualsGeneric($scope.jsonClass.diagram[0].class, "className", form.nc_classname.$modelValue)){
         alertAll({"status": 3, "information": "There is already a class with that name."});
         return;
         }*/
        let classModify = $scope.jsonClass.diagram[0].class[$scope.positionClass];
        let flag = false;
        // validar que no existe un nombre igual al de otra clase pero excepto la clase seleccionada
        for (let x = 0; x < $scope.jsonClass.diagram[0].class.length; x++) {
            let classx = $scope.jsonClass.diagram[0].class[x];
            if (classx.className !== classModify["className"]) {
                if (classx.className === form.nc_classname.$modelValue) {
                    flag = true;
                }
            } else
                flag = false;
        }

        if (flag) {
            alertAll({"status": 3, "information": "There is already a class with that name."});
            return;
        }

        if ($scope.attributes.length === 0) {
            alertAll({"status": 3, "information": "Enter at least one attribute for the class."});
            return;
        }

        /*if($scope.methods.length === 0){
         alertAll({"status": 3, "information": "Enter at least one method for the class."});
         return;
         }*/

        if (form.$valid) {
            let positionElement = -1;
            let classEdit = undefined;
            for (let x = 0; x < elementsClass.length; x++) {
                let elemen = elementsClass[x].element;
                if (elemen.getType() === "UMLClass") {
                    if (elemen.getName().split(" ")[1] === classModify["className"]) {
                        let components = elemen.getComponents();
                        classEdit = elemen;
                        console.log(components[2]._childs);
                        console.log(components[3]._childs);
                        components[2]._childs.length = 0;
                        components[3]._childs.length = 0;
                        positionElement = x;
                    }
                }
            }

            let classname = form.nc_classname.$modelValue.replaceAll(" ", "_");
            classModify["className"] = classname;
            classModify["visibility"] = form.nc_visibility.$modelValue;
            classModify["modifiers"] = "";
            classModify["action"] = "update";
            classModify["attributes"] = $scope.attributes;
            classModify["methods"] = $scope.methods;

            classEdit.setName(visibilityGlobal[form.nc_visibility.$modelValue] + " " + classname);

            for (let iattributes = 0; iattributes < $scope.attributes.length; iattributes++) {
                let attributes = $scope.attributes[iattributes];
                classEdit.addAttribute(visibilityGlobal[attributes.visibility] + " " + attributes.name.replaceAll(" ", "_") + ":" + attributes.type);
            }
            for (let imethods = 0; imethods < $scope.methods.length; imethods++) {
                let methods = $scope.methods[imethods];
                classEdit.addOperation(visibilityGlobal[methods.visibility] + " " + methods.name.replaceAll(" ", "_") + "(" + getParamethersReplace(methods.parameters) + "):" + methods.type);
            }

            $("#modal_newclass").modal("hide");
            diagramClass.draw();
            $scope.updateClass = false;

            form.$setPristine();
            form.$setUntouched();

            alertAll({"status": 2, "information": "Class successfully update."});
        }
    };

    $scope.clearFormClass = () => {
        $scope.nc_classname = "";
        $scope.nc_visibility = "-1";

        $scope.att_name = "";
        $scope.att_datatype = "-1";
        $scope.att_visibility = "-1";

        $scope.mt_name = "";
        $scope.mt_datatype = "-1";
        $scope.mt_visibility = "-1";

        $scope.attributes.length = 0;
        $scope.methods.length = 0;
        //$scope.paramMethods.length = 0;

        $scope.updateClass = false;
    };

    $scope.clearAtt = () => {
        $scope.att_name = "";
        $scope.att_datatype = "-1";
        $scope.att_visibility = "-1";
    };

    $scope.clearMeth = () => {
        $scope.mt_name = "";
        $scope.mt_datatype = "-1";
        $scope.mt_visibility = "-1";
    };

    $scope.copyUseCase = function () {
        selectElementContents(document.getElementById('viewUseCaseTable'));
    };

    function selectElementContents(table) {
        //ar table = document.getElementById(el);

        if (navigator.clipboard) {
            var text = table.innerText.trim();

            //var range = document.createRange();
            //range.selectNode(table);

            navigator.clipboard.writeText(text).catch(function () {
            });
        }
        console.log("COPIADO !!");
        alertAll({"status": 2, "information": "Content successfully copied."});
    }

    /**
     * ##############################################################################################################
     * FIN FUNCIONES DIAGRAMA DE CLASES
     * ##############################################################################################################
     * */
});
