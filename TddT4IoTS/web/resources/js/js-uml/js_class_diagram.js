/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global mainContext, width, motionContext, height, diagramClass, UMLGeneralization, UMLDependency, UMLAssociation, UMLAggregation */

var elementsClass = [];
var positionsClass = [];
const visibilityGlobal = {
    "public": "+",
    "private": "-",
    "protected": "#",
    "static": "$",
    "abstract": "?",
    "final": "¬",
    "interface": "@"
};

const relationsGlobal = {
    "agregation": UMLAggregation,
    "dependency": UMLDependency,
    "generalization": UMLGeneralization,
    "asociation": UMLAssociation
};

const relationsGlobalname = {
    "agregation": "agregation",
    "dependency": "dependency",
    "generalization": "generalization",
    "asociation": "asociation"
};

function updateClassDiagram(jsonInterprete, action) {
    let ac = angular.element($('[ng-controller="workAreaController"]')).scope();
    if (elementsClass.length > 0) {
        getClassPosition(diagramClass._nodes);
        for (ielement = 0; ielement < elementsClass.length; ielement++) {
            deleteElement(elementsClass[ielement].element);
        }
        elementsClass.length = 0;
    }

    // verificar y eliminar relaciones relaciones redundantes
    let newRelations = deleteRelationsRedundant(jsonInterprete.relationships);
    jsonInterprete.relationships.length = 0;
    jsonInterprete.relationships = Object.assign([], newRelations);

    for (let ipackage = 0; ipackage < jsonInterprete.diagram.length; ipackage++) {
        package = jsonInterprete.diagram[ipackage];
        //let newpackage = cretaePackcage({name: package.packName, x: 50, y: 70});
        //elementsClass.push({"element": newpackage});
        for (let iclass = 0; iclass < package.class.length; iclass++) {
            clas = package.class[iclass];
            ac.data_type.push(clas.className);
            if (clas.modifiers === "interface") {
                newclass = createInterface({
                    name: visibilityGlobal[clas.visibility] + " " + clas.className,
                    x: (Math.floor(Math.random() * 10) * 100),
                    y: (Math.floor(Math.random() * 15) * 30)
                });
            } else {
                newclass = createClass({
                    name: visibilityGlobal[clas.visibility] + " " + clas.className,
                    x: (Math.floor(Math.random() * 10) * 100),
                    y: (Math.floor(Math.random() * 15) * 30)
                });
            }
            //newpackage.addChild(newclass);
            elementsClass.push({"element": newclass});
            for (let iattributes = 0; iattributes < clas.attributes.length; iattributes++) {
                attributes = clas.attributes[iattributes];
                if (attributes.type === "fk" || attributes.type === "enumeration")
                    newclass.addAttribute(visibilityGlobal[attributes.visibility] + " " + attributes.name.toString().trim() + " fk");
                else
                    newclass.addAttribute(visibilityGlobal[attributes.visibility] + " " + attributes.name + ":" + attributes.type);
            }
            for (let imethods = 0; imethods < clas.methods.length; imethods++) {
                methods = clas.methods[imethods];
                newclass.addOperation(visibilityGlobal[methods.visibility] + " " + methods.name + "(" + getParamethers(methods.parameters) + "):" + methods.type);
            }

            for (let imethods = 0; imethods < clas.constructors.length; imethods++) {
                constructor = clas.constructors[imethods];
                newclass.addOperation(visibilityGlobal[constructor.visibility] + " new " + clas.className + "(" + getParamethers(constructor.parameters) + ")");
            }
        }

        for (let ienum = 0; ienum < package.enums.length; ienum++) {
            enumsx = package.enums[ienum];
            newenum = createEnum({
                name: enumsx.name,
                x: (Math.floor(Math.random() * 10) * 100),
                y: (Math.floor(Math.random() * 15) * 30)
            });
            elementsClass.push({"element": newenum, "name": newenum.getName()});
            for (let iattributes = 0; iattributes < enumsx.elements.length; iattributes++) {
                elementsE = enumsx.elements[iattributes];
                newenum.addAttribute(elementsE);
            }
        }
    }
    relationsClass(jsonInterprete.relationships);
    setClassPosition();
    alertAll({"status": 2, "information": "Class diagram successfully updated."});
}

function getClassPosition(elementsClass) {
    for (let i = 0; i < elementsClass.length; i++) {
        positionsClass.push({
            "posx": elementsClass[i]._x, "posy": elementsClass[i]._y, "name": elementsClass[i].getName()
        });
    }
    console.log("POSITION CLASS ", positionsClass);
}

function setClassPosition() {
    let found = false;
    let class_num = 0;
    let position_aux = 0;
    for (let i = 0; i < positionsClass.length; i++) {
        if (class_num === positionsClass.length)
            break;
        
        if (diagramClass._nodes[class_num] !== undefined) {
            console.log(diagramClass._nodes[class_num].getName());
            if (diagramClass._nodes[class_num].getName() === positionsClass[i].name) {
                found = true;
                position_aux = i;
                i = -1;
            }

            if (found) {
                diagramClass._nodes[class_num].position(positionsClass[position_aux].posx, positionsClass[position_aux].posy);
                diagramClass.draw(); 
                class_num++;
                found = false;
            }
        }
    }
    positionsClass.length = 0;
    console.log("DIAGRAMA CLASES: ", diagramClass);
    diagramClass.draw();
}

