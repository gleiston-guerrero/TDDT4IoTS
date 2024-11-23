/* global go, i, rutasStorage, angular, Swal */

var myDiagram;
var myPalette;
var goJs;
var nodeMenu;
var lineMenu;
var objpos = [];
var clearDiagram = true;

var UnselectedBrush = "lightgray";  // item appearance, if not "selected"
var SelectedBrush = "dodgerblue";   // item appearance, if "selected"

//function para inicializar los tooltip de los componentes de boostrap
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//Inicializar el diagrama
function initDiagramProject() {
    // diagram.isReadOnly = true; // solo lectura
    goJs = go.GraphObject.make;
    myDiagram = goJs(go.Diagram, "lienzo", {
        padding: 20,
        allowCopy: false,
        "animationManager.isEnabled": false,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        scale: 0.5, // extra space when scrolled all the way
        grid: goJs(go.Panel, "Grid", // a simple 10x10 grid
                goJs(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
                goJs(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5})
                )});
    myDiagram.layoutDiagram(false);

    nodeMenu =
            goJs("ContextMenu",
                    itemButton("Configuration and parameterization",
                            function (e, obj) {
                                e.diagram.commandHandler.copySelection();
                                //alert("Construction zone");
                                console.log(obj.part.data);
                                console.log(myDiagram.model.linkDataArray);
                                angular.element($('[ng-controller="controllerWorkIoT"]')).scope()
                                        .getParametersBD(obj.part.data, myDiagram.model.linkDataArray);
                            }),
                    itemButton("Delete component",
                            function (e, obj) {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "All data entered will be permanently deleted.!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete it.'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        e.diagram.commandHandler.deleteSelection();
                                        return true;
                                    }
                                    ;
                                });
                            })
                    );

    lineMenu =
            goJs("ContextMenu",
                    itemButton("Delete",
                            function (e, obj) {
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
                                        e.diagram.commandHandler.deleteSelection();
                                        return true;
                                    }
                                    ;
                                });
                            })
                    );

    myDiagram.nodeTemplate =
            goJs(go.Node, "Auto",
                    {
                        selectionAdorned: false,
                        contextMenu: nodeMenu,
                        desiredSize: new go.Size(20, 20)
                                //movable: false
                    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    goJs(go.Shape,
                            {
                                name: "SHAPE",
                                fill: "transparent",
                                stroke: "transparent",
                                strokeWidth: 5,
                                figure: "Rectangle",
                                /*spot1: new go.Spot(0, 0, 5, 1), // keep the text inside the shape
                                 spot2: new go.Spot(1, 1, -5, 0),*/
                                // some port-related properties
                                portId: "",
                                fromSpot: new go.Spot(0.50, 0.25), toSpot: new go.Spot(0.50, 0.25),
                                toLinkable: true,
                                fromEndSegmentLength: 0, toEndSegmentLength: 0,
                                fromLinkable: true,
                                cursor: "pointer",
                                mouseEnter: function (e, port) {
                                    if (!e.diagram.isReadOnly) {
                                        port.fill = "red";
                                        port.stroke = "black";
                                    }
                                },
                                mouseLeave: function (e, port) {
                                    port.fill = "transparent";
                                    port.stroke = "transparent";
                                }
                            }
                    ));


    myDiagram.groupTemplate =
            goJs(go.Group, "Auto",
                    {
                        selectionAdorned: false,
                        locationSpot: go.Spot.Center, locationObjectName: "ICON",
                        //movable: false,
                        contextMenu: nodeMenu,
                        cursor: "move"
                    },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    goJs(go.Shape, "RoundedRectangle",
                            {stroke: "gray", strokeWidth: 1, fill: "transparent"},
                            new go.Binding("stroke", "isSelected", function (b) {
                                return b ? SelectedBrush : UnselectedBrush;
                            }).ofObject()),
                    goJs(go.Panel, "Vertical",
                            {margin: 0},
                            goJs(go.Panel, "Spot",
                                    {name: "ICON"}, // an initial height; size will be set by InputOutputGroupLayout
                                    goJs(go.Shape,
                                            {fill: null, stroke: null, stretch: go.GraphObject.Fill}),
                                    goJs(go.Picture,
                                            new go.Binding("source", "img"), {})
                                    )
                            )
                    );


    myDiagram.linkTemplate =
            goJs(go.Link,
                    {
                        contextMenu: lineMenu,
                        routing: go.Link.Orthogonal,
                        curve: go.Link.JumpOver,
                        reshapable: true,
                        resegmentable: true,
                        relinkableFrom: true, relinkableTo: true,
                        selectionAdorned: true,
                        adjusting: go.Link.End,
                        corner: 5,
                        mouseEnter: function (e, link) {
                            //link.elt(0).stroke = "rgba(140, 0, 50)";
                        },
                        mouseLeave: function (e, link) {
                            //link.elt(0).stroke = "transparent";
                        }
                    },
                    //{ routing: go.Link.Orthogonal },  // optional, but need to keep LinkingTool.temporaryLink in sync, above
                    //{adjusting: go.Link.Stretch}, // optional
                    new go.Binding("points").makeTwoWay(),
                    //goJs(go.Shape, { strokeWidth: 1.5 }),
                    //goJs(go.Shape, {toArrow: "OpenTriangle"}),
                    goJs(go.Shape, new go.Binding("stroke", "color"), {isPanelMain: true, strokeWidth: 10}))
            /*goJs(go.Shape, {isPanelMain: true, stroke: "blue", strokeWidth: 8})*/ //rgba(140, 0, 50)
            /*goJs(go.Shape, {scale: 2, fill: "rgba(140, 0, 50)", strokeWidth: 0, fromArrow: "Circle"}),
             goJs(go.Shape, {scale: 2, fill: "rgba(140, 0, 50)", strokeWidth: 0, toArrow: "Circle"}))*/;

    //VALIDACION DE LA CONEXION A LOS PUERTOS
    myDiagram.toolManager.relinkingTool.linkValidation = function (fromnode, fromport, tonode, toport, link) {
        console.log(fromport.jb.portId);
        console.log(toport.jb.portId);
        alert("desde: " + fromport.data.key + "hasta: " + toport.data.key);
        return fromport.jb.portId === "Gnd";
    }

    goJs(go.Overview, "overView", {
        observed: myDiagram
    });

    myDiagram.undoManager.isEnabled = true;
    myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
    myDiagram.grid.gridCellSize = new go.Size(20, 20);
    myDiagram.toolManager.toolTipDuration = 5000;

    console.log(myDiagram.model.nodeDataArray);

    myDiagram.mouseDrop = function (e) {
        //console.log(myDiagram.model.part)
        console.log(myDiagram.selection);
        console.log(myDiagram.model.nodeDataArray);
        console.log(myDiagram.model.nodeDataArray[myDiagram.model.nodeDataArray.length - 1]);
        //angular.element($('[ng-controller="controllerWork"]')).scope().sendModel();
    };
}

