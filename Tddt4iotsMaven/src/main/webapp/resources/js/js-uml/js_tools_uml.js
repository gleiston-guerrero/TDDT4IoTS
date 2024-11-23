/* global angular, Swal */

/***
 * ##############################################################################################################
 * INICIO BLOQUE DE CODIGO PARA LAS HERRAMIENTAS DE CASO DE USO
 * ##############################################################################################################
 * */
// json para manejar la parte grafica de todo el diagrama de caso de uso
var diagramUseCase = {};
let diagramClass = {};
var system = {};

var lienzo;
var mainContext;
var canvas;
var motionContext;

var width = 2000;
var height = 2000;

function exportImg() {
    var url = lienzo.toDataURL('image/png');

    // crear un nuevo canvas
    let newCanvas = document.createElement("canvas");
    let ctx = newCanvas.getContext("2d");
    let divContainer = document.getElementById("areaDiagram");
    // asignar el tamanio deseado
    newCanvas.width = divContainer.clientWidth;
    newCanvas.height = divContainer.clientHeight;
    var img = new Image();
    img.src = url;
    img.width = 150;
    var marcaAgua = new Image();
    marcaAgua.src = "resources/img/logo-app/logoGraficosicon.png";

    marcaAgua.onload = function () {
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(marcaAgua, 20, divContainer.clientHeight - 130);
        url = newCanvas.toDataURL('image/png');
        window.open(url, '_blank');
    }
}

function createDiagram(attributes) {
    let width = attributes.width;
    let height = attributes.height;
    let div = document.getElementById(attributes.id_div);
    div.setAttribute('class', 'ud_diagram_div overflow-hidden');
    div.style.width = width + '%';
    div.style.height = height + 'vh';

    lienzo = document.getElementById('mac');

    lienzo.setAttribute('class', 'ud_diagram_canvas');
    lienzo.width = 2000;
    lienzo.height = 2000;

    mainContext = lienzo.getContext('2d');

    canvas = document.getElementById('mot');
    canvas.setAttribute('class', 'ud_diagram_canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    canvas.onmousedown = function () {
        return false;
    };

    motionContext = canvas.getContext('2d');
    div.appendChild(lienzo);
    div.appendChild(canvas);

    let d1 = new attributes.diagram(); //UMLUseCaseDiagram UMLClassDiagram
    d1.initialize(0, div, mainContext, motionContext, 2000, 2000);
    d1.stopEvents();
    d1.interaction(attributes.interaction);
    d1.setName(attributes.name);
    if (attributes.draw)
        d1.draw();

    return d1;
}

function importDiagram(diagram, xml, typeMenu) {

    var xmlnode = (new DOMParser()).parseFromString(xml, 'text/xml');

    diagram.setXML(xmlnode);

    if (typeMenu === "UseCase") {
        setMenuUseCase(diagram._nodes, "nodes");
        setMenuUseCase(diagram._relations, "relations");
    } else if (typeMenu === "ClassDiagram") {
        setMenuClass(diagram._nodes, "nodes");
        setMenuClass(diagram._relations, "relations");
    }


    let div = document.getElementById("areaDiagram");
    diagram.initialize(0, div, mainContext, motionContext, width, height);


    diagram.draw();
}

function setMenuUseCase(nodes, typeNode) {
    for (let imenu = 0; imenu < nodes.length; imenu++) {
        let node = nodes[imenu];
        if (typeNode === "nodes") {
            if (node._type === "UMLActor") {
                node.setMenu([
                    [function () {
                            selectedActor(node);
                        }, 'Update'],
                    [function () {
                            deleteObject(node, 2);
                        }, 'Delete']
                ]);
            } else if (node._type === "UMLUseCase") {
                node.setMenu([
                    [function () {
                            selectedUseCase(node, true);
                        }, 'Update'],
                    [function () {
                            deleteObject(node, 1);
                        }, 'Delete'],
                    [function () {
                            viewUseCase(node);
                        }, 'View']
                ]);
            } else if (node._type === "UMLSystem") {
                node.setMenu([]);
            }
        } else {
            if (node._type === "UMLCommunication" || node._type === "UMLInclude" || node._type === "UMLExtend" ||
                    node._type === "UMLGeneralization") {
                node.setMenu([
                    [function () {
                            deleteObject(node, 3);
                        }, 'Delete']
                ]);
            }
        }
    }
}

