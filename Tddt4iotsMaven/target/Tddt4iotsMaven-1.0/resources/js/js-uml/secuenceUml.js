/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let elements = [];

function updateSecuenceDiagram(diagram, jsonData) {

    if (elements.length > 0) {
        for (ielement = 0; ielement < elements.length; ielement++) {
            deleteElementSecuence(elements[ielement].element, diagram);
        }
        elements.length = 0;
        xlifeline = -130;
        ysendmessage = 50;
    }
    
    let flujealternative = jsonData.table_normal_flow;
    if (flujealternative.length > 0) {
        for (let ifluje = 0; ifluje < flujealternative.length; ifluje++) {
            let object = flujealternative[ifluje];
            //crear los objetos
            let searchFrom = searchLife(diagram, object.from);
            let searchto = searchLife(diagram, object.to);

            let from = searchFrom === undefined ? newLifeLine({diagram: diagram, name: object.from}) : searchFrom;
            let to = searchto === undefined ? newLifeLine({diagram: diagram, name: object.to}) : searchto;

            elements.push({element: from});
            elements.push({element: to});

            let message = {};
            let response = {};
            //mensajes asincronos y sincronas
            if (object.message !== "") {
                if (object.message_type === "async_message") { //si es asincrono
                    message = asynchronousMessage({diagram: diagram, name: object.message, a: from, b: to});
                } else {
                    message = synchronousMessage({diagram: diagram, name: object.message, a: from, b: to});
                }
            }

            //respuestas asincronas y sincronas
            if (object.response !== "") {
                if (object.response_type === "async_response") { // para todos los casos
                    response = asynchronousSynchronousResponse({diagram: diagram, name: object.response, a: message.getElementB(), b: from});
                } else {
                    response = asynchronousSynchronousResponse({diagram: diagram, name: object.response, a: to, b: from});
                }
            }

            elements.push({element: message});
            elements.push({element: response});
        }
    }
}

function searchLife(diagram, name) {
    let nodes = diagram._nodes;
    if (nodes.length > 0) {
        for (let inode = 0; inode < nodes.length; inode++) {
            let node = nodes[inode];
            if (node._type === "UMLLifeline") {
                let namenode = node.getName();
                if (name === namenode) {
                    return node;
                }
            }
        }
    }
}


