/* global go, angular, Swal */

var goJs;
var myDiagram;
var myDiagramView;
var nodeMenu;
var nodeMenuView;
var UnselectedBrush = "lightgray";  // item appearance, if not "selected"
var SelectedBrush = "dodgerblue";   // item appearance, if "selected"

var keyGroup = 1;

function initViewDiagram () {
    myDiagramView = goJs(go.Diagram, "lienzoView", {
        'isReadOnly': true,
        allowCopy: false,
        "animationManager.isEnabled": false,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        //initialAutoScale: go.Diagram.Uniform,
        //initialContentAlignment: go.Spot.Center,
        scale: 0.3, // extra space when scrolled all the way
        grid: goJs(go.Panel, "Grid", // a simple 10x10 grid
            goJs(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
            goJs(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5})
        )
    });

    nodeMenuView =
        goJs("ContextMenu",
            itemButton("Details",
                function (e, obj) {
                    e.diagram.commandHandler.copySelection();
                    console.log(obj.part.data.spot1);
                    angular.element($('[ng-view]')).scope().selectedPortView(obj.part.data);
                })
        );

    myDiagramView.nodeTemplate =
        goJs(go.Node, "Auto",
            {
                selectionAdorned: false,
                contextMenu: nodeMenuView,
                desiredSize: new go.Size(20, 20)
            },
            {
                mouseDrop: function (e, n) {
                    // when the selection is entirely ports and is dropped onto a Group, transfer membership

                }
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                mouseDrop: function (e, n) {
                    // when the selection is entirely ports and is dropped onto a Group, transfer membership

                }
            },
            goJs(go.Shape,
                {
                    name: "SHAPE",
                    fill: UnselectedBrush, stroke: "red",
                    figure: "Rectangle",
                    spot1: new go.Spot(0, 0, 5, 1), // keep the text inside the shape
                    spot2: new go.Spot(1, 1, -5, 0),
                    // some port-related properties
                    portId: "",
                    toSpot: go.Spot.Left,
                    toLinkable: false,
                    fromSpot: go.Spot.Right,
                    fromLinkable: false,
                    cursor: "pointer",
                },
                new go.Binding("fill", "isSelected", function (s) {
                    return s ? SelectedBrush : UnselectedBrush;
                }).ofObject())
        );

    myDiagramView.groupTemplate =
        goJs(go.Group, "Auto",
            {
                selectionAdorned: false,
                locationSpot: go.Spot.Center, locationObjectName: "ICON",
                movable: false
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
            {routing: go.Link.Orthogonal, corner: 10, toShortLength: -3},
            {relinkableFrom: true, relinkableTo: true},
            goJs(go.Shape, {stroke: "gray", strokeWidth: 2.5})
        );
    myDiagram.grid.gridCellSize = new go.Size(20, 20);
}

function initDiagram() {
    goJs = go.GraphObject.make;
    myDiagram = goJs(go.Diagram, "lienzo", {
        padding: 20,
        allowCopy: false,
        "animationManager.isEnabled": false,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "linkingTool.linkValidation": differentGroups,
        "relinkingTool.linkValidation": differentGroups,
        //initialAutoScale: go.Diagram.Uniform,
        //initialContentAlignment: go.Spot.Center,
        scale: 0.5, // extra space when scrolled all the way
        grid: goJs(go.Panel, "Grid", // a simple 10x10 grid
                goJs(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
                goJs(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5})
                ),
        mouseDrop: function (e) {
            // when the selection is dropped in the diagram's background,
            // and it includes any "port"s, cancel the drop
            if (myDiagram.selection.any(selectionIncludesPorts)) {
                myDiagram.currentTool.doCancel();
            }
        }
    });

    function differentGroups(fromnode, fromport, tonode, toport) {
        return fromnode.containingGroup !== tonode.containingGroup;
    }

    function selectionIncludesPorts(n) {
        return n.containingGroup !== null && !myDiagram.selection.has(n.containingGroup);
    }

    nodeMenu =
            goJs("ContextMenu",
                    itemButton("Parameters",
                            function (e, obj) {
                                e.diagram.commandHandler.copySelection();
                                console.log(obj.part.data.spot1);
                                angular.element($('[ng-view]')).scope().selectedPort(obj.part.data);
                            }),
                    itemButton("Delete",
                            function (e, obj) {
                                console.log(obj.part.data.id);
                                let index = obj.part.data.id;
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
                                        angular.element($('[ng-view]')).scope().deletePort(index);
                                        e.diagram.commandHandler.deleteSelection();
                                        return true;
                                    }
                                    ;
                                });
                            }),
                    itemButton("More Info",
                            function (e, obj) {
                                alert("mas info :v");
                            })
                    );

    myDiagram.nodeTemplate =
            goJs(go.Node, "Auto",
                    {
                        selectionAdorned: false,
                        contextMenu: nodeMenu,
                        desiredSize: new go.Size(20, 20)
                    },
                    {
                        mouseDrop: function (e, n) {
                            // when the selection is entirely ports and is dropped onto a Group, transfer membership
                            if (n.containingGroup !== null && myDiagram.selection.all(selectionIncludesPorts)) {
                                myDiagram.selection.each(function (p) {
                                    p.containingGroup = n.containingGroup;
                                });
                            } else {
                                myDiagram.currentTool.doCancel();
                            }
                        }
                    },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        mouseDrop: function (e, n) {
                            // when the selection is entirely ports and is dropped onto a Group, transfer membership
                            if (n.containingGroup !== null && myDiagram.selection.all(selectionIncludesPorts)) {
                                myDiagram.selection.each(function (p) {
                                    p.containingGroup = n.containingGroup;
                                });
                            } else {
                                myDiagram.currentTool.doCancel();
                            }
                        }
                    },
                    goJs(go.Shape,
                            {
                                name: "SHAPE",
                                fill: UnselectedBrush, stroke: "red",
                                figure: "Rectangle",
                                spot1: new go.Spot(0, 0, 5, 1), // keep the text inside the shape
                                spot2: new go.Spot(1, 1, -5, 0),
                                // some port-related properties
                                portId: "",
                                toSpot: go.Spot.Left,
                                toLinkable: false,
                                fromSpot: go.Spot.Right,
                                fromLinkable: false,
                                cursor: "pointer"
                            },
                            new go.Binding("fill", "isSelected", function (s) {
                                return s ? SelectedBrush : UnselectedBrush;
                            }).ofObject())
                    );


    myDiagram.groupTemplate =
            goJs(go.Group, "Auto",
                    {
                        selectionAdorned: false,
                        locationSpot: go.Spot.Center, locationObjectName: "ICON",
                        movable: false
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
                    {routing: go.Link.Orthogonal, corner: 10, toShortLength: -3},
                    {relinkableFrom: true, relinkableTo: true},
                    goJs(go.Shape, {stroke: "gray", strokeWidth: 2.5})
                    );
    myDiagram.grid.gridCellSize = new go.Size(20, 20);


}

//Inicializar el menu contextual
function itemButton(text, action, flag) {
    return goJs("ContextMenuButton",
            goJs(go.TextBlock, text),
            {click: action},
            flag ? new go.Binding("visible", "", function (o, e) {
                return o.diagram ? flag(o, e) : false;
            }).ofObject() : {});
}