function setMenuClass(nodes, typeNode) {
    for (let imenu = 0; imenu < nodes.length; imenu++) {
        let node = nodes[imenu];

        if (typeNode === "nodes") {
            if (node._type === "UMLClass" || node._type === "UMLInterfaceExtended") {
                node.setMenu([
                    [function () {
                            selectedClass(node);
                        }, 'Update'],
                    [function () {
                            deleteObjectClass(node, 4); // 4 clases
                        }, 'Delete']
                ]);
            }
        } else {
            if (node._type === "UMLAggregation" || node._type === "UMLAssociation" || node._type === "UMLDependency" ||
                    node._type === "UMLGeneralization") {
                node.setMenu([
                    [function () {
                            deleteObjectClass(node, 5); // 5 relaciones de clases
                        }, 'Delete'],
                    [function () {
                            editLegend(node);
                        }, 'Edit legend']
                ]);
            }
        }
    }
}

function changeDiagram(diagrama1, diagram2) {
    diagrama1.interaction(false);

    //Se limpian los lienzos de dibujo
    mainContext.clearRect(0, 0, width, height);
    motionContext.clearRect(0, 0, width, height);

    diagram2.draw();
    diagram2.interaction(true);
}

function clearDiagram() {
    mainContext.clearRect(0, 0, width, height);
    motionContext.clearRect(0, 0, width, height);
}

function createActorTools(attributes) {
    let objectactor = new UMLActor({x: 250, y: attributes.pos_Y});
    objectactor.setName(attributes.name);
    objectactor.setMoveable();
    objectactor.setMenu([
        [function () {
                selectedActor(objectactor);
            }, 'Update'],
        [function () {
                deleteObject(objectactor, 2);
            }, 'Delete']
    ]);
    diagramUseCase.addElement(objectactor);
    diagramUseCase.draw();
    return objectactor;
}

function selectedActor(obj, modal) {
    obj.removeContextualMenu();
    // variable para obtener datos desde el controlador principal
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();

    if (ac.editionClasDiagram) {
        alertAll({
            "status": 3,
            "information": "You cannot modify the use case diagram while the class diagram editing is active."
        });
        return;
    }

    ac.$apply(function () {
        ac.flag_update = true;
        ac.object_update = obj;
        ac.actor_name = obj.getName();
        ac.utilWebSocket("selectedActor", {"name": obj.getName()});
    });
    $('#modal_actor').modal();
}

