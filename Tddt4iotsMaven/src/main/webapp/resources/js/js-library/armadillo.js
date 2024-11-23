/**
 * Armadillo.js v1.0
 *
 * */

// Global variables
var DataPrimitive_Armadillo = ["String", "string", "byte", "short", "int",
     "long", "Long", "float", "Float", "double", "Double", "boolean",
    "Boolean", "date", "Date", "list", "List", "array", "Array", "arrayList",
    "ArrayList", "json", "JSON"];
var DataTypeVisibility = [
    {simbol: "+", text: "public"},
    {simbol: "-", text: "private"},
    {simbol: "#", text: "protected"}
];
var DataTypeModifiers = [
    {simbol: "$", text: "static"},
    {simbol: "?", text: "abstract"},
    {simbol: "¬", text: "final"},
    {simbol: "@", text: "interface"}
];
var DataTypeClass = [
    {simbol: "@", text: "interface"}
    , {simbol: "?", text: "abstract"}
    , {simbol: "¬", text: "final"}
];
var indexDataType_Armadillo = 0;
var DataType_Armadillo = [];
var notifications = [];
DataType_Armadillo[indexDataType_Armadillo] = DataPrimitive_Armadillo.slice();

/**
 * @function Function for adding notification messages
 * @param {number} status
 * @param {string} information
 * @param {array} data
 * */
function setNotifications(status, information, data) {
    let notification = {
        status: 0, information: "Thank you for using armadillo.js",
        type: "", data: []
    };
    notification.status = status;
    notification.information = information;
    notification.data = data;
    notification.type = status === 0 ? "information" : status === 1 ? "success"
            : status === 2 ? "warning" : "error";
    //console.log(notification);
    notifications.push(notification);
}

/**
 * @function Function for get notificacions
 * @returns {array} notifications
 * */
function getNotifications() {
    return notifications;
}

/**
 * @function Function for a single data type declared by armadillo
 * @returns {Array}
 * */
function getDataTypeArmadillo() {
    return DataType_Armadillo[indexDataType_Armadillo];
}

/**
 * @function Function for assigning data types
 * @param {json} text
 * @return {boolean}
 * */
function setDataTypeArmadillo(text) {
    var type = DataType_Armadillo[indexDataType_Armadillo];
    let existe = false;
    for (var tdata = 0; tdata < type.length; tdata++) {
        if (text !== undefined && text.trim() === type[tdata].toString()) {
            existe = true;
        }
    }
    if (!existe)
        type.push(text);
}

/**
 * @function Function to search for data types
 * @param {array} text
 * @param {undefined} def
 * @return {undefined} def
 * */
function searchDataType(text, def) {
    var type = DataType_Armadillo[indexDataType_Armadillo];
    let _simbolopen = {"arrayList": "<", "ArrayList": "<", "array": "<", "Array": "<"};
    let _simbolclose = {"arrayList": ">", "ArrayList": ">", "array": ">", "Array": ">"};
    // verificamos si el tipo de dato contiene dimensiones
    let textAux = "";
    let typeDataOrDimension = "";
    let typeSplit = text.split("|");
    let dataTypeFound = false;
    if (typeSplit.length > 1) {
        textAux = typeSplit[0] === undefined ? "--" : typeSplit[0];
        typeDataOrDimension = typeSplit[1] === undefined ? "--" : typeSplit[1];
        typeDataOrDimension = getClassName(typeDataOrDimension.toString().replace(/&.*/g, ""))
        for (var tdata = 0; tdata < type.length; tdata++) {
            if (textAux !== undefined && textAux.trim() === type[tdata].toString()) {
                dataTypeFound = true;
                break;
            }
        }
        if (dataTypeFound) {
            let sOpen = _simbolopen[textAux] === undefined ? "[" : _simbolopen[textAux];
            let sClose = _simbolclose[textAux] === undefined ? "]" : _simbolclose[textAux];
            if (sOpen !== "[" && sClose !== "]") {
                let _dataTypeFound = false;

                for (var tdata = 0; tdata < type.length; tdata++) {
                    if (typeDataOrDimension !== undefined && typeDataOrDimension.trim() === type[tdata].toString()) {
                        _dataTypeFound = true;
                        break;
                    }
                }

                if (_dataTypeFound)
                    return textAux + sOpen + typeDataOrDimension + sClose;
                else
                    return textAux + sOpen + def + sClose;

            } else
                return textAux + sOpen + typeDataOrDimension + sClose;
        }
    } else {
        for (var tdata = 0; tdata < type.length; tdata++) {
            if (text !== undefined && text.trim() === type[tdata].toString()) {
                return text;
            }
        }
    }
    return def;
}

/**
 * @function Function for adding class objects as new data types
 * @param {string} new_class
 * */
function createObjectClass(new_class) {
    if (new_class.length > 0) {
        DataType_Armadillo[indexDataType_Armadillo].push(new_class);
    } else {
        setNotifications(2, "The class name has not been identified.", []);
    }
}

function objectClass(item) {
    if (item.className.length > 0 && item.action === "create") {
        DataType_Armadillo[indexDataType_Armadillo].push(item.className);
    }
}

/**
 * @function Function to search the visibility of methods and variables of
 * classes.
 * @param {string} text
 * @param {string} def default value
 * */
function searchVisibilityType(text, def) {
    for (var tdata = 0; tdata < DataTypeVisibility.length; tdata++) {
        if (text === DataTypeVisibility[tdata].simbol.toString()) {
            return DataTypeVisibility[tdata].text.toString();
        } /*else {
         setNotifications(3,
         "The entered visibility type could not be found.", []);
         }*/
    }
    return def;
}

