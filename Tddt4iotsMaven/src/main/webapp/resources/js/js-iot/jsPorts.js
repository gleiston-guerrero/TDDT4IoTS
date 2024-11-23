/* global go */

//puertos para el protoboard
function createPortsProhoboard(objectPortsProhoboard) {
    var portsArray = [];
    var portsId_A_E = ["E", "D", "C", "B", "A"];
    var portsId_F_J = ["J", "I", "H", "G", "F"];
    var portsId_W_Z = ["W", "X", "Y", "Z"];

    //LAS 2 PRIMERAS FILAS DEL PROTO
    let posX_W = 0;
    let posX_X = 0;
    let  posY_WX = -30;
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 25; j++) {
            portsArray.push({
                portId: "top",
                size: new go.Size(20, 20),
                position: new go.Point(j === 0 ? posX_W = 11 : j % 5 === 0 ? posX_W += 31.5 * 2 : posX_W += 31, j === 0 ? posY_WX += 32 : posY_WX), //533 32
                //background: "green",
                ports: [
                    {
                        portId: portsId_W_Z[i] + (j + 1),
                        tool: portsId_W_Z[i] + (j + 1),
                        color: "transparent",
                        figure: "Circle",
                        sizePort: new go.Size(11, 11),
                        margin: new go.Margin(0, 0, 0, 0)
                    }
                ]
            });
        }
    }

    //PUERTOS DE LA F - J
    let posX_FJ = 0;
    let POSY_FJ = 116;
    for (var i = 0; i < 5; i++) {
        posX_FJ = 0;
        for (var j = 0; j < 30; j++) {
            portsArray.push({
                portId: "top",
                size: new go.Size(20, 20),
                position: new go.Point(j === 0 ? -928 : posX_FJ += 31.1, i === 0 ? POSY_FJ : j === 0 ? POSY_FJ += 30 : POSY_FJ), //328 358 30
                //background: "green",
                ports: [
                    {
                        portId: portsId_F_J[i] + (j + 1),
                        tool: portsId_F_J[i] + (j + 1),
                        color: "transparent",
                        figure: "Circle",
                        sizePort: new go.Size(11, 11),
                        margin: new go.Margin(0, 0, 0, 0)
                    }
                ]
            });
        }
    }

    //PUERTOS DE LA - E
    let posX_AE = 0;
    let POSY_AE = 328;
    for (var i = 0; i < 5; i++) {
        posX_AE = 0;
        for (var j = 0; j < 30; j++) {
            portsArray.push({
                portId: "top",
                size: new go.Size(20, 20),
                position: new go.Point(j === 0 ? -928 : posX_AE += 31.1, i === 0 ? POSY_AE : j === 0 ? POSY_AE += 30 : POSY_AE), //328 358 30
                //background: "green",
                ports: [
                    {
                        portId: portsId_A_E[i] + (j + 1),
                        tool: portsId_A_E[i] + (j + 1),
                        color: "transparent",
                        figure: "Circle",
                        sizePort: new go.Size(11, 11),
                        margin: new go.Margin(0, 0, 0, 0)
                    }
                ]
            });
        }
    }


    //LAS 2 ULTIMAS FILAS DEL PROTO
    let posX_Y = 0
    let posX_Z = 0;
    let  posY_YZ = 500;
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 25; j++) {
            portsArray.push({
                portId: "top",
                size: new go.Size(20, 20),
                position: new go.Point(j === 0 ? posX_Y = 11 : j % 5 === 0 ? posX_Y += 31.5 * 2 : posX_Y += 31, j === 0 ? posY_YZ += 32 : posY_YZ), //533 32
                //background: "green",
                ports: [
                    {
                        portId: portsId_W_Z[i + 2] + (j + 1),
                        tool: portsId_W_Z[i + 2] + (j + 1),
                        color: "transparent",
                        figure: "Circle",
                        sizePort: new go.Size(11, 11),
                        margin: new go.Margin(0, 0, 0, 0)
                    }
                ]
            });
        }
    }
    console.log(portsArray);
    return portsArray;
}