function deleteObjectClass(obj, type) {
    obj.removeContextualMenu();
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
            let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
            if (!ac.editionClasDiagram) {
                alertAll({
                    "status": 3,
                    "information": "You cannot modify the class diagram while the class diagram editing is active."
                });
                return;
            }

            let indexobj = [];
            ac.$apply(function () {
                function fromToEquals(relationships, fromRel, toRel) {
                    for (let x = 0; x < relationships.length; x++) {
                        let elementA = relationships[x].from;
                        let elementB = relationships[x].to;
                        if (fromRel === elementA && toRel === elementB) {
                            return [true, x];
                        }
                    }
                    return [false, -1];
                }

                if (type === 4) { // clases
                    indexobj = searchPositionEqualsObject(ac.jsonClass.diagram[0].class, "className", obj.getName().split(" ")[1]);
                    let existRelationFrom = searchPositionEqualsObject(ac.jsonClass.relationships, "from", obj.getName().split(" ")[1]);
                    if (existRelationFrom[0]) {
                        alertAll({status: 3, information: "The selected class cannot be deleted because one of its attributes is being used by another class."});
                    } else {
                        let existRelationTo = searchPositionEqualsObject(ac.jsonClass.relationships, "to", obj.getName().split(" ")[1]);
                        if (existRelationTo[0]) {
                            alertAll({status: 3, information: "The selected class cannot be deleted because one of its attributes is being used by another class."});
                        } else {
                            // eliminar tambien el tipo de dato o la instancia de la clase
                            for (let i = 0; i < ac.data_type.length; i++) {
                                if (ac.data_type[i] === obj.getName().split(" ")[1]) {
                                    ac.data_type.splice(i, 1);
                                }
                            }
                            ac.jsonClass.diagram[0].class.splice(indexobj[1], 1);
                            obj.remove();
                            alertAll({status: 2, information: "Object successfully removed"});
                        }
                    }
                } else if (type === 5) {
                    let fromRel = obj.getElementA().getName().split(" ")[1];
                    let toRel = obj.getElementB().getName().split(" ")[1];
                    let validation = fromToEquals(ac.jsonClass.relationships, fromRel, toRel);
                    let positionClass = searchClass(ac.jsonClass.diagram[0].class, fromRel, toRel); // 0 from - 1 to
                    // elimintar atributo de la clase from
                    deleteAttribute(ac.jsonClass.diagram[0].class[positionClass[0]].attributes,
                            ac.jsonClass.relationships[validation[1]].from_fk);
                    // eliminar atributo de la clase to
                    deleteAttribute(ac.jsonClass.diagram[0].class[positionClass[1]].attributes,
                            ac.jsonClass.relationships[validation[1]].to_fk);
                    if (validation[0]) {
                        let attributesA = obj.getElementA().getComponents();
                        let attributesB = obj.getElementB().getComponents();
                        // eliminamos los atributos desde la parte grafica
                        deleteAttrGraph(attributesA[2]._childs, ac.jsonClass.relationships[validation[1]].from_fk);
                        deleteAttrGraph(attributesB[2]._childs, ac.jsonClass.relationships[validation[1]].to_fk);
                        ac.jsonClass.relationships.splice(validation[1], 1);
                        obj.remove();
                        alertAll({status: 2, information: "Object successfully removed"});
                    }
                }
            });
            diagramClass.draw();
        }

    });
}

function searchClass(array, from, to) {
    let posFrom = -1;
    let posTo = -1;
    for (let x = 0; x < array.length; x++) {
        let className = array[x].className
        if (className === from) {
            posFrom = x;
        } else if (className === to) {
            posTo = x;
        }
    }
    return [posFrom, posTo];
}

function deleteAttribute(attributes, fk) {
    for (let x = 0; x < attributes.length; x++) {
        let attrAux = attributes[x].name;
        if (attrAux === fk) {
            attributes.splice(x, 1);
            return true;
        }
    }
}

function deleteAttrGraph(array, fk) {
    for (let x = 0; x < array.length; x++) {
        let keyForean = array[x]._text.toString().split(" ")[1];
        if (keyForean === fk) {
            array.splice(x, 1);
            return;
        }
    }
}