searchModel = (json_structure_iot_device) => {
    let model_loader = JSON.parse(json_structure_iot_device);
    if (!isObjEmpty(model_loader)) {
        if (model_loader.nodeDataArray.length > 0) {
            loadModel(JSON.parse(json_structure_iot_device));
        } else {
            myDiagram.clear();
        }
    }
};

loadModel = (datajson_iot) => {
    var modelNew = new go.GraphLinksModel();

    modelNew.nodeIsGroupProperty = "_isg";
    modelNew.nodeGroupKeyProperty = "_g";

    let components = datajson_iot.nodeDataArray;
    for (let i = 0; i < components.length; i++) {
        let nodedata = components[i];
        nodedata._isg = true;
        //nodedata.loc = "0 0";
        /*let newKey = nodedata.key.toString();
         newKey += "loader";
         console.log(newKey);
         nodedata.key = newKey;*/
        for (let iports = 0; iports < nodedata.ports.length; iports++) {
            nodedata.ports[iports]._g = nodedata.key;
        }

        console.log(nodedata.ports);
        modelNew.addNodeDataCollection(components);
        modelNew.addNodeDataCollection(nodedata.ports);
    }

    modelNew.addLinkDataCollection(datajson_iot.linkDataArray);
    myDiagram.model = modelNew;
};

