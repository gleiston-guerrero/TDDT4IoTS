function recorreCondiciones(obj) {
    let superindex = [];
    for (var index = 0; index < obj.length; index++) {
        if (!verifyString(obj[index][0], obj[index][1], obj[index][2]))
        {
//            superindex = index;
            superindex.push(obj[index]);
//            index = obj.length;
//            console.log(superindex);
        }
    }
//    console.log(obj);
    return superindex;
}

function verifyString(item, opt, condi)
{
    let flag = false;
    if (item !== undefined)
    {
        switch (opt) {
            case "objM": // dimensión de un obeto
                {
                    if (typeof (item) == "object")
                    {
                        flag = item.length >= condi;
                    } else {
                        flag = false;
                    }
                }
                break;
            case "objm": // dimensión de un obeto
                {
                    if (typeof (item) == "object")
                    {
                        flag = item.length <= condi;
                    } else {
                        flag = false;
                    }
                }
                break;
            case "eq": // igualdad entre objetos
                {
                    flag = (item.toString().trim() === condi);
                }
                break;
            case "ueq": // diferente cadena
                {
                    flag = (item.toString().trim() !== condi);
                }
                break;
            case "wd": // contador de palabras
                {
                    flag = (verifyMaxWords(item.toString().trim(), " ") <= condi);
                }
                break;
            case "lgm": // longitud de cadena minima
                {
                    flag = item.toString().trim().length <= condi;
                }
                break;
            case "lgM": // longitud de cadena Maxima
                {
                    flag = item.toString().trim().length >= condi;
                }
                break;
            case "em": // validación de email
                {
                    flag = (new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)).test(item.toString().trim());
                }
                break;
            case "dt": // fecha
                {
                    flag = (new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)).test(item.toString().trim());
                }
                break;
            case "int": // validación de email
                {
                    flag = (new RegExp(/^\d+$/)).test(item.toString().trim());
                }
                break;
            case "year": // validación año
                {
                    flag = (new RegExp(/([12]\d{3})/)).test(item.toString().trim());
                }
                break;
            case "pwd": // validación de contraseña
                {
                    flag = (new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/)).test(item.toString().trim());
                }
                break;
            case "city": // validación de ciudad
                {
                    flag = (new RegExp(/[0-9]+\-[0-9]+\-[0-9]+/)).test(item.toString().trim());
                }
                break;
            case "coor": // validación de ciudad
                {
                    flag = (new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,}/).test(item.toString().trim()));
                }
                break;
            default:
                flag = false;
                break;
        }
    } else {
        flag = false;
    }
    return flag;
}

function verifyMaxWords(text, characters)
{
    let contador = 1, pos;
    text = text.trim();
    if (text === "") {
        contador = 0;
    } else {
        pos = text.indexOf(characters);
        while (pos !== -1) {
            contador++;
            pos = text.indexOf(" ", pos + characters.length);
        }
    }
    console.log("palabras:" + contador);
    return contador;
}

function datepart_(datex) {
    if (datex)
    {
        datex = datex.replace("T", " ");
        return datex.substring(0, datex.lastIndexOf(":"));
    }
    return "";
}


/*
 * let falls = recorreCondiciones(objectValidator);
 
 if (falls.length > 0) {
 let alertItem = {
 "information": "Se encontraron " + falls.length + " problemas, resuelvelos para guardar la especie.",
 "status": 4,
 "tittle": "Xiloteca UTEQ."
 };
 alertAll(alertItem);
 multAlerts(falls, 3, "Inicio de Sesión");
 } else {
 callApipersona($scope.modellogin, "logIn");
 }
 */