function deleteObject(obj, type) {
    obj.removeContextualMenu();
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
            let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
            let index = -1;
            let indexobj = [];

            if (ac.editionClasDiagram) {
                alertAll({
                    "status": 3,
                    "information": "You cannot modify the use case diagram while the class diagram editing is active."
                });
                return;
            }

            // 1 casos de uso - 2 actores - 3 relaciones de casos de uso - 4 clases - 5 relaciones de clases
            ac.$apply(function () {
                if (type === 1) {
                    index = searchTabName(ac, obj); // buscar el indice del tab de secuencia del caso de uso
                    indexobj = searchPositionEqualsObject(ac.jsonUseCase.useCase, "name", obj.getName()) // searchObjeEquals(type, ac, obj); // buscar los casos de uso o actores o relaciones
                    if (index !== -1)
                        ac.btnDiagramUml.splice(index, 1);

                    if (indexobj[0]) {
                        ac.jsonUseCase.useCase.splice(indexobj[1], 1);
                        ac.angularSuperInterpret();
                        ac.angularUpdateClassDiagram();
                        obj.remove();

                        alertAll({status: 2, information: "Object successfully removed"});
                        diagramUseCase.draw();
                    } else {
                        alertAll({status: 3, information: "The object you tried to delete could not be found."});
                        diagramUseCase.draw();
                    }
                } else if (type === 2) { // actores
                    indexobj = searchPositionEqualsObject(ac.jsonUseCase.actors, "name", obj.getName()) // searchObjeEquals(type, ac, obj); // buscar los casos de uso o actores o relaciones
                    if (indexobj[0]) {
                        ac.jsonUseCase.actors.splice(indexobj[1], 1);
                        obj.remove();
                        alertAll({status: 2, information: "Object successfully removed"});
                        diagramUseCase.draw();
                    } else {
                        alertAll({status: 3, information: "The object you tried to delete could not be found."});
                        diagramUseCase.draw();
                    }

                } else if (type === 3) { // relaciones de los casos de uso
                    let indexrel = searchObjeEquals(ac, obj); // buscar las relaciones
                    if (indexrel >= 0) {
                        ac.jsonUseCase.relations.splice(indexrel, 1);
                        obj.remove();
                        alertAll({status: 2, information: "Object successfully removed"});
                        diagramUseCase.draw();
                    } else {
                        alertAll({status: 3, information: "The object you tried to delete could not be found."});
                        diagramUseCase.draw();
                    }

                }
            });

        }
    });
}

function searchPositionEqualsObject(array, key, name) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === name) {
            return [true, i];
        }
    }
    return [false, -1];
}

function searchTabName(ac, obj) {
    for (let i = 0; i < ac.btnDiagramUml.length; i++) {

        let namebtn = ac.btnDiagramUml[i].name.split(" - ")[1];

        if (namebtn === undefined)
            namebtn = ac.btnDiagramUml[i].name;
        
        namebtn = getHackDiagram(namebtn)[0].trim();

        let otroname = obj.getName().trim();
        if (namebtn === otroname) {
            return i;
        }
    }
    return -1;
}

function searchObjeEquals(ac, obj) {
    let relations = ac.jsonUseCase.relations;
    for (let x = 0; x < relations.length; x++) {
        let rel_find = relations[x].obj_relation;
        if (rel_find.getId() === obj.getId()) {
            return x;
        }
    }
    return -1;
}

function createUseCase(attributes) {
    let objectcase = new UMLUseCase({x: 670, y: attributes.pos_Y, background: '#FFC66D'});
    diagramUseCase.addElement(objectcase);
    objectcase.setName(attributes.name);
    objectcase.setWidth(attributes.name.length * 12);
    diagramUseCase.draw();
    objectcase.setMenu([
        [function () {
                selectedUseCase(objectcase, true);
            }, 'Update'],
        [function () {
                deleteObject(objectcase, 1);
            }, 'Delete'],
        [function () {
                viewUseCase(node);
            }, 'View']
    ]);
    return objectcase;
}

function viewUseCase(obj) {
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
    obj.removeContextualMenu();
    ac.$apply(function () {
        //buscar la descripcion del caso de uso seleccionado
        for (let index_X = 0; index_X < ac.jsonUseCase.useCase.length; index_X++) {
            if (ac.jsonUseCase.useCase[index_X].obj_usecase.getName() === undefined) {
                if (ac.jsonUseCase.useCase[index_X].name_i === obj.getName()) {
                    ac.encontrado = index_X;
                }
            } else {
                if (ac.jsonUseCase.useCase[index_X].obj_usecase.getName() === obj.getName()) {
                    ac.encontrado = index_X;
                }
            }
        }
    });

    let relations_usecase = obj.getRelations();
    //preguntamos si el caso de uso esta realcionado con algun actor
    if (relations_usecase.length > 0) {
        let encontrado = -1;
        ac.$apply(function () {
            ac.actorsUseCase.length = 0;
            //buscamos los actores que estan relacionados con el actor
            for (let index_Y = 0; index_Y < relations_usecase.length; index_Y++) {
                if (relations_usecase[index_Y]._elemA._type === "UMLActor") {
                    ac.actorsUseCase.push({
                        "obj_actor": relations_usecase[index_Y]._elemA,
                        "name": relations_usecase[index_Y]._elemA.getName()
                    });
                }
            }
        });
    } else {

    }

    $('#modal_view_usecase').modal();
}

