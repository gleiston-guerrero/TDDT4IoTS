/*
 * Royal Codex
 * Royal Codex is an interpreter designed to streamline the process of
 * creating a class diagram using the descriptions and actions assigned to
 * a specific use case as a basis.
 * It was created by Anthony Pachay, under the tutelage of Gleiston Guerrero as
 * director of the project and the classmates that I will not name due to lack
 * of space, but it is clear that you want them :3
 * Created specifically for the "Drawing tools" application as part of the module
 * integration project "UML Project With UTEQ group module VI period II 2019 - 2020".
 */

/* global object */

//DataType_RoyalCodex[indexDataType_RoyalCorex]// con

var DataPrimitive_RoyalCodex = ["String", "string", "byte", "short", "int", "Int", "long", "Long", "float", "Float", "double", "Double", "boolean", "Boolean", "date", "Date", "list", "List"];
var indexDataType_RoyalCorex = 0;
var DataType_RoyalCodex = [];
DataType_RoyalCodex[indexDataType_RoyalCorex] = DataPrimitive_RoyalCodex.slice();

//["String", "byte", "short", "int", "long", "float", "double", "boolean", "date"];

function getDataTypeRoyalCodex() {
    return DataType_RoyalCodex[indexDataType_RoyalCorex];
}

function setDataTypeRoyalCodex(dataTypes) {
    return DataType_RoyalCodex[indexDataType_RoyalCorex] = [...DataType_RoyalCodex[indexDataType_RoyalCorex], ...dataTypes];
}

function searchDataType(text, def) {
    var type = DataType_RoyalCodex[indexDataType_RoyalCorex];
    console.log("tipos de datos disponibles", "-" + text + "-", type);
    for (var tdata = 0; tdata < type.length; tdata++) {
        if (text !== undefined && text.trim() === type[tdata].toString()) {
            return text;
        }
    }
    return def;
}

function CreateObjectClass(item)// put var how var object
{
    if (item.length > 0) {
        DataType_RoyalCodex[indexDataType_RoyalCorex].push(item);
    }
}
/***
 * 
 * @param {type} item
 * @returns {undefined}
 */
function objectClass(item) {
    if (item.className.length > 0 && item.action === "create") {
        DataType_RoyalCodex[indexDataType_RoyalCorex].push(item.className);
    }
}

function searchVisibilityType(text, def)//public, protected or private -> before visibility
{
    var type = [
        {simbol: "+", text: "public"},
        {simbol: "-", text: "private"},
        {simbol: "#", text: "protected"}
    ];
    for (var tdata = 0; tdata < type.length; tdata++) {
        if (text === type[tdata].simbol.toString()) {
            return type[tdata].text.toString();
        }
    }
    return def;
}

function searchmodifiersType(text, def)//final, static and abstract -> this is before visibility
{
    var type = [
        {simbol: "$", text: "static"},
        {simbol: "?", text: "abstract"},
        {simbol: "¬", text: "final"},
        {simbol: "@", text: "interface"}
    ];
    for (var tdata = 0; tdata < type.length; tdata++) {
        if (text === type[tdata].simbol.toString()) {
            return type[tdata].text.toString();
        }
    }
    return def;
}

function searchClassType(text) {
    var def = "public";
    var type = [
        {simbol: "@", text: "interface"}
        , {simbol: "?", text: "abstract"}
        , {simbol: "¬", text: "final"}
        //,{simbol: "º", text: "Synchronizable"}
    ];
    for (var tdata = 0; tdata < type.length; tdata++) {
        if (text === type[tdata].simbol.toString()) {
            return type[tdata].text.toString();
        }
    }
    return def;
}