//funcion para crear los puertos del arduino
function createPortsArduinoUno() {
    let portsArray = [];
    let posX = 0;
    let idNameTop = ["SCL", "SDA", "AREF", "GNDa", "13", "12", "~11", "~10", "~9", "8", "7", "~6", "~5", "4", "~3", "2", "TX-1", "RX-0"];
    let idNameBot = ["unused", "IOREF", "RESET", "3.3V", "5V", "GNDb", "GNDc", "Vin", "A0", "A1", "A2", "A3", "A4", "A5"];

    for (var i = 0; i < 18; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(i === 0 ? posX = 258 : i === 10 ? posX = 600 : i < 10 ? (posX += 32) : (posX += 32), -635),
            //background: "green",
            ports: [
                {
                    portId: idNameTop[i], tool: idNameTop[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }

    for (var i = 0; i < 14; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(i === 0 ? posX = 373 : i === 8 ? posX = 664 : i < 10 ? (posX += 32) : (posX += 32), 615),
            //background: "green",
            ports: [
                {
                    portId: idNameBot[i], tool: idNameBot[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del sensor ultrasonico
function createPortsUltrasonicSensor() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(110, 20),
        position: new go.Point(12.5, 263),
        //background: "yellow",
        ports: [
            {
                portId: "Vcc", tool: "Vcc", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(2, 2, 2, 2)
            },
            {
                portId: "Trig", tool: "Trig", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 3)
            },
            {
                portId: "Echo", tool: "Echo", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 3)
            },
            {
                portId: "Gnd", tool: "Gnd", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 3)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}

/*funcion para crear los puertos del componente HC-05 male*/
function createPortsHC05Male() {
    let portsArray = [];
    var posX = -36.5;
    let namePort = ["key", "Vcc", "GND", "TXD", "RXD", "State"];

    for (var i = 0; i < 6; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(30, 25),
            position: new go.Point(560, posX = posX + 36.5),
            //background: "green",
            ports: [
                {
                    portId: namePort[i], tool: namePort[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(2, 2, 2, 2)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

/*funcion para crear los puertos del componente de pantalla LCD*/
function createPortsLCD() {
    let portsArray = [];
    let portsAux = [];
    let namePorts = ["Cathode led", "Anode led", "DB7", "DB6", "DB5", "DB4", "DB3", "DB2", "DB1", "DB0", "E", "RW", "RS", "VD", "VCC", "GND"];

    for (var index = 15; index >= 0; index--) {
        portsAux.push({
            portId: namePorts[index], tool: namePorts[index], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 2)
        });
    }

    portsArray.push({
        portId: "top",
        size: new go.Size(510, 20),
        position: new go.Point(-630, -327),
        //background: "yellow",
        ports: portsAux
    });

    console.log(portsArray);
    return portsArray;
}

/*funcion para crear los componetnes del componente de ESP 8266 module*/
function createPortsESP8266Module() {
    let portsArray = [];
    let namePorts = ["GND", "GPIO2", "GPIO0", "RXD", "TXD", "CH_PD", "RESET", "VCC"];
    var posX = -40;

    //primer vertical
    for (var i = 0; i < 4; i++)
    {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(40, posX = posX + 40),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }

    posX = -40;

    //segunda vertical
    for (var i = 4; i < 8; i++)
    {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(-370, posX = posX + 40),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }


    console.log(portsArray);

    return portsArray;
}

//funcion para los puertos del L34
function createPortsLM34() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(110, 20),
        position: new go.Point(-120, 110),
        //background: "yellow",
        ports: [
            {
                portId: "Vcc", tool: "Vcc", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            },
            {
                portId: "Out", tool: "Out", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            },
            {
                portId: "GND", tool: "GND", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}


//funcion para ppuertos del pir sensor
function createPortsSesor() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(110, 20),
        position: new go.Point(-120, 310),
        //background: "yellow",
        ports: [
            {
                portId: "Vcc", tool: "Vcc", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            },
            {
                portId: "Out", tool: "Out", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            },
            {
                portId: "GND", tool: "GND", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}

function createPortsLM34X() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(110, 20),
        position: new go.Point(-120, 185),
        //background: "yellow",
        ports: [
            {
                portId: "Vcc", tool: "Vcc", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            },
            {
                portId: "Out", tool: "Out", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            },
            {
                portId: "GND", tool: "GND", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 15)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos para la resistencia
function createPortsResistor() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(-200, 0),
        //background: "yellow",
        ports: [
            {
                portId: "Terminal 1", tool: "Terminal 1", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });

    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(160, 0),
        //background: "yellow",
        ports: [
            {
                portId: "Terminal 2", tool: "Terminal 2", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}

//funcion para crear puertos del speacker
function createPortsSpeacker() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(55, 30),
        position: new go.Point(0, 305),
        //background: "yellow",
        ports: [
            {
                portId: "Vcc", tool: "Vcc", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 5)
            },
            {
                portId: "Out", tool: "Out", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 10)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del sensor mq135
function createPortsMQ135() {
    let portsArray = [];
    let namePorts = ["Vcc", "aout", "dout", "Gnd"];
    let posX = 0;
    for (var i = 0; i < 4; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(11, 11),
            position: new go.Point(i === 0 ? -33 : posX += 22, 305),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Circle", sizePort: new go.Size(11, 11), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del led azul
function createPortsLedBlue() {
    let portsArray = [];
    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(-48, 301),
        //background: "yellow",
        ports: [
            {
                portId: "Anode", tool: "Anode", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });

    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(23, 351),
        //background: "yellow",
        ports: [
            {
                portId: "Cathode", tool: "Cathode", color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });
    console.log(portsArray);
    return portsArray;
}

//puertos para el componente rht03
function createPortsRHT03() {
    let portsArray = [];
    var namePorts = ["GND", "5V", "RX", "TX"];
    var posX = -38;

    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(443, 850),
        //background: "red",
        ports: [
            {
                portId: namePorts[0], tool: namePorts[0], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });

    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(420, 850),
        //background: "blue",
        ports: [
            {
                portId: namePorts[1], tool: namePorts[1], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });

    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(27, 345),
        //background: "green",
        ports: [
            {
                portId: namePorts[2], tool: namePorts[2], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });

    portsArray.push({
        portId: "top",
        size: new go.Size(20, 20),
        position: new go.Point(-940, 345),
        //background: "yellow",
        ports: [
            {
                portId: namePorts[3], tool: namePorts[3], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
            }
        ]
    });

    console.log(portsArray);
    return portsArray;
}

//puertos para el giroscopio
function createPortsGiroscopy() {
    let portsArray = [];
    var namePorts = ["VCC", "GND", "SCL", "SDA", "XDA", "XCL", "ADO", "INT"];
    var posY = -38;

    for (var i = 0; i < 8; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(-200, posY = posY + 38),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Circle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del potenciometer
function createPortsPotenciometer() {
    let portsArray = [];
    var namePorts = ["VCC", "Signal", "GND"];
    var posX = -30;

    for (var i = 0; i < 3; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(posX = posX + 30, 160),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear puertos del button
function createPortsPushButton() {
    let portsArray = [];
    var namePorts = ["Terminal 1b", "Terminal 2b"];
    var namePortsA = ["Terminal 1a", "Terminal 2a"];
    var posXB = -50;
    var posXA = -50;

    for (var i = 0; i < 2; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(posXB = posXB + 50, -100),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }

    for (var i = 0; i < 2; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(posXA = posXA + 50, 100),
            //background: "yellow",
            ports: [
                {
                    portId: namePortsA[i], tool: namePortsA[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del luxSensor
function creatPortsLuxSensor() {
    let portsArray = [];
    var namePorts = ["VIN", "GND", "3VO", "INT", "SDA", "SCL"];
    var posX = -39;

    for (var i = 0; i < 6; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(posX = posX + 39, 172),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Circle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del componeente LM390
function createPortsLM390() {
    let portsArray = [];
    var namePorts = ["GND", "A0", "D0", "+5V"];
    var posY = -37;

    for (var i = 0; i < 4; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(-780, posY = posY + 37),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }
    console.log(portsArray);
    return portsArray;
}

//funcion para crear los puertos del componente MCUv9
function createPortsMCUv9() {
    let portsArray = [];
    var namePorts = ["D0", "D1", "D2", "D3", "D4", "3V3a", "GNDa", "D5", "D6", "D7", "D8", "RX", "TX", "GND", "3V3b"];
    var namePortsb = ["A0", "RSVa", "RSVb", "SD3", "SD2", "SD1", "CMD", "SD0", "CLK", "GNDb", "3V3c", "EN", "RST", "GNDc", "Vin"];
    let posX = 0;
    let posY = 0

    for (var i = 0; i < 15; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(i === 0 ? -590 : posX += 38.7, -370),
            //background: "yellow",
            ports: [
                {
                    portId: namePorts[i], tool: namePorts[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }

    for (var i = 0; i < 15; i++) {
        portsArray.push({
            portId: "top",
            size: new go.Size(20, 20),
            position: new go.Point(i === 0 ? -590 : posY += 38.7, 345),
            //background: "yellow",
            ports: [
                {
                    portId: namePortsb[i], tool: namePortsb[i], color: "transparent", figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                }
            ]
        });
    }

    console.log(portsArray);
    return portsArray;
}

/*puertos dinamicos*/
function createPortsDinamic(obj) {
    let portsArray = [];
    let portObj = [];
    
    obj = JSON.parse(obj);

    if (obj.code !== undefined) {

        for (var i = 0; i < obj.parameters.length; i++) {
            console.log(obj.parameters[i].loc);
            portsArray.push({
                portId: "top",
                size: new go.Size(20, 20),
                position: new go.Point(parseFloat(obj.parameters[i].loc.split(" ")[0]), parseFloat(obj.parameters[i].loc.split(" ")[1])),
                background: "yellow",
                ports: [
                    {
                        portId: obj.parameters[i].name_port, tool: obj.parameters[i].name_port, color: "transparent",
                        figure: "Rectangle", sizePort: new go.Size(20, 20), margin: new go.Margin(0, 0, 0, 0)
                    }
                ]
            });
        }

        return portsArray;
    }
}