function selectedUseCase(obj, flag) {
    // variable para obtener datos desde el controlador principal
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
    if (ac.editionClasDiagram) {
        alertAll({
            "status": 3,
            "information": "You cannot modify the use case diagram while the class diagram editing is active."
        });
        return;
    }

    obj.removeContextualMenu();
    ac.$apply(function () {
        ac.flag_update = true;

        ac.object_update = obj;
        //buscar la descripcion del caso de uso seleccionado
        for (let index_X = 0; index_X < ac.jsonUseCase.useCase.length; index_X++) {
            if (ac.jsonUseCase.useCase[index_X].obj_usecase.getName() === undefined) {
                if (ac.jsonUseCase.useCase[index_X].name_i === obj.getName()) {
                    ac.encontrado = index_X;
                }
            } else {
                if (ac.jsonUseCase.useCase[index_X].obj_usecase.getName() === obj.getName()) {
                    ac.encontrado = index_X;
                }
            }
        }

        //mostrar los datos al usuario
        ac.usecase_name = ac.jsonUseCase.useCase[ac.encontrado].name;
        ac.usecase_name_i = ac.jsonUseCase.useCase[ac.encontrado].obj_usecase.getName();
        ac.usecase_porpuse = ac.jsonUseCase.useCase[ac.encontrado].porpuse;
        ac.usecase_porpuse_i = ac.jsonUseCase.useCase[ac.encontrado].porpuse_i;
        ac.usecase_precondition = ac.jsonUseCase.useCase[ac.encontrado].pre_condition;
        ac.usecase_precondition_i = ac.jsonUseCase.useCase[ac.encontrado].pre_condition_i;
        ac.usecase_postcondition = ac.jsonUseCase.useCase[ac.encontrado].post_condition;
        ac.usecase_postcondition_i = ac.jsonUseCase.useCase[ac.encontrado].post_condition_i;
        ac.usecase_description_interpret = ac.jsonUseCase.useCase[ac.encontrado].description_interpret;
        ac.usecase_description_original = ac.jsonUseCase.useCase[ac.encontrado].description_original;

        //escenario principal y flujo alternativo del caso de uso
        ac.manager_maf.main_stage = Object.assign([], ac.jsonUseCase.useCase[ac.encontrado].main_stage);
        ac.manager_maf.alternative_flow = Object.assign([], ac.jsonUseCase.useCase[ac.encontrado].alternative_flow);

        //datos para el diagrama de secuencia
        ac.table_normal_flow = Object.assign([], ac.jsonUseCase.useCase[ac.encontrado].secuence_data.table_normal_flow);
        ac.table_loop = Object.assign([], ac.jsonUseCase.useCase[ac.encontrado].secuence_data.table_loop);
        ac.table_alternative_if = Object.assign([], ac.jsonUseCase.useCase[ac.encontrado].secuence_data.table_alternative_if);
        ac.table_alternative_else = Object.assign([], ac.jsonUseCase.useCase[ac.encontrado].secuence_data.table_alternative_else);
        if (flag)
            ac.utilWebSocket("selectedUseCase", {"position": ac.encontrado});
    });
    let relations_usecase = obj.getRelations();
    //preguntamos si el caso de uso esta realcionado con algun actor
    if (relations_usecase.length > 0) {
        console.log("tiene relacion");
        let encontrado = -1;
        ac.$apply(function () {
            ac.actorsUseCase.length = 0;
            //buscamos los actores que estan relacionados con el actor
            for (let index_Y = 0; index_Y < relations_usecase.length; index_Y++) {
                ac.actorsUseCase.push({
                    "obj_actor": relations_usecase[index_Y]._elemA,
                    "name": relations_usecase[index_Y]._elemA.getName()
                });
            }
        });
        console.log(ac.actorsUseCase);
    } else {
        console.log("no tiene relacion");
    }
    if (flag)
        $('#modal_usecase').modal();
}