/**
 * @function Function to search for available class types in armadillo
 * @param {string} text
 * @param {string} def default value
 * */
function searchmodifiersType(text, def) {
    for (var tdata = 0; tdata < DataTypeModifiers.length; tdata++) {
        if (text === DataTypeModifiers[tdata].simbol.toString()) {
            return DataTypeModifiers[tdata].text.toString();
        } /*else {
         setNotifications(3, text+" The entered modifier could not be found "+DataTypeModifiers[tdata].simbol.toString()+".", []);
         }*/
    }
    return def;
}

/**
 * @function Function to search for available class types
 * @param {string} text
 * */
function searchClassType(text) {
    var def = "public";
    for (var tdata = 0; tdata < DataTypeClass.length; tdata++) {
        if (text === DataTypeClass[tdata].simbol.toString()) {
            return DataTypeClass[tdata].text.toString();
        } else {
            setNotifications(3, "The entered modifier could not be found.", []);
        }
    }
    return def;
}

/**
 * @function Function for parsing characters not supported by armadillo
 * @param {string} character
 * @param {number} want
 * @return {string} character
 * */
function unsupportedCharacters(character, want) {
    if (want === 1)//from tilde to letters without accent mark
    {
        character = character.toString().replace(/á/g, "a");
        character = character.toString().replace(/é/g, "e");
        character = character.toString().replace(/í/g, "i");
        character = character.toString().replace(/ó/g, "o");
        character = character.toString().replace(/ú/g, "u");
        character = character.toString().replace(/Á/g, "A");
        character = character.toString().replace(/É/g, "E");
        character = character.toString().replace(/Í/g, "I");
        character = character.toString().replace(/Ó/g, "O");
        character = character.toString().replace(/Ú/g, "U");
        character = character.toString().replace(/ñ/g, "ni");
        character = character.toString().replace(/Ñ/g, "Ni");
    }
    if (want === 2)//to visualize
    {
        character = character.toString().replace(/á/g, "\u00E1");
        character = character.toString().replace(/é/g, "\u00E9");
        character = character.toString().replace(/í/g, "\u00ED");
        character = character.toString().replace(/ó/g, "\u00F3");
        character = character.toString().replace(/ú/g, "\u00FA");
        character = character.toString().replace(/Á/g, "\u00C1");
        character = character.toString().replace(/É/g, "\u00C9");
        character = character.toString().replace(/Í/g, "\u00CD");
        character = character.toString().replace(/Ó/g, "\u00D3");
        character = character.toString().replace(/Ú/g, "\u00DA");
        character = character.toString().replace(/ñ/g, "\u00F1");
        character = character.toString().replace(/Ñ/g, "\u00D1");
    }
    if (want === 3)//from utf-8 to letters without accent mark
    {
        character = character.toString().replace(/\u00E1/g, "a");
        character = character.toString().replace(/\u00E9/g, "e");
        character = character.toString().replace(/\u00ED/g, "i");
        character = character.toString().replace(/\u00F3/g, "o");
        character = character.toString().replace(/\u00FA/g, "u");
        character = character.toString().replace(/\u00C1/g, "A");
        character = character.toString().replace(/\u00C9/g, "E");
        character = character.toString().replace(/\u00CD/g, "I");
        character = character.toString().replace(/\u00D3/g, "O");
        character = character.toString().replace(/\u00DA/g, "U");
        character = character.toString().replace(/\u00F1/g, "ni");
        character = character.toString().replace(/\u00D1/g, "Ni");
    }
    if (want === 4)//from utf-8 to accent mark
    {
        character = character.toString().replace(/\u00E1/g, "á");
        character = character.toString().replace(/\u00E9/g, "é");
        character = character.toString().replace(/\u00ED/g, "í");
        character = character.toString().replace(/\u00F3/g, "ó");
        character = character.toString().replace(/\u00FA/g, "ú");
        character = character.toString().replace(/\u00C1/g, "Á");
        character = character.toString().replace(/\u00C9/g, "É");
        character = character.toString().replace(/\u00CD/g, "Í");
        character = character.toString().replace(/\u00D3/g, "Ó");
        character = character.toString().replace(/\u00DA/g, "Ú");
        character = character.toString().replace(/\u00F1/g, "ñ");
        character = character.toString().replace(/\u00D1/g, "Ñ");
    }
    return character;
}

/**
 * @function Function to count the number of characters between the beginning
 * and end of each text.
 * @param {string} text
 * @param {character} character
 * */
function count(text, character) {
    var cantidad = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i].toString() === character) {
            cantidad++;
        }
    }
    return cantidad;
}

/**
 * @function Function to validate the start and end character of each use case
 * to be interpreted.
 * @param {character} beging
 * @param {character} end
 * @param {string} characters
 * */
function manualPartition(beging, end, characters) {
    //console.log("################### MANUAL PARTITION ########################");
    var subs = {x1: 0, x2: 0};
    var elements = [];
    var open = true;
    let countBegin = count(characters, beging);
    let countEnd = count(characters, end);
    let textaux = "";
    if (countBegin === countEnd) {
        for (var rec = 0; rec < characters.length; rec++) {
            if (characters[rec] === beging && open === true) {
                subs.x1 = rec;
                open = false;
                if (characters[rec - 1] === "*" && characters[rec] === beging) {
                    subs.x1 = rec - 1;
                }
                //console.log(open);
                //console.log("subs.x1: ", subs.x1);
            }
            if (characters[rec] === end && open === false && subs.x1 !== rec) {
                open = true;
                subs.x2 = rec;
                var resultSelect = characters.toString().substr(subs.x1, (subs.x2 - (subs.x1 - 1)));
                elements.push(resultSelect.toString());
            }
        }
    } else {
        setNotifications(3, "An opening but not a closing symbol was detected. => begin: "
                + beging + ", end: " + end + ". Near: " + characters + "", []);
    }
    return elements;
}