function packages(text) {
    var superText = "", datas = [];
    var pack;
    var enumsx;
    var parts = manualPartition("^", "^", unsupportedCharacters(text, 1));
    console.log("Cantidad: ", parts.length);
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
        var namet = parts[row].toString().replace(/[\*\(]/g, "");
        namet = namet.toString().replace(/\/.*/g, "");
        namet = namet.toString().replace(/\[.*/g, "");
        namet = namet.toString().replace(/\{.*/g, "");
        namet = namet.toString().replace(/\%.*/g, "");

        var derivative = getClassDerivate(namet);
        namet = parts[row].toString().replace(/:.*/g, "");
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
                classx_p.push(item);
                objectClass(item);
            }


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
        return textManualPartition.join(" ").toString().replace(/[\/\\\]\}]/g, "").toString().replace(/[\.\[\{\(\)\&\+\¡\!¿?\-\$\#]/g, "").toString().replace(/=.*/g, "").replace(/\:.*/g, "");
    } else { // ¿?
        return text.toString().replace(/[\!\(\)¿?]/g, "").toString().replace(/\{.*\}/g, "").toString().replace(/\[.*\]/g, "").replace(/\:.*/g, "");
    }
}

function getAttributes(text) {
    text = text.toString().replace(/[\/\\\)\(\{\}\[\]]/g, "");
    var elements = [], attributesClass = [];
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
        }
    }
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
        if (methodName.length > 0) {
            var obj = {
                visibility: searchVisibilityType(subText[0].toString()[0], "public"),
                name: methodName,
                type: searchDataType(subText[1] === undefined ? "" : getClassName(subText[1].toString().trim().replace(/[\{\.].*/g, "")), "void"),
                parameters: getParameter(parts[row])//
            };
            metodox.push(obj);
        }
    }
    return metodox;
}

function manualPartition(beging, end, characters) {
    var subs = {x1: 0, x2: 0};
    var elements = [];
    var open = true;
    if (count(characters, beging) === count(characters, end)) {
        for (var rec = 0; rec < characters.length; rec++) {
            if (characters[rec] === beging && open === true) {
                subs.x1 = rec;
                open = false;
                if (characters[rec - 1] === "!" && characters[rec] === "(") {
                    subs.x1 = rec - 1;
                }
                if (characters[rec - 1] === "*" && characters[rec] === "(") {
                    subs.x1 = rec - 1;
                }
                if (characters[rec - 2] === "*" && characters[rec] === "(") {
                    subs.x1 = rec - 2;
                }
                if (characters[rec - 1] === "*" && characters[rec] === "¿") { // ¿?
                    subs.x1 = rec - 1;
                }
                if (characters[rec - 1] === "*" && characters[rec] === "¡") { // ¿?
                    subs.x1 = rec - 1;
                }
            }
            if (characters[rec] === end && open === false && subs.x1 !== rec) {
                open = true;
                subs.x2 = rec;
                var resultSelect = characters.toString().substr(subs.x1, (subs.x2 - (subs.x1 - 1)));
                elements.push(resultSelect.toString());
            }
        }
    }
    return elements;
}

function count(text, character) {
    var cantidad = 0;
    for (var i = 0; i < text.length; i++) {
        if (text[i].toString() === character) {
            cantidad++;
        }
    }
    return cantidad;
}

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
    let newText = "";
    for (let i = 0; i < text.length; i++) {
        newText += i === 0 ? text[i].toLowerCase() : text[i].toString();
    }
    return newText;
}