function createRelation(attributes) {
    let rel = new attributes.type({a: attributes.a, b: attributes.b});
    rel.setMenu([
        [function () {
                deleteObject(rel, 3);
            }, 'Delete']
    ]);
    diagramUseCase.addElement(rel);
    diagramUseCase.draw();
    return rel;
}

// funcion para eliminar una relacion seleccionada
function deleteRelation(rel) {
    console.log("voy eliminar la relacion de tipo: ", rel.getId());
    // variable para obtener datos desde el controlador principal
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
    let relations = ac.jsonUseCase.relations;
    for (let x = 0; x < relations.length; x++) {
        let rel_find = relations[x].obj_relation;
        if (rel_find.getId() === rel.getId()) {
            obj.remove();
            relations.splice(x, 1);
        }
    }
    console.log(ac.jsonUseCase);
}

function createSystem(projectName) {
    system = new UMLSystem({x: 460, y: 65, background: '#fff'});
    system.setHeight(460);
    system.setWidth(530);
    system.setName(projectName);
    //no cambie de tamanio
    system.setMoveable();

    system.setMenu([]);

    /**
     * [function () {
     *             alertAll({"status": 3, "information": "No options."});
     *         }, '---'],
     * */

    diagramUseCase.addElement(system);
    diagramUseCase.draw();
}

/***
 * ##############################################################################################################
 * FIN DEL BLOQUE DE CODIGO PARA LAS HERRAMIENTAS DE CASO DE USO
 * ##############################################################################################################
 * */

/**
 * ##############################################################################################################
 * INICIO BLOQUE DE CODIGO PARA LAS HERRAMIETNAS DE DIAGRAMA DE CLASE
 * ##############################################################################################################
 * */

function cretaePackcage(attributes) {
    let newpackage = new UMLPackage({x: attributes.x, y: attributes.y});
    newpackage.setName(attributes.name);
    diagramClass.addElement(newpackage);
    //diagramClass.draw();
    return newpackage;
}

function createClass(attributes) {
    let newclass = new UMLClass({x: attributes.x, y: attributes.y});
    newclass.setName(attributes.name);
    newclass.setMenu([
        [function () {
                selectedClass(newclass);
            }, 'Update'],
        [function () {
                deleteObjectClass(newclass, 4); // 4 clases
            }, 'Delete']
    ]);
    diagramClass.addElement(newclass);
    //diagramClass.draw();
    return newclass;
}

function createEnum(attributes) {
    let newenum = new UMLClass({x: attributes.x, y: attributes.y});
    newenum.setName(attributes.name);
    var color = '#B6E2B5';
    newenum.setBackgroundColor(color); // verde claro
    //newenum.addComponent(new Text({text: "\xABcomponent\xBB", centered: true}));
    newenum.addStereotype("enumeration");
    //newenum.setStereotype("enumeration")
    newenum.setMenu([
        [function () {
                selectedClass(newenum);
            }, 'Update'],
        [function () {
                deleteObjectClass(newenum, 4); // 4 clases
            }, 'Delete']
    ]);
    diagramClass.addElement(newenum);
    //diagramClass.draw();
    return newenum;
}