function packages(text) {
    var superText = "", datas = [];
    var pack;
    var enumsx;
    var parts = manualPartition("^", "^", unsupportedCharacters(text, 1));
    //console.log("Cantidad: ", parts.length);
    superText = text;
    for (var row = 0; row < parts.length; row++) {
        var data = parts[row].toString().replace(/\^.*\~/g, "").replace(/[\^\~]/g, "");
        var cname = nameFormat(parts[row].replace(/~.*/g, "").replace(/\^/g, ""), 2);
        pack = classx(data); // [text, clase]
        enumsx = enums(data); // enumeradores
        datas.push({packName: (cname.trim().length > 1 ? cname : "Default"), class: pack[1], enums: enumsx[1]});
        superText = superText.toString().replace(parts[row], pack[0]);
    }
    if (parts.length === 0) {
        setNotifications(2, "No new packages with the symbol (^) were found.", []);
        pack = classx(text);//: packname,
        enumsx = enums(pack[0]); // enumeradores
        datas.push({packName: "Default", class: pack[1], enums: enumsx[1]});
        superText = enumsx[0];
    }
    return [superText, datas];
}

function enums(text) {
    var enums = [];
    var parts = manualPartition("¿", "?", unsupportedCharacters(text, 3)); // ¿?
    var parts2 = manualPartition("¿", "?", unsupportedCharacters(text, 2));
    var text2 = text;
    for (var row = 0; row < parts.length; row++) {

        var str = new String(parts2[row]);
        let txtNatural = textNatural(parts2[row]);
        var str2;
        if (typeof txtNatural === "object")
            str2 = txtNatural.join(" ");
        else
            str2 = txtNatural;

        text2 = text2.toString().replace(str, str2);

        var namet = parts[row].toString().replace(/[\*¿]/g, "");
        namet = namet.toString().replace(/\/.*/g, "");
        namet = namet.toString().replace(/\».*/g, "");

        var enumName = getClassName(namet.toString().replace(/&.*/g, ""));
        var item = {
            "name": enumName,
            "visibility": "public",
            "elements": getElementsEnum(parts[row])
        };
        setDataTypeArmadillo(enumName);
        enums.push(item);
    }
    return [text2, enums];
}

