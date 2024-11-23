"use strict";
var url = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host
        + "/Arduino_Web/ardcli_socket";
var ardWs;
var SessionParams = {};

//console.log(window.location);
console.log(url);
function websocketInit(UserParams) {
    ardWs = new WebSocket(url);
    ardWs.onopen = onOpen;
    ardWs.onclose = onClose;
    ardWs.onmessage = onMessage;
    ardWs.onerror = onError;
    if (UserParams)
    {
        SessionParams.groupid = UserParams;
    }
}
function websocketOpen() {
    try {
        console.log("estado:", ardWs.readyState);
        if (ardWs.readyState === 1)
        {
        }
    } catch (e) {
        console.log("sin ciadas", e);
    }
}
function websocketClose() {
    ardWs.close();
}
function onOpen() {
    console.log("conectado...");
    let objmsg = {
        "header": SessionParams.groupid,
        "content": {
            "name": "Unknown - Anonymous",
            "type": "WebApp"
        },
        "config": "init"
    };
    MessageSend(objmsg);
}
function onClose(evt) {
    console.log("Desconectado...");
    console.log(evt);
}
function onError(event) {
    console.error("Error en el WebSocket detectado:");
    console.log(event);
}
function MessageSend(obj) {
    console.log("enviando...");
    let objmsg = JSON.stringify(obj);
    if (objmsg.length <= 10000450)
    {
        ardWs.send(objmsg);
        console.log("enviand mensaje:sock");
        console.log(objmsg);
    } else {
        alertAll({status: 4, information: "The message exceeds the limit."});
    }
}
function onMessage(evt) {
    var obj = JSON.parse(evt.data);
    console.log(obj);
}