function selectedClass(node) {
    node.removeContextualMenu();
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
    if (!ac.editionClasDiagram) {
        alertAll({
            "status": 3,
            "information": "You cannot modify the class diagram while the class diagram editing is active."
        });
        return;
    }
    let nameClass = node.getName().split(" ")[1];
    let flag = false;
    // buscar el objeto de la clase en el json del diagrama de clases
    for (let x = 0; x < ac.jsonClass.diagram[0].class.length; x++) {
        let obj = ac.jsonClass.diagram[0].class[x];
        if (nameClass === obj["className"]) {
            flag = true;
            ac.$apply(() => {
                ac.positionClass = x;
            });
        }
    }
    // una vez que se encontro la clase se procede a sacar sus datos
    if (flag && ac.positionClass !== -1) {
        let classSelected = ac.jsonClass.diagram[0].class[ac.positionClass];
        ac.$apply(() => {
            ac.updateClass = true;
            ac.nc_classname = classSelected["className"];
            ac.nc_visibility = classSelected["visibility"];
            // atributos
            ac.attributes = Object.assign([], classSelected["attributes"]);
            // mettodos
            ac.methods = Object.assign([], classSelected["methods"]);
            for (let i = 0; i < ac.methods.length; i++) {
                let method = Object.assign([], ac.methods[i]);
                ac.paramMethods = Object.assign([], method["parameters"]);
                method["parameters"] = ac.paramMethods;
            }
        });
        $("#modal_newclass").modal("show");
    }
}

function createInterface(attributes) {
    let newinterface = new UMLClass({x: attributes.x, y: attributes.y});
    newinterface.setName(attributes.name);
    var color = '#DDF3FE';
    newinterface.setBackgroundColor(color); // azul claro
    newinterface.addStereotype("interface");
    newinterface.setMenu([
        [function () {
                selectedClass(newinterface);
            }, 'Update'],
        [function () {
                //deleteObjectClass(diagramClass);
            }, 'Delete']
    ]);
    diagramClass.addElement(newinterface);
    //diagramClass.draw();
    return newinterface;
}

function createRelationClass(attributes) {
    let rel;

    if (attributes.a === undefined || attributes.b === undefined) {
        return rel;
    }

    if (attributes.typeRelatioship === "generalization") {
        //rel = new attributes.type({a: attributes.a, b: attributes.b});
        rel = new UMLAssociation({a: attributes.a, b: attributes.b});
        rel.setEnd(new CloseTip());
    } else if (attributes.typeRelatioship === "dependency") {
        rel = new UMLAssociation({a: attributes.a, b: attributes.b});
        rel.setLine(new DashedLine());
        rel.setEnd(new OpenTip());
    } else if (attributes.typeRelatioship === "association" && attributes.type === undefined) {
        rel = new UMLAssociation({a: attributes.a, b: attributes.b});
    } else {
        rel = new attributes.type({a: attributes.a, b: attributes.b});
    }
    rel.setMenu([
        [function () {
                deleteObjectClass(rel, 5);
            }, 'Delete'],
        [function () {
                editLegend(rel);
            }, 'Edit legend']
    ]);

    if (attributes.value !== "")
        rel.addStereotype(attributes.value);

    rel.setRoleA(attributes.card_A);
    rel.setRoleB(attributes.card_B);
    diagramClass.addElement(rel);
    //diagramClass.draw();
    return rel;
}

function editLegend(node) {
    node.removeContextualMenu();
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();

    if (!ac.editionClasDiagram) {
        alertAll({
            "status": 3,
            "information": "You cannot modify the class diagram while the class diagram editing is active."
        });
        return;
    }
    ac.$apply(() => {
        ac.selectedClass = node;
        $("#modal_update_legend").modal("show");
    });

}

