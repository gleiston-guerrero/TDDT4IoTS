app.expandControllerSocket = function ($scope) {
    let SessionParams = {};
    const URL_WEBSCOKET_TDD = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
        window.location.host + "/Tddm4IoTbsServer/ws_sharing_Ea";
    let webSocketTdd;
    $scope.usersConected = [];

    /**
     * Funcion para inicializar el websocket y realizar la conexion de los usuarios
     * @param idProject ID del proyecto el cual se crearan grupos de conexion
     * */
    $scope.webSocketInit = function (idProject) {
        webSocketTdd = new WebSocket(URL_WEBSCOKET_TDD);
        webSocketTdd.onopen = onOpen;
        webSocketTdd.onclose = onClose;
        webSocketTdd.onmessage = onMessage;
        webSocketTdd.onerror = onError;
        if (idProject)
        {
            SessionParams.groupid = idProject;
        }
    };

    function websocketisOpen() {
        if (webSocketTdd != null) {
            return webSocketTdd.readyState === 1;
        }
        return false;
    }

    function websocketClose() {
        webSocketTdd.close();
    }

    /**
     * Funcion para ir agregando los usuarios a la lista de usuarios conectados al proyecto
     * */
    function onOpen() {
        console.log("conectado...");
        let objmsg = {
            "config": "init",
            "groupId": SessionParams.groupid,
            "host": false,
            "user": {
                "name": $scope.DatoUsuario["name_person"] + ' ' + $scope.DatoUsuario["lastname_person"],
                "email": $scope.DatoUsuario["email_person"],
                "img_person": $scope.DatoUsuario["pathimg_person"]
            }
        };

        $scope.messageSend(objmsg);
    }
    function onClose(evt) {
        console.log("Desconectado...");
        console.log(evt);
    }

    function onError(event) {
        console.error("Error en el WebSocket detectado:");
        console.log(event);
    }

     $scope.messageSend = function(obj) {
        console.log("enviando...");
        let objmsg = JSON.stringify(obj);
        if (objmsg.length <= 10000450)
        {
            webSocketTdd.send(objmsg);
            console.log("enviand mensaje:sock");
            console.log(objmsg);
        } else {
            alertAll({status: 4, information: "The message exceeds the limit."});
        }
    }

    function onMessage(evt) {
        var obj = JSON.parse(evt.data);
        console.log(obj);
        let form;
        //header-config-content
        //groupId
        switch (obj.config) {
            case "host":
            {
                //llamar a toast AlertAll (status = 1)
                console.log("HOST ASIGNADO A UN NUEVO USUARIO");
            }
                break;
            case "save":
            {
                //invocar al método de guardar
                //puedes incluir los datos de quien desea guardar
                // y agregarlo al toast o label
                alert("Guardar");
            }
                break;
            case "connect":
            {
                // llamar a toast de: Tal usuario se ha conectado
                console.log("NUEVO USUARIO CONECTADO", obj);
                alertAll({status: 1, information: "El usuario " + obj.content["name"] + " se ha conectado."});
            }
                break;
            case "disconnect":
            {
                // llamar a toast de: Tal usuario se ha *des*conectado
            }
                break;
            case "list":
            {
                //esta es la lista de usuarios que tienen en línea :D
                console.log("LISTA DE USUARIOS");
                $scope.$apply(() => {
                    $scope.usersConected =  obj.content;
                    console.log($scope.usersConected);
                })
                //window.alert("lista");
            }
                break;
            case "error":
            {
                // regresa cuando hubo un error
                //header - content - config
                // header es system para este caso
            }
                break;
            case "dragObjeect":
                let data = obj.content;
                let object = searchObjectTool(data.typeDiagram, data.name);
                object[0].position(data.posx, data.posy);
                object[1].draw();
                break;
            case "createActor":
                form = JSON.retrocycle(obj.content.form);
                $scope.createActor(form, false);
                break;
            case "selectedActor":
                let name = obj.content.name;
                let objActor = undefined;
                for(let x = 0; x < $scope.jsonUseCase.actors.length; x++){
                    let actorData = $scope.jsonUseCase.actors[x];
                    if(actorData.obj_actor.getName() === name){
                        objActor = actorData.obj_actor
                    }
                }
                $scope.object_update = objActor;
                $scope.actor_name = objActor.getName();
                break;
            case "updateActor":
                form = JSON.retrocycle(obj.content.form);
                $scope.updateActor(form, false);
                break;
            default:
            case "createActorUC":
                let nameActor = obj.content.form;
                $scope.usecase_actorname = nameActor;
                $scope.createActorUC(false);
                break;
            case "createUseCase":
                form = JSON.retrocycle(obj.content.form);
                $scope.manager_maf = obj.content.manager_maf;
                $scope.table_normal_flow =  obj.content.table_normal_flow;
                $scope.table_loop =  obj.content.table_loop;
                $scope.table_alternative_if = obj.content.table_alternative_if;
                $scope.table_alternative_else = obj.content.table_alternative_else;
                $scope.createUseCaseUC(form);
                break;
            case "interpretUseCaseDescription":
                $scope.usecase_description_interpret = obj.content.form;
                $scope.interpretUseCaseDescription(false);
            break;
            case "selectedUseCase":
                let positionx = obj.content.position;
                selectedUseCase($scope.jsonUseCase.useCase[positionx].obj_usecase, false);
            break;
            case "updateUseCase":
                form = JSON.retrocycle(obj.content.form);
                $scope.encontrado = obj.content.encontrado;
                $scope.object_update = $scope.jsonUseCase.useCase[$scope.encontrado].obj_usecase;
                $scope.manager_maf.main_stage = obj.content.main_stage;
                $scope.manager_maf.alternative_flow = obj.content.alternative_flow;
                $scope.table_normal_flow = obj.content.table_normal_flow;
                $scope.table_loop = obj.content.table_loop;
                $scope.table_alternative_if = obj.content.table_alternative_if;
                $scope.table_alternative_else = obj.content.table_alternative_else;
                $scope.updateUseCase(form, false);
            break;
            {
                //este no deberias definirlo
            }
                break;
            //PUEDES AGREGAR TU MÉTODOS
            //aqui solo basta agregar el config que recibiras
            //un ejemplo puede ser config="circuit"
            //entonces ese condif lo envías y así mismo
            //lo validas aquí para recibirlo :3
        }
    }

    $scope.utilWebSocket = (config, data) => {
        let objmsg = {
            "config": config,
            "groupId": SessionParams.groupid,
            "content": { ...data}
        };
        console.log("ENVIANDO SOCKET", objmsg);
        $scope.messageSend(objmsg);
    }



}