function getElementsEnum(text) {
    text = text.toString().replace(/[\/\\\)\(\{\}\[\]]/g, "");
    var elements = [], elementsEnum = [];
    elements = text.split("»");
    for (var row = 1; row < elements.length; row++) {
        var subText = elements[row].toString().split("=");
        var attributesName = nameFormat(subText[0].toString().replace(/[\+\-\$\#\/\(]/g, ""), 2);
        if (attributesName.length > 0) {
            elementsEnum.push(attributesName);
        }
    }
    return elementsEnum;
}

/**
 * Funcion para aumentar datos a una clase que ya existe en la misma descricpion del caso de uso
 * @param {array} classObject
 * @param {array} objects
 * */
function increadingClassData(classObject, objects) {
    if (objects.length > 0) {
        for (let x = 0; x < objects.length; x++) {
            classObject.push(objects[x]);
        }
    }
}

function classx(text) {
    var classx_p = [];
    text = unsupportedCharacters(text, 2);
    //console.log("### ENVIANDO LOS SIMBOLOS PARA INDENTIFICAR LAS CLASES")
    var parts = manualPartition("(", ")", unsupportedCharacters(text, 3));
    var parts2 = manualPartition("(", ")", unsupportedCharacters(text, 2));
    var text2 = text;
    for (var row = 0; row < parts.length; row++) {
        var str = new String(parts2[row]);
        let txtNatural = textNatural(parts2[row]);
        var str2;
        if (typeof txtNatural === "object")
            str2 = txtNatural.join(" ");
        else
            str2 = txtNatural;

        text2 = text2.toString().replace(str, str2);
        var namet = parts[row].toString().replace(/[\*\(\)]\//g, "");
        namet = namet.toString().replace(/\/.*/g, "");
        namet = namet.toString().replace(/\[.*/g, "");
        namet = namet.toString().replace(/\{.*/g, "");
        namet = namet.toString().replace(/\%.*/g, "");

        var derivative = getClassDerivate(namet);
        //namet = parts[row].toString().replace(/:.*/g, "");
        var className = getClassName(namet.toString().replace(/&.*/g, ""));
        let noexiste = false;
        // aumentado el dia 22/07/2022
        if (className.length > 0) {
            if (classx_p.length > 0) {
                for (let i = 0; i < classx_p.length; i++) {
                    if (classx_p[i].className === className) {
                        noexiste = false;
                        increadingClassData(classx_p[i].attributes, getAttributes(parts[row]));
                        increadingClassData(classx_p[i].methods, getMethods(parts[row]));
                        increadingClassData(classx_p[i].constructors, getConstructors(parts[row]));
                        i = classx_p.length;
                    } else {
                        noexiste = true;
                    }
                }
            }

            if (noexiste || classx_p.length === 0) {
                var item = {
                    action: (namet.toString()[0] === "!" || namet.toString()[1] === "!") ? "create" : "update",
                    derivative: derivative,
                    className: className,
                    visibility: "public",
                    modifiers: searchmodifiersType(namet.toString().replace(/[!\(\*]/g, "").toString()[0], ""),
                    attributes: getAttributes(parts[row]),
                    methods: getMethods(parts[row]),
                    constructors: getConstructors(parts[row])
                };
                setDataTypeArmadillo(className);
                //DataPrimitive_Armadillo.push(className);
                classx_p.push(item);
                objectClass(item);
            }
            setNotifications(1, "The class " + className + " was generated successfully", []);
        }
    }
    return [text2, classx_p];
}


function getConstructors(text) {
    var metodox = [];
    var parts = manualPartition("%", "%", text);
    for (var row = 0; row < parts.length; row++) {
        var subText = parts[row].toString().replace(/[\%]/g, "").split("=");
        var methodName = subText[0];
        if (methodName.length > 0) {
            var obj = {
                visibility: searchVisibilityType(subText[0].toString()[0], "public"),
                parameters: getParameter(parts[row])//
            };
            metodox.push(obj);
        }
    }
    return metodox;
}

function getClassDerivate(text) {
    var parts = text.toString().includes(":") ? (text.toString().replace(/.*:/g, "").replace(/[\)]/g, "")).split("`") : [];
    for (var row = 0; row < parts; row++) {
        parts[row] = searchDataType(getClassName(parts[row]), "");
        if (parts[row].toString() === "") {
            parts.splice(row, 1);
        }
    }
    return parts;
}

function textNatural(text) {
    if (text[0] === "*") {
        let textManualPartition = manualPartition("/", "/", text);
        return textManualPartition.join(" ").toString()
                .replace(/[\/\\\]\}]/g, "").toString()
                .replace(/[\.\[\{\(\)\&\+\¡\!¿?\-\$\#]/g, "").toString()
                .replace(/=.*/g, "")
                .replace(/\:.*/g, "");
    } else { // ¿?
        return text.toString().replace(/[\!\(\)¿?]/g, "").toString().replace(/\{.*\}/g, "").toString().replace(/\[.*\]/g, "").replace(/\:.*/g, "");
    }
}

function getAttributes(text) {
    text = text.toString().replace(/[\/\\\)\(\{\}\[\]]/g, "");
    var elements = [], attributesClass = [];
    let message = "Successfully added attributes: ";
    elements = text.split("&");
    for (var row = 1; row < elements.length; row++) {
        var subText = elements[row].toString().split("=");
        var attributesName = nameFormat(subText[0].toString().replace(/[\+\-\$\#\/\(]/g, ""), 2);
        if (attributesName.length > 0) {
            var itempo = {
                visibility: searchVisibilityType(subText[0].toString()[0], "private"),
                name: attributesName,
                type: searchDataType(getClassName(subText[1]), "String")
            };
            attributesClass.push(itempo);
            message += attributesName + " ";
        }
    }
    setNotifications(1, message, []);
    return attributesClass;
}

function getParameter(text) {
    var parameters = [], elements = [];
    elements = text.split(".");
    for (var row = 1; row < elements.length; row++) {
        var subText = elements[row].toString().split("=");
        var paramName = nameFormat(subText[0].toString().replace(/[\+\-\$\#\/\(]/g, ""), 2);
        if (paramName.length > 0) {
            var itempo = {
                name: paramName,
                type: searchDataType(getClassName(subText[1].toString().replace(/[\%\}\]\s\/]/g, "")), getClassName(subText[1].toString().replace(/[\%\}\]\s\/]/g, "")) !== "" ?
                        getClassName(subText[1].toString().replace(/[\%\}\]\s\/]/g, "")) : "String")
            };
            parameters.push(itempo);
        }
    }
    return parameters;
}

function getMethods(text) {
    var metodox = [];
    var parts = manualPartition("[", "]", text);
    for (var row = 0; row < parts.length; row++) {
        var subText = parts[row].toString().replace(/[\[\]]/g, "").split("=");
        var methodName = nameFormat(subText[0].toString().replace(/[\+\-\$\#\/\(]/g, "").replace(/\..*/g, "").replace(/\{.*/g, ""), 2);
        let metodoExistente = false;
        let posicionExistente = 0;
        // verificar si existe el metodo ya declarado en la clase
        for (let posMetodos = 0; posMetodos < metodox.length; posMetodos++) {
            if (methodName === metodox[posMetodos].name
                    && searchDataType(subText[1] === undefined ? "" :
                            getClassName(subText[1].toString().trim().replace(/[\{\.].*/g, "")),
                            "void") === metodox[posMetodos].type
                    && JSON.stringify(getParameter(parts[row])) === JSON.stringify(metodox[posMetodos].parameters)) {
                metodoExistente = true;
                posicionExistente = posMetodos;
                break;
            }
        }

        if (methodName.length > 0) {
            if (metodoExistente) {
                metodox[posicionExistente].visibility = searchVisibilityType(subText[0].toString()[0], "public");
                metodox[posicionExistente].name = methodName;
                metodox[posicionExistente].type = searchDataType(subText[1] === undefined ? "" : getClassName(subText[1].toString().trim().replace(/[\{\.].*/g, "")), "void");
                metodox[posicionExistente].parameters = getParameter(parts[row]);
            } else {
                var obj = {
                    visibility: searchVisibilityType(subText[0].toString()[0], "public"),
                    name: methodName,
                    type: searchDataType(subText[1] === undefined ? "" : getClassName(subText[1].toString().trim().replace(/[\{\.].*/g, "")), "void"),
                    parameters: getParameter(parts[row])//
                };
                metodox.push(obj);
            }
        }
    }
    return metodox;
}

function nameFormat(text, tipo) {
    if (text === "" || text === undefined || text === null) {
        return "";
    }
    text = text.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, "");
    var parts = [];
    parts = text.trim().split(" ");
    var i = 1;
    if (tipo === 1) {
        i = 0;
    }
    for (i = i + 0; i < parts.length; i++) {
        parts[i] = parts[i].toString()[0].toUpperCase() + parts[i].toString().substring(1);
    }
    return parts.join("");
}

function nameFormatAux(text, tipo) {
    if (text === "" || text === undefined || text === null) {
        return "";
    }
    text = text.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, "");
    text = text.toString().trim();
    let newText = "";
    for (let i = 0; i < text.length; i++) {
        newText += i === 0 ? text[i].toLowerCase() : text[i].toString();
    }
    return newText;
}

function getClassName(text) {

    if (text.toString().includes("|"))
        return text;

    if (text !== undefined) {
        text = text.replace(/[!@¬º\?\(\*\:\^\~`]/g, "").replace(/[\/\{\[\:\)\%].*/g, "");

        text = unsupportedCharacters(text, 3);
//////console.log("1"+unsupportedCharacters(text,3));
//////console.log("x"+unsupportedCharacters(text,1));

        text = nameFormat(text, 1);
//////console.log("2"+text);

        return text;
    } else {
        return "Undefined";
    }
}

function typeOfRelationships(text, txtnatural) {
    var relations = [];
    var partsRelations = manualPartition("¡", "!", text);

    //console.log(partsRelations);
    let uno = "1";

    let description = txtnatural;
    for (var row = 0; row < partsRelations.length; row++) {
        let newString = new String(partsRelations[row]);
        let txtNaturalAux = textNatural(partsRelations[row]);
        description = description.toString().replace(newString, txtNaturalAux);

        // buscar el texto entre la relacion
        let text_relations = "";
        text_relations = manualPartition("[", "]", partsRelations[row]);
        //console.log("texto entre las relaciones: " + text_relations);
        partsRelations[row] = partsRelations[row].toString().replace(/\¡/g, "");
        partsRelations[row] = partsRelations[row].toString().replace(text_relations, "");
        let splitType = {};
        let response_validate = {};
        response_validate = validateCardinalidate(partsRelations[row], ">>");
        splitType = response_validate.flag ? response_validate.data : {};
        response_validate = validateCardinalidate(partsRelations[row], "<<");
        splitType = JSON.stringify(splitType) === "{}" ? response_validate.flag ? response_validate.data : {} : splitType;
        response_validate = validateCardinalidate(partsRelations[row], "<>");
        splitType = JSON.stringify(splitType) === "{}" ? response_validate.flag ? response_validate.data : {} : splitType;
        response_validate = validateCardinalidate(partsRelations[row], "><");
        splitType = JSON.stringify(splitType) === "{}" ? response_validate.flag ? response_validate.data : {} : splitType;
        response_validate = validateCardinalidate(partsRelations[row], "<:>");
        splitType = JSON.stringify(splitType) === "{}" ? response_validate.flag ? response_validate.data : {} : splitType;

        partsRelations[row] = partsRelations[row].toString().replaceAll("/", "");
        let minrel = partsRelations[row].toString().split(splitType.simbol);
        //console.log(splitType, minrel);
        if (minrel.length === 2) {
            if (minrel[0].length > 0 && minrel[1].length > 0) {
                // agregado por duval (22/03/2022)
                // si la cardinalidad es de 1..1 sera un objeto inverso de cada clase
                let from_fk = "";
                let to_fk = "";

                if (splitType.cardinalidate === "1..1") {
                    from_fk = nameFormatAux(getClassName(minrel[1]), 2) + ":" + getClassName(minrel[1]);
                    to_fk = nameFormatAux(getClassName(minrel[0]), 2) + ":" + getClassName(minrel[0]);
                } else if (splitType.cardinalidate === "1..*") {
                    from_fk = nameFormatAux(getClassName(minrel[1], 1)) + ":" + getClassName(minrel[1]) + "[]";
                    to_fk = nameFormatAux(getClassName(minrel[0], 1)) + ":" + getClassName(minrel[0]);
                } else if (splitType.cardinalidate === "*..1") {
                    from_fk = nameFormatAux(getClassName(minrel[1], 1)) + ":" + getClassName(minrel[1]);
                    to_fk = nameFormatAux(getClassName(minrel[0], 1)) + ":" + getClassName(minrel[0]) + "[]";
                } else if (splitType.cardinalidate === " .. ") {
                    from_fk = nameFormatAux(getClassName(minrel[1]), 2) + ":" + getClassName(minrel[1]);
                    to_fk = nameFormatAux(getClassName(minrel[0]), 2) + ":" + getClassName(minrel[0]);
                }

                if (getClassName(minrel[0]) === undefined || getClassName(minrel[1]) === undefined) {
                    setNotifications(3, "Could not find a class for the relationship", []);
                    return;
                }

                relations.push({
                    from: getClassName(minrel[0]),
                    to: getClassName(minrel[1]),
                    typeRelatioship: splitType.name,
                    value: text_relations.length > 0 ?
                            text_relations.toString()
                            .replace("[", "")
                            .replace("]", "")
                            .replaceAll("/", "") : splitType.name,
                    cardinalidate: splitType.cardinalidate,
                    from_fk: splitType.name !== "dependency" ? from_fk : "",
                    to_fk: splitType.name !== "dependency" ? to_fk : "",
                    simbol: splitType.simbol
                });
                setNotifications(1, "The " + splitType.name + " relationship between objects from: "
                        + getClassName(minrel[0]) + " " + splitType.simbol + " to: " + getClassName(minrel[1]) + " was successfully generated.", []);
            } else {
                //console.log("no ta completo");
            }
        }
    }
    return [relations, description];
}

function validateCardinalidate(text, symbol_relation) {
    let response = {data: {}, flag: false};
    let jsonType = {name: "", simbol: "", cardinalidate: ""};
    let simbolrelation = {
        ">>": "agregation",
        "<<": "dependency",
        "<>": "generalization",
        "><": "asociation",
        "<:>": "composition"
    };
    if (text.toString().includes("1" + symbol_relation + "1")) { // por defecto
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "1" + symbol_relation + "1";
        jsonType.cardinalidate = "1..1";
        response.flag = true;
    } else if (text.toString().includes("1" + symbol_relation + "n")) { // uno a muchos
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "1" + symbol_relation + "n";
        jsonType.cardinalidate = "1..*";
        response.flag = true;
    } else if (text.toString().includes("n" + symbol_relation + "1")) { // muchos a uno
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "n" + symbol_relation + "1";
        jsonType.cardinalidate = "*..1";
        response.flag = true;
    } else if (text.toString().includes("n" + symbol_relation + "n")) { // muchos a muchos
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "n" + symbol_relation + "n";
        jsonType.cardinalidate = "*..*";
        response.flag = true;
    } else if (text.toString().includes("u" + symbol_relation + "u")) { // muchos a muchos
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "u" + symbol_relation + "u";
        jsonType.cardinalidate = " .. ";
        response.flag = true;
    } else if (text.toString().includes(symbol_relation)) {
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "" + symbol_relation + "";
        jsonType.cardinalidate = "1..1";
        response.flag = true;
    }
    response.data = jsonType;
    //console.log(response.data, response.flag);
    return response;
}

function clearRelation(text) {
    return nameFormat(text, 1);
}

function getRelationship(myObject) {
    var result = [];
    for (var packages = 0; packages < myObject.length; packages++) {
        for (var classis = 0; classis < myObject[packages].class.length; classis++) {
            //derivate
            var relationshipx = myObject[packages].class[classis].derivative;
            for (var rel = 0; rel < relationshipx.length; rel++) {
                var rtempy = searchDataClass(relationshipx[rel], myObject);
                if (rtempy[1].length > 0) {
                    result.push({
                        from: myObject[packages].class[classis].className,
                        to: rtempy[1],
//                                from_packName: myObject[packages].packName,
//                                to_packName: rtempy[0],
                        typeRelatioship: "Generalization"
                    });
                }
            }
            //class parameters
            var relationshipx = myObject[packages].class[classis].attributes;
            for (var rel = 0; rel < relationshipx.length; rel++) {
                var rtempy = searchDataClass(relationshipx[rel].type, myObject);
                if (rtempy[1].length > 0) {
                    result.push(
                            {
                                from: myObject[packages].class[classis].className,
                                to: rtempy[1],
//                                from_packName: myObject[packages].packName,
//                                to_packName: rtempy[0],
                                typeRelatioship: "Aggregation"
                            }
                    );
                }
            }
            //dependency
            var relationshipx = myObject[packages].class[classis].methods;
            for (var rel = 0; rel < relationshipx.length; rel++) {
                var rtempy;
                for (var rel2 = 0; rel2 < relationshipx[rel].parameters.length; rel2++) {
                    ////console.log(relationshipx[rel].parameters[rel2]);
                    rtempy = searchDataClass(relationshipx[rel].parameters[rel2].type, myObject);
                    if (rtempy[1].length > 0) {
                        result.push(
                                {
                                    from: myObject[packages].class[classis].className,
                                    to: rtempy[1],
//                                    from_packName: myObject[packages].packName,
//                                    to_packName: rtempy[0],
                                    typeRelatioship: "Dependence"
                                }
                        );
                    }
                }
                rtempy = searchDataClass(relationshipx[rel].type, myObject);
                if (rtempy[1].length > 0) {
                    result.push(
                            {
                                from: myObject[packages].class[classis].className,
                                to: rtempy[1],
//                                from_packName: myObject[packages].packName,
//                                to_packName: rtempy[0],
                                typeRelatioship: "Composition"
                            }
                    );
                }
            }

        }
    }
    return result;
}

function searchDataClass(className, elements) {
    for (var packages = 0; packages < elements.length; packages++) {
        for (var classis = 0; classis < elements[packages].class.length; classis++) {
            if (className === elements[packages].class[classis].className) {
                return [elements[packages].packName, elements[packages].class[classis].className];
            }
        }
    }
    return ["", ""];
}

function getDataTypes(obj) {
    var types = [];
    for (var row = 0; row < obj.length; row++) {
        types.push(obj[row].dataType);
    }
    return types;
}

function getHackDiagram(text) {
    notifications.length = 0;
    text = text.replace(/[\r\n]/g, '');
    setNotifications(0, "Description entered: " + text, []);
    var packs = packages(text);
    var rel = typeOfRelationships(text, packs[0]);

    return [rel[1], {
            diagram: packs[1],
            xmldiagram: "<package>" + OBJtoXML({diagram: packs[1], relations: rel[0]}) + "</package>",
            relationships: rel[0],
            action: [],
            notifications: getNotifications()
        }];
}

function OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += OBJtoXML(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
}

function mergeClassDiagram(bigJson, minJson) {
    //console.log("-------------------------------------");
    //console.log(bigJson, minJson);
    //console.log("-------------------------------------");
    if (Object.keys(bigJson).length > 0) {
        mergeDiagram(bigJson.diagram, minJson.diagram);
        mergeRelationships(bigJson.relationships, minJson.relationships);
    } else {
//        bigJson.push(minJson);
        Object.assign(bigJson, minJson);
    }
//    return
}

function mergeDiagram(bigRel, minRel) {

    if (bigRel !== undefined && minRel !== undefined) {

        for (var ind2 = 0; ind2 < minRel.length; ind2++) {
            let find = false;
            for (var ind = 0; ind < bigRel.length; ind++) {
                //validate new package
                if (bigRel[ind].packName === minRel[ind2].packName) {
                    find = true;
                    joinPackages(bigRel[ind].class, minRel[ind2].class);
                    joinEnums(bigRel[ind].enums, minRel[ind2].enums);
                }
            }
            if (find === false) {
                bigRel.push({...minRel[ind2]});
            }
        }
    }
}

function joinPackages(bigPackage, minPackage) {
    for (var ind2 = 0; ind2 < minPackage.length; ind2++) {
        let find = false;
        for (var ind = 0; ind < bigPackage.length; ind++) {
            if (minPackage[ind2].className === bigPackage[ind].className) {
                find = true;
                bigPackage[ind].visibility = classVisibilityPriority(minPackage[ind2].visibility, bigPackage[ind].visibility);
                bigPackage[ind].modifiers = modifierPriority(minPackage[ind2].modifiers, bigPackage[ind].modifiers);
                bigPackage[ind].derivative = vectorUnique(bigPackage[ind].derivative, minPackage[ind2].derivative);
                joinAttributes(bigPackage[ind].attributes, minPackage[ind2].attributes);
                joinMethods(bigPackage[ind].methods, minPackage[ind2].methods);
                joinConstructors(bigPackage[ind].constructors, minPackage[ind2].constructors);
            }
        }
        if (find === false) {
            //console.log(minPackage);
            bigPackage.push({...minPackage[ind2]});
        }
    }
}

function joinConstructors(bigPackage, minPackage) {
    for (var ind2 = 0; ind2 < minPackage.length; ind2++) {
        let find = false;
        for (var ind = 0; ind < bigPackage.length; ind++) {
            if (JSON.stringify(minPackage[ind2]) === JSON.stringify(bigPackage[ind])) {
                find = true;
                bigPackage[ind].visibility = classVisibilityPriority(minPackage[ind2].visibility, bigPackage[ind].visibility);
                bigPackage[ind].parameters = Object.assign([], minPackage[ind2].parameters)
            }
        }
        if (find === false) {
            //console.log(minPackage);
            bigPackage.push({...minPackage[ind2]});
        }
    }
}

function joinEnums(bigPackage, minPackage) {
    for (var ind2 = 0; ind2 < minPackage.length; ind2++) {
        let find = false;
        for (var ind = 0; ind < bigPackage.length; ind++) {
            if (minPackage[ind2].name === bigPackage[ind].name) {
                find = true;
                bigPackage[ind].visibility = classVisibilityPriority(minPackage[ind2].visibility, bigPackage[ind].visibility);
                joinElements(bigPackage[ind].elements, minPackage[ind2].elements);
            }
        }
        if (find === false) {
            //console.log(minPackage);
            bigPackage.push({...minPackage[ind2]});
        }
    }
}

function joinElements(bigElemn, minElem) {
    for (let i = 0; i < minElem.length; i++) {
        let find = false;
        for (let j = 0; j < bigElemn.length; j++) {
            if (minElem[i].name === bigElemn[j].name) {
                if (minElem[i].type !== bigElemn[j].type) {
                    let countm = 0;
                    for (let k = 0; k < minElem.length; k++) {
                        if (minElem[k].name === bigElemn[j].name && i !== j) {
                            countm = countm + 1;
                            k = minElem.length;
                        }
                    }
                    minElem[i].name = minElem[i].name + (countm > 0 ? countm : "");
                    //console.log("lista de las clases", bigElemn);
                    minElem[i].visibility = classVisibilityPriority(minElem[i].visibility, bigElemn[j].visibility);
                    bigElemn.push({...minElem[i]});
                } else {
                    find = true;
                    bigElemn[j].visibility = classVisibilityPriority(minElem[i].visibility, bigElemn[j].visibility);
                }
            }
        }
        if (find === false) {
            bigElemn.push({...minElem[i]});
        }
    }
}

function joinAttributes(bigAttr, minAttr) {
    for (var ind = 0; ind < minAttr.length; ind++) {
        let find = false;
        for (var ind2 = 0; ind2 < bigAttr.length; ind2++) {
            if (minAttr[ind].name === bigAttr[ind2].name) {
                if (minAttr[ind].type !== bigAttr[ind2].type) {
                    let countm = 0;
                    for (var ind3 = 0; ind3 < minAttr.length; ind3++) {
                        if (minAttr[ind3].name === bigAttr[ind2].name && ind !== ind2) {
                            countm = countm + 1;
                            ind3 = minAttr.length;
                        }
                    }
                    minAttr[ind].name = minAttr[ind].name + (countm > 0 ? countm : "");
                    //console.log("lista de las clases", bigAttr);
                    minAttr[ind].visibility = classVisibilityPriority(minAttr[ind].visibility, bigAttr[ind2].visibility);
                    bigAttr.push({...minAttr[ind]});
                } else {
                    find = true;
                    bigAttr[ind2].visibility = classVisibilityPriority(minAttr[ind].visibility, bigAttr[ind2].visibility);
                }
            }
        }
        if (find === false) {
            bigAttr.push({...minAttr[ind]});
        }
    }

//    visibility
//    name
//    type
}

function joinMethods(bigAttr, minAttr) {
    for (var ind2 = 0; ind2 < minAttr.length; ind2++) {
        let find = false;
        for (var ind = 0; ind < bigAttr.length; ind++) {
            if (minAttr[ind2].name === bigAttr[ind].name) {
                find = true;
                //name - type - parameters
                if (minAttr[ind2].type === bigAttr[ind].type) {

                    let eqParam = true;
                    if (minAttr[ind2].parameters.length === bigAttr[ind].parameters.length) {
                        //console.log("Param length iguales");
                        for (var i = 0; i < minAttr[ind2].parameters.length; i++) {
                            if (minAttr[ind2].parameters[i].type !== bigAttr[ind].parameters[i].type) {
                                eqParam = false;
                            }
                        }
                        if (eqParam === false) {
                            //console.log("sobrecarga");
                            bigAttr.push(minAttr[ind2]);

                        } else {
                            //console.log("los metodos son equivalentes");
                            bigAttr[ind].visibility = classVisibilityPriority(minAttr[ind2].visibility, bigAttr[ind].visibility);
                        }
                        find = true;
                    } else {
                        find = false;
                        //console.log("Número de parámetros diferente");
                    }
                } else {
                    let countm = 0;
                    for (var ind3 = 0; ind3 < bigAttr.length; ind3++) {
                        if (minAttr[ind2].name === bigAttr[ind3].name) {
                            countm = countm + 1;
                            if (minAttr[ind2].parameters.length === bigAttr[ind3].parameters.length) {
                                let eqParam = true;
                                for (var i = 0; i < minAttr[ind2].parameters.length; i++) {
                                    if (minAttr[ind2].parameters[i].type !== bigAttr[ind3].parameters[i].type) {
                                        eqParam = false;
                                    }
                                }

                                if (eqParam === false) {
                                    //console.log("sobrecarga");
                                    bigAttr.push(minAttr[ind2]);

                                } else {
                                    //console.log("los metodos son equivalentes");
                                    bigAttr[ind].visibility = classVisibilityPriority(minAttr[ind2].visibility, bigAttr[ind].visibility);
                                }
                                find = true;

                            } else {
                                if (minAttr[ind2].type === bigAttr[ind3].type) {
                                    minAttr[ind2].name = minAttr[ind2].name + (countm > 0 ? countm : "");
                                    bigAttr.push({...minAttr[ind2]});
                                } else
                                    find = false;
                            }
                        }
                    }

                }
            }
        }
        if (find === false) {
            bigAttr.push({...minAttr[ind2]});
        }
    }
}

function vectorUnique(vector) {
    let resp = [];
    for (var i1 = 0; i1 < vector.length; i1++) {
        let unique = true;
        for (var i2 = 0; i2 < vector.length; i2++) {
            if (vector[i1] === vector[i2] && i1 !== i2) {
                unique = false;
            }
        }
        if (unique === true) {
            resp.push(vector[i1]);
        }
    }
    return resp;
}

function mergeRelationships(bigRel, minRel) {
    if (bigRel !== undefined) {
        if (bigRel.length > 0) {
            let cant = bigRel.length;
            let resp = true;
            let relationEncontrada = -1;
            let noExisteRelacion = false;
            let ind;
            for (let ind2 = 0; ind2 < minRel.length; ind2++) {
                for (ind = 0; ind < cant; ind++) {
                    if (bigRel[ind] !== undefined && minRel[ind2] !== undefined) {
                        resp = relationshipsIsExists(bigRel[ind].from, bigRel[ind].to, bigRel[ind].typeRelatioship,
                                minRel[ind2].from, minRel[ind2].to, minRel[ind2].typeRelatioship);
                        if (resp[0] === false) {
                            noExisteRelacion = true;
                            relationEncontrada = ind2;
                        } else {
                            // dejar de buscar poq si existe la relaion en alguna posicion de las relaciones totales
                            ind = cant;
                            noExisteRelacion = false;
                        }
                    }
                }
                if (noExisteRelacion) {
                    bigRel.push({...minRel[relationEncontrada]});
                } else {
                    bigRel[ind] = {...minRel[relationEncontrada]};
                    bigRel[ind].typeRelatioship = resp[1];
                }
            }

        } else {
            for (var ind2 = 0; ind2 < minRel.length; ind2++) {
//            //console.log(minRel[ind2]);
                bigRel.push({...minRel[ind2]});
            }
        }
    }
}

function relationshipsIsExists(from, to, typeRelatioship, from2, to2, typeRelatioship2) {

    if ((from === from2 && to === to2) || (from === to2 && to === from2)) {
        if (typeRelatioship === typeRelatioship2) {
            return [true, typeRelatioship];
        } else {
            //return [true, relationshipsPriority(typeRelatioship, typeRelatioship2)];
        }
    }
    return [false, typeRelatioship];
}

function relationshipsPriority(rel1, rel2) {
    let rels = [
        "agregation",
        "dependency",
        "generalization",
        "asociation"
    ];
    for (var ind = 0; ind < rels.length; ind++) {
        if (rels[ind] === rel1) {
            return rel1;
        }
        if (rels[ind] === rel2) {
            return rel2;
        }
    }
    return rels[0];
}

function classVisibilityPriority(rel1, rel2) {
    let rels = ["public", "private", "protected"];
    for (var ind = 0; ind < rels.length; ind++) {
        if (rels[ind] === rel1) {
            return rel1;
        }
        if (rels[ind] === rel2) {
            return rel2;
        }
    }
    return rels[0];
}

function modifierPriority(rel1, rel2) {
    let rels = ["static", "abstract", "final", "interface"];
    for (var ind = 0; ind < rels.length; ind++) {
        if (rels[ind] === rel1) {
            return rel1;
        }
        if (rels[ind] === rel2) {
            return rel2;
        }
    }
    return "";
}