//funcion para verificar valores unicos
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function deleteRelationsRedundant(relations) {
    if (relations.length > 0) {
        let newRelations = [];
        let relationsSuccess = [];
        for (let positionRelation = 0; positionRelation < relations.length; positionRelation++) {
            let from = relations[positionRelation].from;
            let to = relations[positionRelation].to;
            for (let positionRelationAux = 0; positionRelationAux < relations.length; positionRelationAux++) {
                let fromx = relations[positionRelationAux].from;
                let tox = relations[positionRelationAux].to;
                if (positionRelationAux !== positionRelation) {
                    if ((from === fromx && to === tox) || (from === tox && to === fromx)) {
                        relationsSuccess.push(positionRelationAux);
                    }
                }
            }
        }
        console.log("cantidad de relaciones redundantes: ", relationsSuccess.length);
        let unique_data = [];
        unique_data = relationsSuccess.filter(onlyUnique);
        // agregar las relaciones que no se repitieron
        for (let newRelation = 0; newRelation < relations.length; newRelation++) {
            let relation = relations[newRelation];
            let flag = true;
            for (let positionRedudant = 0; positionRedudant < unique_data.length; positionRedudant++) {
                if (newRelation === unique_data[positionRedudant]) {
                    flag = false;
                }
            }
            if (flag) {
                newRelations.push(relation);
            }
        }
        return newRelations;
    }
}

function relationsClass(relations) {
    for (let irelation = 0; irelation < relations.length; irelation++) {
        if (relations[irelation].from !== undefined && relations[irelation].to !== undefined) {
            let from = getFromToRelation(relations[irelation].from);

            let to = getFromToRelation(relations[irelation].to);
            //let attributes = from.getComponents();
            //console.log("ATRIBUTOS DE LA CLASE FROM", attributes[2]._childs);
            //to.addAttribute(attributes[2]._childs[0]._text);

            if (from === undefined || to === undefined) {
                console.log("NO EXISTEN OBJETOS PARA REALIZAR ESTE TIPO DE RELACION => " + relations[irelation].typeRelatioship);
            } else {
                
                if(relations[irelation].cardinalidate === undefined) {
                    relations[irelation]["cardinalidate"] = "u..u";
                }
                
                if(relations[irelation].from_fk === undefined) {
                    relations[irelation]["from_fk"] = relations[irelation].to.toString().toLowerCase() +":"+ relations[irelation].to;
                }
                
                if(relations[irelation].simbol === undefined) {
                    relations[irelation]["simbol"] = "";
                }
                
                if(relations[irelation].to_fk === undefined) {
                    relations[irelation]["from_fk"] = relations[irelation].from.toString().toLowerCase() +":"+ relations[irelation].from;
                }
                
                if(relations[irelation].value === undefined) {
                    relations[irelation]["value"] = relations[irelation].typeRelatioship;
                }
                
                let relation = createRelationClass({
                    type: relationsGlobal[relations[irelation].typeRelatioship],
                    a: from,
                    b: to,
                    card_A: relations[irelation].cardinalidate.split("..")[0],
                    card_B: relations[irelation].cardinalidate.split("..")[1],
                    value: relations[irelation].value,
                    typeRelatioship: relations[irelation].typeRelatioship
                });
                elementsClass.push({"element": relation});
            }
        }
    }
}

function getFromToRelation(nameClass) {
    for (let i = 0; i < elementsClass.length; i++) {
        let getNameClass = elementsClass[i].element.getName();
        console.log("nombre de clase agregada ", getNameClass);
        if (getNameClass.includes(" ")) {
            if (getNameClass.split(" ")[1] === nameClass) {
                return elementsClass[i].element;
            }
        } else {
            if (getNameClass === nameClass) {
                return elementsClass[i].element;
            }
        }

    }
}

function getParamethers(parameters) {
    let rparam = "";
    if (parameters.length > 0) {
        for (let i = 0; i < parameters.length; i++) {
            if (i === parameters.length - 1) {
                rparam += parameters[i].name + ":" + parameters[i].type;
            } else {
                rparam += parameters[i].name + ":" + parameters[i].type + ",";
            }
        }
    }
    return rparam;
}

function getParamethersReplace(parameters) {
    let rparam = "";
    if (parameters.length > 0) {
        for (let i = 0; i < parameters.length; i++) {
            if (i === parameters.length - 1) {
                rparam += parameters[i].name + ":" + parameters[i].type.replace("string:", "");
            } else {
                rparam += parameters[i].name + ":" + parameters[i].type.replace("string:", "") + ",";
            }
        }
    }
    return rparam;
}