//Inicializar el menu contextual
function itemButton(text, action, flag) {
    return goJs("ContextMenuButton",
            goJs(go.TextBlock, text),
            {click: action},
            flag ? new go.Binding("visible", "", function (o, e) {
                return o.diagram ? flag(o, e) : false;
            }).ofObject() : {});
}

function initContextMenu() {
    myDiagram.contextMenu = goJs("ContextMenu",
            itemButton("Paste",
                    function (e, obj) {
                        e.diagram.commandHandler.pasteSelection(e.diagram.toolManager.contextMenuTool.mouseDownPoint);
                    },
                    function (o) {
                        return o.diagram.commandHandler.canPasteSelection(o.diagram.toolManager.contextMenuTool.mouseDownPoint);
                    }),
            itemButton("Undo",
                    function (e, obj) {
                        e.diagram.commandHandler.undo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUndo();
                    }),
            itemButton("Redo",
                    function (e, obj) {
                        e.diagram.commandHandler.redo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canRedo();
                    })
            );
}

//Inicializar la paleta de los componentes
function initPalette() {
    myPalette = goJs(go.Palette, "myPalette",
            {// customize the GridLayout to align the centers of the locationObjects
                layout: goJs(go.GridLayout,
                        {alignment: go.GridLayout.Location}),
            });

    myPalette.nodeTemplate =
            goJs(go.Node, "Auto",
                    {
                        selectionAdorned: false,
                        contextMenu: nodeMenu,
                        desiredSize: new go.Size(20, 20),
                        visible: false,
                        //movable: false
                    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    goJs(go.Shape,
                            {
                                name: "SHAPE",
                                fill: "red", stroke: "red",
                                figure: "RoundedRectangle",
                                spot1: new go.Spot(0, 0, 5, 1), // keep the text inside the shape
                                spot2: new go.Spot(1, 1, -5, 0),
                                // some port-related properties
                                portId: "",
                                toSpot: go.Spot.Left,
                                toLinkable: true,
                                fromSpot: go.Spot.Right,
                                fromLinkable: true,
                                cursor: "pointer",
                                mouseEnter: function (e, port) {
                                    if (!e.diagram.isReadOnly)
                                        port.fill = "red";
                                },
                                mouseLeave: function (e, port) {
                                    port.fill = "transparent";
                                }
                            })
                    );


    myPalette.groupTemplate =
            goJs(go.Group, "Horizontal",
                    {
                        name: "toolTdd",
                        selectionAdorned: false,
                        locationSpot: go.Spot.Center, locationObjectName: "ICON",
                        padding: 0,
                        background: "#F1F1F3",
                        cursor: "grab", width: 245, margin: new go.Margin(100, 10, 0, 10),
                        mouseEnter: function (e, toolTdd) {
                            toolTdd.background = "white";
                        },
                        mouseLeave: function (e, toolTdd) {
                            toolTdd.background = "#F1F1F3";
                        }
                        //movable: false,
                    },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    goJs(go.Panel, "Vertical", go.Panel.Viewbox,
                            {width: 70, height: 70, margin: new go.Margin(0, 5, 0, 20), background: "white", padding: 5},
                            goJs(go.Panel, "Spot",
                                    {name: "ICON"}, // an initial height; size will be set by InputOutputGroupLayout

                                    goJs(go.Picture,
                                            new go.Binding("source", "img"), new go.Binding("width", "widthX"),
                                            new go.Binding("height", "heightX"),
                                            {/*imageAlignment: go.Spot.Left*/margin: new go.Margin(0, 0, 0, 0)

                                            }),
                                    )
                            ),
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    goJs(go.Panel, "Vertical", {
                        width: 160,
                        height: 100,
                        padding: 0, background: "#F1F1F3"},
                            goJs(go.TextBlock, {name: "TBE"},
                                    new go.Binding("text", "name"), {
                                font: "bold  12px Roboto Mono",
                                textAlign: "left", margin: new go.Margin(20, 0, 5, 0), width: 120,

                            }),
                            goJs(go.TextBlock, {name: "TBD"},
                                    new go.Binding("text", "description"), {
                                font: "9px Roboto Mono",
                                textAlign: "left", margin: new go.Margin(0, 10, 0, 10), width: 120,
                                mouseEnter: function (e, TBD) {
                                    TBD.stroke = "#87D5FF";
                                },
                                mouseLeave: function (e, TBD) {
                                    TBD.stroke = "black";
                                }
                            })
                            )
                    );
}

//Cargar los datos de los componentes(funcion que debe servir para el webSocket)
function loadComponents(obj) {
    console.log(myDiagram.model);
    let components = [];
    let ports = [];

    var model = new go.GraphLinksModel();
    var modelPalet = new go.GraphLinksModel();

    myDiagram.model.nodeIsGroupProperty = "_isg";
    myDiagram.model.nodeGroupKeyProperty = "_g";

    modelPalet.nodeIsGroupProperty = "_isg";
    modelPalet.nodeGroupKeyProperty = "_g";

    for (let i = 0; i < obj.data.length; i++) {
        components.push({
            //key: obj.data[i].id_component,
            img: rutasStorage.components + obj.data[i].pathimg_component + "/component.png",
            name: obj.data[i].name_component,
            type: obj.data[i].type_component,
            description: obj.data[i].description_component.length > 100 ? obj.data[i].description_component.toString().substring(0, 99) : obj.data[i].description_component,
            key: obj.data[i].id_component,
            loc: "0 0",
            _isg: true,
            "ports": getPorts(obj.data[i]),
            "code": obj.data[i].data_json.code
        });

        //myDiagram.model.addNodeDataCollection(components);
        //myDiagram.model.addNodeDataCollection(components[i].ports);

        modelPalet.addNodeDataCollection(components);
        modelPalet.addNodeDataCollection(components[i].ports);

        //components[i].ports = undefined;
    }
    //myDiagram.clear();
    myPalette.model = modelPalet;
}

getPorts = (param_ports) => {
    let ports = [];
    console.log(param_ports.data_json.parameters);
    let ports_param = param_ports.data_json.parameters;
    if (ports_param !== undefined) {
        for (let i = 0; i < ports_param.length; i++) {
            ports.push({
                "key": ports_param[i].name_port + "-" + param_ports.id_component,
                "name_port": ports_param[i].name_port,
                "digital": ports_param[i].digital,
                "analog": ports_param[i].analog,
                "data": ports_param[i].data,
                "loc": ports_param[i].loc,
                "energy": ports_param[i].energy,
                "min": ports_param[i].min,
                "max": ports_param[i].max,
                "idComponent": param_ports.id_component,
                "_g": param_ports.id_component
            });
        }
    }

    return ports;

};

myCallback = (blob) => {
//    var url = window.URL.createObjectURL(blob);
//    var filename = "IoT_Design.png";
//
//    var a = document.createElement("a");
//    a.style = "display: none";
//    a.href = url;
//    a.download = filename;
//
//    // IE 11
//    if (window.navigator.msSaveBlob !== undefined) {
//        window.navigator.msSaveBlob(blob, filename);
//        return;
//    }
//
//    document.body.appendChild(a);
//    requestAnimationFrame(function () {
//        a.click();
//        window.URL.revokeObjectURL(url);
//        document.body.removeChild(a);
//    });



    console.log(blob);

    let img = new Image();
    img.src = blob;
    img.onload = () => {
        let me_canvas = document.createElement('canvas');
        let ctx = me_canvas.getContext("2d");
        me_canvas.width = img.width;
        me_canvas.height = img.height;

        const marca = new Image();
        ctx.drawImage(img, 0, 0, img.width, img.height);
        marca.src = "resources/img/logo-app/logoGraficosicon.png";
        marca.onload = () => {
            let marcaLen = [
                150,
                90,
                me_canvas.width,
                me_canvas.height];
            ctx.drawImage(marca, 10,
                    marcaLen[3] - marcaLen[1] - 10,
                    marcaLen[0], marcaLen[1]);

            let link = document.createElement('a');
            link.download = 'TddM4IoTs_IoT.png';
            link.href = me_canvas.toDataURL();
            link.click();
        };
    };
};

makeBlob = () => {
    var blob = myDiagram.makeImageData({background: "white", returnType: "image/jpeg", callback: myCallback});
};