function updateLegendTools(node, text) {
    node._stereotype._childs[0]._text = text;
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
    let fromRel = node.getElementA().getName().split(" ")[1];
    let toRel = node.getElementB().getName().split(" ")[1];
    if (toRel === undefined) {
        toRel = node.getElementB().getName();
    }

    function fromToEquals(relationships, fromRel, toRel) {
        for (let x = 0; x < relationships.length; x++) {
            let elementA = relationships[x].from;
            let elementB = relationships[x].to;
            if (fromRel === elementA && toRel === elementB) {
                return [true, x];
            }
        }
        return [false, -1];
    }

    let validation = fromToEquals(ac.jsonClass.relationships, fromRel, toRel);
    ac.jsonClass.relationships[validation[1]].value = text;
    diagramClass.draw();
    $("#modal_update_legend").modal("hide");
}

function deleteElement(element) {
    diagramClass.delElement(element);
}

function deleteElementSecuence(element, diagram) {
    diagram.delElement(element);
}


/**
 * ##############################################################################################################
 * FIN BLOQUE DE CODIGO PARA LAS HERRAMIETNAS DE DIAGRAMA DE CLASE
 * ##############################################################################################################
 * */


/**
 * ##############################################################################################################
 * INICIO BLOQUE DE CODIGO PARA LAS HERRAMIETNAS DE DIAGRAMA DE SECUENCIA
 * ##############################################################################################################
 * */

var xlifeline = -130;
var ysendmessage = 70;

function newLifeLine(attributes) { //objeto
    let lifeline = new UMLLifeline({x: xlifeline += 200, y: 70});
    lifeline.setName(attributes.name);
    lifeline.notifyChange();
    attributes.diagram.addElement(lifeline);
    return lifeline;
}

function asynchronousMessage(attributes) { //mensaje asincrono
    let sendmessage = new UMLSendMessage({a: attributes.a, b: attributes.b, y: ysendmessage += 50});
    sendmessage.setName(attributes.name);
    sendmessage.notifyChange();
    attributes.diagram.addElement(sendmessage);
    return sendmessage;
}

function synchronousMessage(attributes) { //mensaje sincronico
    let sendmessage = new UMLCallMessage({a: attributes.a, b: attributes.b, y: ysendmessage += 50});
    sendmessage.setName(attributes.name);
    sendmessage.notifyChange();
    attributes.diagram.addElement(sendmessage);
    return sendmessage;
}

function asynchronousSynchronousResponse(attributes) { //respuesta asincrona y sincronica
    let replymessage = new UMLReplyMessage({a: attributes.a, b: attributes.b, y: ysendmessage += 80});
    replymessage.setName(attributes.name);
    replymessage.notifyChange();
    attributes.diagram.addElement(replymessage);
    return replymessage;
}

function loop(attributes) {
    let loop = new UMLLoop({x: attributes.x, y: attributes.y});
    loop.setGuard(attributes.condition);
    loop.setWidth(400);
    loop.setHeight(150);
    loop.notifyChange();
    attributes.diagram.addElement(loop);
}

function laternative(attributes) {
    let alternative = new UMLAlternative({x: attributes.x, y: attributes.y});
    alternative.setWidth(300);
    alternative.getNodeChilds()[0].setGuard(attributes.if);
    alternative.getNodeChilds()[1].setGuard(attributes.else);
    alternative.notifyChange();
    attributes.diagram.addElement(alternative);
}

function searchObjectTool(typeDiagram, name) {
    let nodes = [];
    if (typeDiagram === "UMLUseCaseDiagram") {
        nodes = diagramUseCase._nodes;
        for (let x = 0; x < nodes.length; x++) {
            if (nodes[x].getName() === name) {
                return [nodes[x], diagramUseCase];
            }
        }
    } else if (typeDiagram === "UMLClassDiagram") {
        nodes = diagramClass._nodes;
        for (let x = 0; x < nodes.length; x++) {
            if (nodes[x].getName() === name) {
                return [nodes[x], diagramClass];
            }
        }
    }
}
;


/**
 * ##############################################################################################################
 * FIN BLOQUE DE CODIGO PARA LAS HERRAMIETNAS DE DIAGRAMA DE SECUENCIA
 * ##############################################################################################################
 * */