function getClassName(text) {
    if (text !== undefined) {
        text = text.replace(/[!@¬º\?\(\*\:\^\~`]/g, "").replace(/[\/\{\[\:\)\%].*/g, "");

        text = unsupportedCharacters(text, 3);
////console.log("1"+unsupportedCharacters(text,3));
////console.log("x"+unsupportedCharacters(text,1));

        text = nameFormat(text, 1);
////console.log("2"+text);

        return text;
    } else {
        return "Undefined";
    }
}

function loops_Conditional(text) {
    var other = [];
    var cases = manualPartition("<", ">", text);
    for (var row = 0; row < cases.length; row++) {
        cases[row] = cases[row].toString().toLowerCase();
        if (cases[row].toString().search(/\<if.*then.*>/g) !== -1)//if
        {
            if (cases[row].toString().search(/\<if.*then.*else.*>/g) !== -1)//if else
            {

                other.push({
                    condition: cases[row].replace(/\<if/g, "").replace(/then.*/g, ""),
                    case: cases[row].replace(/.*then/g, "").replace(/else.*/g, "").replace(/\>/g, ""),
                    otherCase: cases[row].replace(/.*else/g, "").replace(/\>/g, ""),
                    tipo: "if-then-else-then"
                });
            } else {
                other.push({
                    condition: cases[row].replace(/\<if/g, "").replace(/then.*/g, ""), //.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_]/g, ""),
                    case: cases[row].replace(/.*then/g, "").replace(/\>/g, ""), //.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_]/g, ""),
                    tipo: "if-then"
                });
            }
        }

        if (cases[row].toString().search(/\<for.*then.*>/g) !== -1)//for
        {
            other.push({
                condition: cases[row].replace(/\<for/g, "").replace(/then.*/g, ""), //.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_]/g, ""),
                case: cases[row].replace(/.*then/g, "").replace(/\>/g, ""), //.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_]/g, ""),
                tipo: "for-then"
            });
        }
        if (cases[row].toString().search(/\<while.*then.*>/g) !== -1)//for
        {
            other.push({
                condition: cases[row].replace(/\<while/g, "").replace(/then.*/g, ""), //.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_]/g, ""),
                case: cases[row].replace(/.*then/g, "").replace(/\>/g, ""), //.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_]/g, ""),
                tipo: "while-then"
            });
        }
    }
    return other;
}

function getOtherUseCases(text) {
    var other = [];
    var cases = manualPartition("{", "}", text);
    console.log(cases);
    for (var row = 0; row < cases.length; row++) {
        cases[row] = cases[row].toString().replace(/[\{\}]/g, "");
        if (cases[row].toString().substring(0, 2) === ">>")//extends
        {
            other.push({
                to: cases[row].replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_\>\<]/g, ""),
                type: "extends"
            });
        }
        if (cases[row].toString().substring(0, 2) === "<<")//include
        {
            other.push({
                to: cases[row].replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_\>\<]/g, ""),
                type: "include"
            });
        }
        if (cases[row].toString().substring(0, 2) === "<>")//Generalize
        {
            other.push({
                to: cases[row].replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_\>\<]/g, ""),
                type: "Generalize"
            });
        }
        if (cases[row].toString().substring(0, 2) === "><")//asociation
        {
            other.push({
                to: cases[row].replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\_\>\<]/g, ""),
                type: "asociation"
            });
        }
    }
    console.log(other);
    return other;
}

function typeOfRelationships(text, txtnatural) {
    var relations = [];
//    var asociation = manualPartition("¿", "¿", text);
//    var dependency = manualPartition("%", "%", text);
//    var generalization = manualPartition("¡", "¡", text);
    var partsRelations = manualPartition("¡", "!", text);

    console.log(partsRelations);
    let uno = "1";

    /*txtnatural = txtnatural.toString().replace("1<", "");
    txtnatural = txtnatural.toString().replace("1>", "");
    txtnatural = txtnatural.toString().replace("n<", "");
    txtnatural = txtnatural.toString().replace("n>", "");
    txtnatural = txtnatural.toString().replace(">1", "");
    txtnatural = txtnatural.toString().replace("<1", "");
    txtnatural = txtnatural.toString().replace(">n", "");
    txtnatural = txtnatural.toString().replace("<n", "");
    txtnatural = txtnatural.toString().replace("->", "");*/
    //txtnatural = txtnatural.toString().replace(/[\¡\<\>]/g, "");
    let description = txtnatural;
    for (var row = 0; row < partsRelations.length; row++) {
        let newString = new String(partsRelations[row]);
        let txtNaturalAux = textNatural(partsRelations[row]);
        description = description.toString().replace(newString, txtNaturalAux);

        // buscar el texto entre la relacion
        let text_relations = "";
        text_relations = manualPartition("[", "]", partsRelations[row]);
        console.log("texto entre las relaciones: " + text_relations);
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

        partsRelations[row] = partsRelations[row].toString().replaceAll("/", "");
        let minrel = partsRelations[row].toString().split(splitType.simbol);
        console.log(splitType, minrel);
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
                    from_fk = nameFormatAux(minrel[1], 1) + ":" + getClassName(minrel[1]) + "[]";
                    to_fk = nameFormatAux(minrel[0], 1) + ":" + getClassName(minrel[0]);
                } else if (splitType.cardinalidate === "*..1") {
                    from_fk = nameFormatAux(minrel[1], 1) + ":" + getClassName(minrel[1]);
                    to_fk = nameFormatAux(minrel[0], 1) + ":" + getClassName(minrel[0]) + "[]";
                }
                relations.push({
                    from: getClassName(minrel[0]),
                    to: getClassName(minrel[1]),
                    typeRelatioship: splitType.name,
                    value: text_relations.length > 0 ?
                        text_relations.toString()
                            .replace("[", "")
                            .replace("]", "")
                            .replaceAll("/", ""): splitType.name,
                    cardinalidate: splitType.cardinalidate,
                    from_fk: from_fk,
                    to_fk: to_fk,
                    simbol: splitType.simbol
                });
            } else {
                console.log("no ta completo");
            }
        }
    }
    return [relations, description];
}

function validateCardinalidate (text, symbol_relation) {
    let response = {data: {}, flag: false};
    let jsonType = {name: "", simbol: "", cardinalidate: ""};
    let simbolrelation = {">>": "agregation", "<<":"dependency", "<>":"generalization", "><": "asociation"};
    if (text.toString().includes("1"+symbol_relation+"1")) { // por defecto
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "1"+symbol_relation+"1";
        jsonType.cardinalidate = "1..1";
        response.flag = true;
    } else if (text.toString().includes("1"+symbol_relation+"n")) { // uno a muchos
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "1"+symbol_relation+"n";
        jsonType.cardinalidate = "1..*";
        response.flag = true;
    } else if (text.toString().includes("n"+symbol_relation+"1")) { // muchos a uno
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "n"+symbol_relation+"1";
        jsonType.cardinalidate = "*..1";
        response.flag = true;
    } else if (text.toString().includes("n"+symbol_relation+"n")) { // muchos a muchos
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = "n"+symbol_relation+"n";
        jsonType.cardinalidate = "*..*";
        response.flag = true;
    } else if (text.toString().includes(symbol_relation)) {
        jsonType.name = simbolrelation[symbol_relation];
        jsonType.simbol = ""+symbol_relation+"";
        jsonType.cardinalidate = "1..1";
        response.flag = true;
    }
    response.data = jsonType;
    console.log(response.data, response.flag);
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
                    //console.log(relationshipx[rel].parameters[rel2]);
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
    text = text.replace(/[\r\n]/g, '');
    var packs = packages(text);
//    var rel = getRelationship(packs[1]);
    var rel = typeOfRelationships(text, packs[0]);
//console.log("tipos");
//console.log(DataType_RoyalCodex[indexDataType_RoyalCorex]);

    return [rel[1], {
            diagram: packs[1],
            relationships: rel[0],
            action: []
        }];
}

function mergeClassDiagram(bigJson, minJson) {
    console.log("-------------------------------------");
    console.log(bigJson, minJson);
    console.log("-------------------------------------");
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
            console.log(minPackage);
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
            console.log(minPackage);
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
            console.log(minPackage);
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
                    console.log("lista de las clases", bigElemn);
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
                    console.log("lista de las clases", bigAttr);
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
                        console.log("Param length iguales");
                        for (var i = 0; i < minAttr[i].parameters; i++) {
                            if (minAttr[ind2].parameters[i].type !== bigAttr[ind].parameters[i].type) {
                                eqParam = false;
                            }
                        }
                        if (eqParam === false) {
                            console.log("sobrecarga");
                            bigAttr.push(minAttr[ind2].slice());

                        } else {
                            console.log("los metodos son equivalentes");
                            bigAttr[ind].visibility = classVisibilityPriority(minAttr[ind2].visibility, bigAttr[ind].visibility);
                        }
                        find = true;
                    } else {
                        find = false;
                        console.log("Número de parámetros diferente");
                    }
                } else {
                    let countm = 0;
                    for (var ind3 = 0; ind3 < bigAttr.length; ind3++) {
                        if (minAttr[ind3].name === bigAttr[ind].name) {
                            countm = countm + 1;
                            ind3 = 0;
                        }
                    }
                    minAttr[ind2].name = minAttr[ind2].name + (countm > 0 ? countm : "");
                    console.log(minAttr[ind2].name);
                    bigAttr.push({...minAttr[ind2]});
                    find = true;
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
                if (noExisteRelacion) {
                    bigRel.push({...minRel[relationEncontrada]});
                } else {
                    bigRel[ind] = {...minRel[relationEncontrada]};
                    bigRel[ind].typeRelatioship = resp[1];
                }
            }

        } else {
            for (var ind2 = 0; ind2 < minRel.length; ind2++) {
//            console.log(minRel[ind2]);
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
