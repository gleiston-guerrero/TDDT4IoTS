app.expandControllerA = function ($scope) {
    //#region VARIABLES
    $scope.methodsTdd = [];
    $scope.classTdd = [];
    $scope.cssMethod = "";
    $scope.methodSelected = {};
    $scope.jsonTdd = {
        "idproject": "",
        "type": "message",
        "subytpe": "tdd",
        "typeSave": "",
        "numer": "",
        "receiveTDDJSOM": $scope.classTdd
    }; // variable general de todo el test a guardar
    $scope.simbolVisi = {
        "public": "+",
        "private": "-",
        "protected": "#",
        "static": "$",
        "abstract": "?",
        "final": "¬",
        "interface": "@"
    }
    $scope.classNameSelected = "";
    $scope.arr = [];
    var global = "";
    $scope.instanceCode = undefined;
    $scope.flagSelected = false;
    //#endregion VARIABLES

    //#region FUNCIONES UTILITARIAS

    // funcion para abrir el modal de las tdd
    $scope.openModalTdd = () => {
        $("#modal_generate_tdd").modal();
    };

    $scope.cancelActiveMethod = () => {
        $scope.flagSelected = false;
    }

    // funcion para seleccionar un metodo
    $scope.activeMethod = (method, pack, className) => {
        $scope.classNameSelected = className;
        $scope.flagSelected = true;
        let objectSelected = $scope.existMethod($scope.classTdd, "class", className);
        if (method.type !== "void") {
            if (!objectSelected[1]) {
                $scope.classTdd.push({
                    "Type": "",
                    "Pack": pack,
                    "class": className,
                    "Methods": []
                });
            }
        }
        $scope.cssMethod = method.name; // methodsDiagram.name
        $scope.methodSelected = method;
        console.log($scope.classTdd);
    }


    // funcion para agregar un nuevo test
    $scope.addTest = (method) => {
        let values = [];
        // recorremos los parametros
        for (let i = 0; i < method.parameters.length; i++) {
            let typeData = method.parameters[i].type.split(":");
            let newTypeData = "";
            if (typeData.length > 1) {
                newTypeData = typeData[1];
            } else {
                newTypeData = method.parameters[i].type;
            }
            let value = $("#param" + i);

            if($scope.returnMethod === undefined){
                alertAll({status: 3, information: "Please fill in all parameters."});
                values.length = 0;
                return;
            }

            if(value.val().trim() === "" || $scope.returnMethod.trim() === ""){
                alertAll({status: 3, information: "Please fill in all parameters."});
                values.length = 0;
                return;
            }

            values.push({
                "typeDate": newTypeData,
                "name": method.parameters[i].name,
                "value": value.val()
            })
            value.val("");
        }
        let classSelected = $scope.existMethod($scope.classTdd, "class", $scope.classNameSelected);
        let position = !classSelected[1] ? 0 : classSelected[0];
        $scope.methodsTdd = $scope.classTdd[position]["Methods"];
        let existMethod = $scope.existMethod($scope.methodsTdd, "NameMethod", method.name);
        if (existMethod[1]) {
            $scope.methodsTdd[existMethod[0]].parameters.push(values);
            $scope.methodsTdd[existMethod[0]].return.push({
                "type": $scope.methodSelected.type,
                "value": $scope.returnMethod
            });
            $scope.returnMethod = "";
        } else {
            $scope.methodsTdd.push({
                "typeVisibility": method.visibility,
                "TypeMethods": method.type,
                "NameMethod": method.name,
                "parameters": [values],
                "return": [{"type": $scope.methodSelected.type, "value": $scope.returnMethod}]
            });
        }
        $scope.returnMethod = "";
        console.log($scope.jsonTdd);

    }

    $scope.deleteTest = (position) => {
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
                let objectTest = $scope.searchMethodTest($scope.methodSelected.name).parameters;
                console.log(objectTest);
                $scope.$apply(() => {
                    objectTest.splice(position, 1);
                    if (objectTest.length === 0) {
                        let objClass = $scope.existMethod($scope.classTdd, "class", $scope.classNameSelected);
                        if (objClass[1]) {
                            $scope.classTdd.splice(objClass[0], 1);
                            console.log($scope.classTdd);
                            console.log($scope.jsonTdd);
                        }
                    }
                });
            }
        });
    };

    // buscar el json del metodo que tiene un tezst
    $scope.searchMethodTest = (name) => {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });
        let classSelected = $scope.existMethod($scope.classTdd, "class", $scope.classNameSelected);
        if (classSelected[0] !== -1) {
            let position = !classSelected[1] ? 0 : classSelected[0];
            $scope.methodsTdd = $scope.classTdd[position]["Methods"];
            for (let i = 0; i < $scope.methodsTdd.length; i++) {
                if ($scope.methodsTdd[i].NameMethod === name) {
                    return $scope.methodsTdd[i];
                }
            }
            return [];
        }
    };

    // metodo que verifica su un metodo ya existe con test
    $scope.existMethod = (array, key, name) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === name) {
                return [i, true];
            }
        }
        return [-1, false];
    };

    //#endregion FUNCIONES UTILITARIAS

    $scope.generateTddGlobal = () => {
        let codeJUnit = $scope.generateCodeJUnit($scope.classTdd);
        loadCodeTDD(codeJUnit);
        $("#modal_code_tdd").modal();
        console.log(codeJUnit);
    };

    // funcion para visualziar el codigo tdd de una clase seleccionada
    $scope.viewCodeTddClass = (className) => {
        let positionClass = $scope.existMethod($scope.classTdd, "class", className);
        if (positionClass[1]) {
            let codeJUnit = $scope.generateCodeJUnitClass($scope.classTdd[positionClass[0]]);
            loadCodeTDD(codeJUnit);
            $("#modal_code_tdd").modal();
            console.log(codeJUnit);
        }
    };

    /**
     * METODO PARA GENERAR EL CODIGO DE JTESTUNIT
     * */
    $scope.generateCodeJUnit = (jsonconjuntest) => {
        var a = global.split(";");
        var string = "//package " + "package of name" + " \nimport org.junit.After;\n" +
            "import org.junit.AfterClass;\n" +
            "import org.junit.Before;\n" +
            "import org.junit.BeforeClass;\n" +
            "import org.junit.Test;\n" +
            "import static org.junit.Assert.*; \n\n";
        for (let itemClass of jsonconjuntest) {
            var type = itemClass.Type;
            var className = itemClass.class;
            var arrayclassName = className;
            string += "\t" + type + " class " + arrayclassName + "{\n";
            string += "\t" + arrayclassName + " instance = new " + arrayclassName + "();\n";
            string += "\t" + type + " " + arrayclassName + "(){\n}\n";
            string += "\t@BeforeClass \n" +
                "\tpublic static void setUpClass() { \n" +
                "\t} \n" +
                "\t@AfterClass \n" +
                "\tpublic static void tearDownClass() { \n" +
                "\t} \n" +
                "\t@Before \n" +
                "\tpublic void setUp() { \n" +
                "\t} \n" +
                "\t@After \n" +
                "\tpublic void tearDown() { \n" +
                "\t}\n";
            let methods = itemClass.Methods;
            var num = 0;
            for (let itemTest of methods) {
                for (let itemMethods of itemTest.parameters) {
                    if (num < itemTest.parameters.length) {
                        string += "\n \t@Test \n";
                        var typeMethods = itemTest.TypeMethods;
                        var nameMethod = itemTest.NameMethod;
                        string += "\tpublic void" + " " + nameMethod + "_Test" + num + "(){\n";
                        //let data2 = JSON.parse(item.parameter);
                        string += "\t\tSystem.out.println(\"" + nameMethod + "\");\n";
                        let parameters = itemTest.parameters[num];
                        var params = new Array(parameters.length);
                        var typeDate = new Array(parameters.length);
                        var value = new Array(parameters.length);
                        var indx = 0;
                        for (let itemParameters of parameters) {
                            typeDate[indx] = (itemParameters.typeDate);
                            params[indx] = (itemParameters.name);
                            value[indx] = (itemParameters.value);

                            if (typeDate[indx] === ("String"))
                                string += "\t\t" + typeDate[indx] + " " + params[indx] + " = \"" + value[indx] + "\";\n";
                            else if (typeDate[indx] === ("char"))
                                string += "\t\t" + typeDate[indx] + " " + params[indx] + " = '" + value[indx] + "';\n";
                            else
                                string += "\t\t" + typeDate[indx] + " " + params[indx] + " = " + value[indx] + ";\n";
                            indx++;
                        }
                        var retrun = (itemTest.return[num]);
                        if (retrun["type"] === ("String"))
                            string += "\t\t" + typeMethods + " expResult =\"" + retrun["value"] + "\";\n";
                        else if (retrun["type"] === ("char"))
                            string += "\t\t" + typeMethods + " expResult ='" + retrun["value"] + "';\n";
                        else
                            string += "\t\t" + typeMethods + " expResult =" + retrun["value"] + ";\n";

                        string += "\t\t" + typeMethods + " result = " + "instance" + "." + nameMethod + "(";
                        indx = 0;
                        for (let itemParameters of parameters) {
                            if (indx === params.length - 1)
                                string += " " + params[indx] + ");\n";
                            else
                                string += " " + params[indx] + ", ";

                            indx++;
                        }
                        string += "\t\t//assertEquals(expResult, result);\n";
                        string += "\t\t// TODO review the generated test code and remove the default call to fail.\n";
                        if (typeMethods === "String")
                            string += "\t\tif(!expResult.equals(result))\n";
                        else
                            string += "\t\tif(expResult!=(result))\n";
                        string += "\t\t\tfail(\"The test case is a prototype.\");\n";
                        string += "\t\telse\n\t\t\tSystem.out.println(\"The test case is a good prototype!\");\n}";

                        num += 1;
                    }
                    string += "\t}\n\n";
                }
            }
        }

        //console.log(string);
        return string;
    }

    $scope.generateCodeJUnitClass = (itemClass) => {
        var a = global.split(";");
        var string = "//package " + "package of name" + " \nimport org.junit.After;\n" +
            "import org.junit.AfterClass;\n" +
            "import org.junit.Before;\n" +
            "import org.junit.BeforeClass;\n" +
            "import org.junit.Test;\n" +
            "import static org.junit.Assert.*; \n\n";
        var type = itemClass.Type;
        var className = itemClass.class;
        var arrayclassName = className;
        string += "\t" + type + " class " + arrayclassName + "{\n";
        string += "\t" + arrayclassName + " instance = new " + arrayclassName + "();\n";
        string += "\t" + type + " " + arrayclassName + "(){\n}\n";
        string += "\t@BeforeClass \n" +
            "\tpublic static void setUpClass() { \n" +
            "\t} \n" +
            "\t@AfterClass \n" +
            "\tpublic static void tearDownClass() { \n" +
            "\t} \n" +
            "\t@Before \n" +
            "\tpublic void setUp() { \n" +
            "\t} \n" +
            "\t@After \n" +
            "\tpublic void tearDown() { \n" +
            "\t}\n";
        let methods = itemClass.Methods;
        var num = 0;
        for (let itemTest of methods) {
            for (let itemMethods of itemTest.parameters) {
                if (num < itemTest.parameters.length) {
                    string += "\n \t@Test \n";
                    var typeMethods = itemTest.TypeMethods;
                    var nameMethod = itemTest.NameMethod;
                    string += "\tpublic void" + " " + nameMethod + "_Test" + num + "(){\n";
                    //let data2 = JSON.parse(item.parameter);
                    string += "\t\tSystem.out.println(\"" + nameMethod + "\");\n";
                    let parameters = itemTest.parameters[num];
                    var params = new Array(parameters.length);
                    var typeDate = new Array(parameters.length);
                    var value = new Array(parameters.length);
                    var indx = 0;
                    for (let itemParameters of parameters) {
                        typeDate[indx] = (itemParameters.typeDate);
                        params[indx] = (itemParameters.name);
                        value[indx] = (itemParameters.value);

                        if (typeDate[indx] === ("String"))
                            string += "\t\t" + typeDate[indx] + " " + params[indx] + " = \"" + value[indx] + "\";\n";
                        else if (typeDate[indx] === ("char"))
                            string += "\t\t" + typeDate[indx] + " " + params[indx] + " = '" + value[indx] + "';\n";
                        else
                            string += "\t\t" + typeDate[indx] + " " + params[indx] + " = " + value[indx] + ";\n";
                        indx++;
                    }
                    var retrun = (itemTest.return[num]);
                    if (retrun["type"] === ("String"))
                        string += "\t\t" + typeMethods + " expResult =\"" + retrun["value"] + "\";\n";
                    else if (retrun["type"] === ("char"))
                        string += "\t\t" + typeMethods + " expResult ='" + retrun["value"] + "';\n";
                    else
                        string += "\t\t" + typeMethods + " expResult =" + retrun["value"] + ";\n";

                    string += "\t\t" + typeMethods + " result = " + "instance" + "." + nameMethod + "(";
                    indx = 0;
                    for (let itemParameters of parameters) {
                        if (indx === params.length - 1)
                            string += " " + params[indx] + ");\n";
                        else
                            string += " " + params[indx] + ", ";

                        indx++;
                    }
                    string += "\t\t//assertEquals(expResult, result);\n";
                    string += "\t\t// TODO review the generated test code and remove the default call to fail.\n";
                    if (typeMethods === "String")
                        string += "\t\tif(!expResult.equals(result))\n";
                    else
                        string += "\t\tif(expResult!=(result))\n";
                    string += "\t\t\tfail(\"The test case is a prototype.\");\n";
                    string += "\t\telse\n\t\t\tSystem.out.println(\"The test case is a good prototype!\");\n}";

                    num += 1;
                }
                string += "\t}\n\n";
            }
        }

        //console.log(string);
        return string;
    }

    //#region VIEW CODE

    let loadCodeTDD = (code) => {
        $("#modal_generate_tdd").modal("hide");
        $("#modal_code_tdd").modal("show");
        $scope.instanceCode.setValue(code);
    }

    $scope.closeCodeTdd = () => {
        $("#modal_generate_tdd").modal("show");
        $("#modal_code_tdd").modal("hide");
    }

    $scope.initCode = () => {
        let codeDefault = "//Code generated by the application TddM4IoTs";
        $scope.instanceCode = CodeMirror(document.getElementById("codeTdd"),
            {
                lineNumbers: true,
                mode: "text/x-java",
                matchBrackets: true,
                readOnly: true,
                styleActiveLine: true,
                theme: 'eclipse',
                indentUnit: 2,
                height: 765
            });
        //instanceCode.setValue(codeDefault);
    }

    //#endregion VIEW CODE

}
