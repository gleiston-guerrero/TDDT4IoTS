/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import DAO.Master_projectDAO;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.annotations.JsonAdapter;

import java.io.File;
import java.io.UnsupportedEncodingException;

import models.Master_project;
import util.DataStatic;
import util.FileAccess;
import util.MakerProjects;
import util.Methods;
import util.WeEncoder;

/**
 * @author tonyp
 */
public class Master_projectCtrl {

    private String[][] optionsIoT;
    private String[][] optionsUml;

    private Master_projectDAO master;
    WeEncoder codec;
    private String new_model = "{\"class\":\"GraphLinksModel\",\"nodeIsGroupProperty\":\"_isg\",\"nodeGroupKeyProperty\":\"_g\",\"nodeDataArray\":[],\"linkDataArray\":[]}";

    public Master_projectCtrl() {
        master = new Master_projectDAO();
        codec = new WeEncoder();
        //apiOption - fileOption - defaultInfo - fileImg
        //IoT
        optionsIoT = new String[][]{
            {"ports", "iotPro.json", new_model, "iotPro.png"},
            {"script", "script.ino", "", ""}
        };
        //Uml
        optionsUml = new String[][]{
            {"duml", "umlPro.json", "{}", "umlPro.png"},
            {"dclass", "classPro.json", "{}", "classPro.png"},
            {"dseq", "sequencePro.json", "{}", "sequencePro.png"},
            {"ddesp", "desplieguePro.json", "{}", "desplieguePro.png"},
            {"dsql", "script.sql", "", ""},
            {"ctest", "junitTest.json", "", ""}
        };
    }

    public String selectProjectById(String id_project) {
        String response = master.selectProjectById(id_project);
        return response;
    }

    public String[] selectProjects(String idtype, String userID) {
        String status = "4", message = "Error returning data", data = "[]";
        String flag = "-1";
        if (idtype.equals("PROJECT_USER")) {
            flag = "1";
        } else if (idtype.equals("PROJECT_DETAIL")) {
            flag = "2";
        } else if (idtype.equals("ALL")) {
            flag = "3";
        }

        System.out.println("flag = " + flag + " userid = " + userID);
        if (flag.matches("[123]")) {
            String[] resp = master.selectProjects(flag, userID);
            if (resp[0].equals("2")) {
                JsonArray jarr = Methods.stringToJsonArray(resp[1]);

                for (int index = 0; index < jarr.size(); index++) {
                    String code = jarr.get(index).getAsJsonObject().get("id_masterproject").getAsString();
                    code = codec.textEncryptor(code);

                    //code = codec.textDecryptor(code);
                    jarr.get(index).getAsJsonObject().addProperty("id_masterproject", code);
                }
                status = "2";
                message = "Projects successfully loaded";
                data = jarr.toString();
            }
        } else {
            status = "3";
            message = "Check the parameters entered.";
        }
        return new String[]{status, message, data};
    }

    public String[] insertProject(String name_mp, String description_mp,
            String id_user, String path) {
        String status = "4", message = "Error returning data", data = "[]";
        if (Methods.verifyString(name_mp, "", 30)
                && Methods.verifyMaxWords(description_mp, 150, " ")) {

            WeEncoder we = new WeEncoder();
            FileAccess fac = new FileAccess();

            String path_mp = fac.cleanFileName(name_mp) + we.getUrlGeneric() + id_user;

            Master_project proj = new Master_project();
            proj.setName_mp(name_mp);
            proj.setCode_mp(we.getEmailCode());
            proj.setDescription_mp(description_mp);
            proj.setPath_mp(path_mp);

            String resp[] = master.insertProject(proj, id_user);
            if (resp[0].equals("2")) {
                status = "2";
                message = "Successfully created project.";
                data = resp[1];

                String projPath = path + DataStatic.folderProyect + path_mp;
                System.out.println(projPath);
                File parent = new File(projPath);
                if (!parent.exists()) {
                    parent.mkdir();
                    parent = new File(projPath + "/" + DataStatic.folderEasy);
                    parent.mkdir();
                    parent = new File(projPath + "/" + DataStatic.folderUml);
                    parent.mkdir();
                    parent = new File(projPath + "/" + DataStatic.folderMvmSpring);
                    parent.mkdir();
                    parent = new File(projPath + "/Entregables");
                    parent.mkdir();
                }
            }
        } else {
            status = "3";
            message = "Check input parameters.";
        }
        return new String[]{status, message, data};
    }

    public String[] UpdateInfoProject(String name_mp, String description_mp,
            String id_proj, String id_user) {
        String status = "4", message = "Error returning data", data = "[]";
        if (Methods.verifyString(name_mp, "", 30)
                && Methods.verifyMaxWords(description_mp, 150, " ")) {

            Master_project proj = new Master_project();
            proj.setId_masterproject(id_proj);
            proj.setName_mp(name_mp);
            proj.setDescription_mp(description_mp);

            String resp[] = master.updateProject(proj, id_user);
            if (resp[0].equals("2")) {
                status = "2";
                message = "Successfully created project.";
                data = resp[1];
            }
        } else {
            status = "3";
            message = "Check input parameters.";
        }
        return new String[]{status, message, data};
    }

    public String[] updateModel(String idproj, String module, String state, String iduser, String path) {
        String status = "4", message = "Error returning data", data = "[]";

        String[] params = {"", ""};
        if (module.equals("EasyIoT")) {
            params[0] = "1";
        } else if (module.equals("DiagramUml")) {
            params[0] = "2";
        }

        if (state.equals("CREATE")) {
            params[1] = "A";
        } else if (state.equals("DELETE")) {
            params[1] = "I";
        }

        System.out.println("param 0 -> " + params[0] + " param 1 -> " + params[1]);

        if (params[0].matches("[12]") && params[1].matches("[AI]")) {
            idproj = codec.textDecryptor(idproj);
            String resp[] = master.updateModule(idproj, params[0], params[1], iduser);
            if (resp[0].equals("2")) {
                status = "2";
                message = "The module has been initialized.";
                String absPath = path + DataStatic.folderProyect + resp[1] + "/";

                String pathModule;
                String[][] fileModule;
                if (params[0].equals("1")) {
                    fileModule = optionsIoT;
                    pathModule = absPath + DataStatic.folderEasy + "/";
                } else {
                    fileModule = optionsUml;
                    pathModule = absPath + DataStatic.folderUml + "/";
                    //generar d1 el mvn
                    String rel = DataStatic.folderProyect + resp[1] + "/" + DataStatic.folderUml;
                    //MakerProjects.createMavenProject(path, rel, resp[2]);
                }

                Thread th = new Thread(() -> {
                    FileAccess fac = new FileAccess();
                    for (int i = 0; i < fileModule.length; i++) {
                        boolean r = fac.writeFileText(pathModule + fileModule[i][1], fileModule[i][2]);
                        System.out.println(fileModule[i][1] + " => fileModule file create: " + r);
                    }
                });
                th.start();
            } else {
                status = "3";
                message = "Changes could not be made.";
            }
        } else {
            status = "3";
            message = "Check input parameters.";
        }
        return new String[]{status, message, data};
    }

    public String[] saveJsonModule(String idUser, String idProj, String module, String path, String dataJson) {
        String status = "4", message = "Error saving the modules of the selected project", data = "[]";
        idProj = codec.textDecryptor(idProj);
        String[] resp = master.valitPermitEditJson(idProj, idUser);

        if (resp[0].equals("2") && !resp[1].equals("")) {
            String params = " ";
            System.out.println(module);
            if (module.equals("EasyIoT")) {
                params = "1";
            } else if (module.equals("DiagramUml")) {
                params = "2";
            }

            System.out.println(params);
            if (params.matches("[12]")) {
                String absPath = path + DataStatic.folderProyect + resp[1] + "/";

                String pathModule;
                String[][] fileModule;
                if (params.equals("1")) {
                    fileModule = optionsIoT;
                    pathModule = absPath + DataStatic.folderEasy + "/";
                } else {
                    fileModule = optionsUml;
                    pathModule = absPath + DataStatic.folderUml + "/";
                }
                JsonArray jarr = Methods.stringToJsonArray(dataJson);
                if (jarr.size() > 0) {
                    FileAccess fac = new FileAccess();
                    Thread th = new Thread(() -> {

                        for (int ijarr = 0; ijarr < 10; ijarr++) {
                            JsonObject jso = Methods.JsonElementToJSO(jarr.get(ijarr));
                            String flag = Methods.JsonToString(jso, "diagramType", "");
                            int index = -1;
                            for (int ind = 0; ind < fileModule.length; ind++) {
                                if (flag.equals(fileModule[ind][0])) {
                                    index = ind;
                                }
                            }

                            JsonObject minDataJson = Methods.JsonToSubJSON(jso, "dataJson");
                            String base64 = Methods.JsonToString(jso, "base64", "");
                            if (index != -1) {
                                boolean r = fac.writeFileText(pathModule + fileModule[index][1], minDataJson.toString());
                                if (!fileModule[index][3].equals("")) {
                                    fac.SaveImg(base64, pathModule + fileModule[index][3]);
                                }
                            }
                        }
                    });
                    th.start();
                    status = "2";
                    message = "Modules of the project successfully saved.";
                } else {
                    status = "3";
                    message = "There is no information to save.";
                }
            } else {
                status = "3";
                message = "You can't access this project.";
            }
        }

        return new String[]{status, message, data};
    }

    public String[] getModules(String filePath, String stateUml, String stateIot, String path) {
        // pedir archivos en array
        // 1 nombre, datos, extensión.
        // pasa path y statuss
        String status = "4", message = "Error returning data", data = "[]";

        if (stateUml.matches("[AIS]") && stateIot.matches("[AIS]")) {
            String modulePath = path + DataStatic.folderProyect + filePath + "/";
            FileAccess fac = new FileAccess();

            String aux1 = "No data available.", aux2 = "No data available.", infoUml = "[]", infoIoT = "[]";
            if (stateUml.equals("A")) {
                infoUml = fac.getFileList(modulePath + DataStatic.folderUml);
                aux1 = "Data loaded successfully.";
            }
            if (stateIot.equals("A")) {
                infoIoT = fac.getFileList(modulePath + DataStatic.folderEasy);
                aux2 = "Data loaded successfully.";
            }
            System.out.println("uml => " + aux1);
            System.out.println("iot => " + aux2);
            status = "2";
            message = "Data listed successfully.";
            data = String.format("{\"msgUml\":\"%s\", \"msgIoT\":\"%s\", \"dataUml\":%s, \"dataIoT\":%s}",
                    aux1, aux2, infoUml, infoIoT);
        } else {
            status = "3";
            message = "Check input parameters.";
        }
        return new String[]{status, message, data};
    }

    public String[] deleteProject(String idproj, String idperson) {
        String status = "4", message = "Error returning data", data = "[]";
        String idtype = "1";
        idproj = codec.textDecryptor(idproj);
        String[] resp = master.deleteProject(idtype, idproj, idperson);

        if (resp[0].equals("2") && !resp[1].equals("")) {
            status = "2";
            message = "Data charges correctly.";
            data = resp[1];
        } else {
            status = "4";
            message = "Problems loading data";
        }
        return new String[]{status, message, data};
    }

    public String[] deleteModules(String idproj, String type, String idperson) {
        String status = "4", message = "Error when deleting a module from the selected project", data = "[]";
        String idtype = "1";
        idproj = codec.textDecryptor(idproj);

        String[] resp = master.deleteModule(idtype, type, idproj, idperson);

        if (resp[0].equals("2") && !resp[1].equals("")) {
            status = "2";
            message = "Data charges correctly.";
            data = resp[1];
        } else {
            status = "4";
            message = "Problems loading data";
        }
        return new String[]{status, message, data};
    }

    public String[] getHome(String userID) {
        String status = "4", message = "Error returning data", data = "[]";

        String[] resp = master.getHome(userID);
        if (resp[0].equals("2")) {
            status = "2";
            message = "Projects successfully loaded";
            data = resp[1];
        }

        return new String[]{status, message, data};
    }

    public String[] loadJsonModule(String idUser, String idProj, String module, String path) throws UnsupportedEncodingException {
        String status = "4", message = "Error loading the modules of the selected project", data = "{}";
        idProj = codec.textDecryptor(idProj);
        String[] resp = master.valitPermitEditJson(idProj, idUser);

        if (resp[0].equals("2") && !resp[1].equals("")) {
            String params = " ";
            if (module.equals("EasyIoT")) {
                params = "1";
            } else if (module.equals("DiagramUml")) {
                params = "2";
            } else if (module.equals("ClassDiagram")) {
                params = "3";
            } else if (module.equals("SeguenceDiagram")) {
                params = "4";
            } else if (module.equals("Test")) {
                params = "5";
            }

            if (params.matches("[12345]")) {
                String modulePath = path + DataStatic.folderProyect + resp[1] + "/";

                String fileModule = "";
                if (params.equals("1")) {
                    fileModule = modulePath + DataStatic.folderEasy + "iotPro.json";
                } else if (params.equals("2")) {
                    fileModule = modulePath + DataStatic.folderUml + "umlPro.json";
                } else if (params.equals("3")) {
                    fileModule = modulePath + DataStatic.folderUml + "classPro.json";
                } else if (params.equals("4")) {
                    fileModule = modulePath + DataStatic.folderUml + "sequencePro.json";
                } else if (params.equals("5")) {
                    fileModule = modulePath + DataStatic.folderUml + "junitTest.json";
                }

                FileAccess fac = new FileAccess();
                String fileData = fac.readFileText(fileModule, "f");

                status = "2";
                message = "Project modules successfully loaded.";

                data = Methods.stringToJSON(fileData).toString();

            } else {
                status = "3";
                message = "You can't access this project.";
            }
        }

        return new String[]{status, message, data};
    }

    public String[] angularProject(String idUser, String idProj, String module, String path, String info) {
        String status = "4", message = "Error generating maven project", data = "{}";
        idProj = codec.textDecryptor(idProj);
        String[] resp = master.valitPermitEditJson(idProj, idUser);
        System.out.println("resp[1] = " + resp[1]);
        if (resp[0].equals("2") && !resp[1].equals("")) {
            String params = " ";
            if (module.equals("createAng")) {
                params = "1";
            } else if (module.equals("zipAng")) {
                params = "2";
            } else if (module.equals("downloadAng")) {
                params = "3";
            } else if (module.equals("zipAll")) {
                params = "4";
            } else if (module.equals("downloadAll")) {
                params = "5";
            }

            String nameProject = master.getNameProject(idProj);
            if (params.matches("[12345]")) {
                String relpath = DataStatic.folderProyect + resp[1] + "/";

                status = "2";
                message = "Project successfully completed.";
                data = "{\"idProj\":\"idProj\"}";
                if (params.equals("1")) {
                    MakerProjects.createAngularProject(path, relpath, nameProject, info);
                } else if (params.equals("2")) {
                    MakerProjects.encapsularProyectoZip(
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderAngular,
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderAngular);
                    master.updateStatusDownload(idProj, "download_ang");
                    data = "{\"angularApplication\":\"" + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderAngular + ".zip" + "\"}";
                } else if (params.equals("3")) {
                    data = "{\"angularApplication\":\"" + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderAngular + ".zip" + "\", \"nameFileZip\" : \"" + nameProject + DataStatic.folderAngular + ".zip" + "\"}";
                } else if (params.equals("4")) {
                    MakerProjects.encapsularProyectoZip(
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderAngular,
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + "projectAll");
                    MakerProjects.encapsularProyectoZip(
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderMvmSpring,
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + "projectAll");
                    data = "{\"angularApplication\":\"" + DataStatic.folderProyect + resp[1] + "/" + nameProject + "projectAll" + ".zip" + "\"}";
                    master.updateStatusDownload(idProj, "download_all");

                } else if (params.equals("5")) {
                    data = "{\"angularApplication\":\"" + DataStatic.folderProyect + resp[1] + "/" + nameProject + "projectAll" + ".zip" + "\", \"nameFileZip\" : \"" + nameProject + "projectAll" + ".zip" + "\"}";

                } else {
                    if (!info.equals("")) {
                        //
                    } else {
                        status = "3";
                        message = "No data detected.";
                        data = "{\"idProj\":\"idProj\"}";
                    }
                }
            } else {
                status = "3";
                message = "You can't access this project.";
            }
        }
        return new String[]{status, message, data};

    }

    /**
     * Genera y administra un proyecto Maven para un usuario específico.
     *
     * Este método permite generar y administrar proyectos Maven para un usuario
     * identificado por "idUser". Dependiendo del valor del parámetro "module",
     * se pueden realizar distintas acciones relacionadas con el proyecto Maven.
     * Las posibles acciones son: - "CreateMvn": Crear un nuevo proyecto Maven.
     * - "ZipMvn": Generar un archivo .zip del proyecto Maven existente. -
     * "UpdateMvn": Actualizar un proyecto Maven existente. - "DownloadMvn":
     * Descargar un archivo .zip del proyecto Maven.
     *
     * @param idUser El ID del usuario para el cual se generará o administrará
     * el proyecto Maven.
     * @param idProj El ID cifrado del proyecto Maven. Debe ser desencriptado
     * antes de su uso.
     * @param module El módulo de acción a realizar en el proyecto. Puede ser
     * "CreateMvn", "ZipMvn", "UpdateMvn" o "DownloadMvn".
     * @param path La ruta base del proyecto Maven en el sistema de archivos.
     * @param info Información adicional, dependiendo del módulo seleccionado.
     * Puede estar vacío en ciertos casos.
     * @return Un array de cadenas que contiene tres elementos: - El estado de
     * la operación ("2" si es exitosa, "3" si hay un problema de acceso o "4"
     * si hay un error). - El mensaje de estado ("Project successfully
     * completed.", "You can't access this project." o "Error generating maven
     * project"). - Datos adicionales relacionados con el resultado de la
     * operación en formato JSON.
     */
    public String[] MavenProject(String idUser, String idProj, String module, String path, String info) {
        String status = "4", message = "Error generating maven project", data = "{}";
        idProj = codec.textDecryptor(idProj);
        String[] resp = master.valitPermitEditJson(idProj, idUser);
        System.out.println("resp[1] = " + resp[1]);
        if (resp[0].equals("2") && !resp[1].equals("")) {
            String params = " ";
            if (module.equals("CreateMvn")) {
                params = "1";
            } else if (module.equals("ZipMvn")) {
                params = "2";
            } else if (module.equals("UpdateMvn")) {
                params = "3";
            } else if (module.equals("DownloadMvn")) {
                params = "4";
            }

            String nameProject = master.getNameProject(idProj);
            if (params.matches("[1234]")) {
                String relpath = DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderMvmSpring + "/";

                status = "2";
                message = "Project successfully completed.";
                data = "{\"idProj\":\"idProj\"}";
                if (params.equals("1")) {
                    MakerProjects.createMavenProject(path, relpath, nameProject, info);
                } else if (params.equals("2")) {
                    MakerProjects.encapsularProyectoZip(
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderMvmSpring,
                            path + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderMvmSpring);
                    master.updateStatusDownload(idProj, "download");
                    data = "{\"MavenApplication\":\"" + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderMvmSpring + ".zip" + "\"}";
                } else if (params.equals("4")) {
                    data = "{\"MavenApplication\":\"" + DataStatic.folderProyect + resp[1] + "/" + nameProject + DataStatic.folderMvmSpring + ".zip" + "\", \"nameFileZip\" : \"" + nameProject + DataStatic.folderMvmSpring + ".zip" + "\"}";
                } else {
                    if (!info.equals("")) {
                        //
                    } else {
                        status = "3";
                        message = "No data detected.";
                        data = "{\"idProj\":\"idProj\"}";
                    }
                }
            } else {
                status = "3";
                message = "You can't access this project.";
            }
        }
        return new String[]{status, message, data};
    }

    public String[] selectHomeProject() {
        String status = "4", message = "Error returning data", data = "{}";
        String idType = "1";
        String[] resp = master.selectHomeProject(idType);

        if (resp[0].equals("2") && !resp[1].equals("")) {

            status = "2";
            message = "Data charges correctly.";
            data = resp[1];

        } else {
            status = "4";
            message = "Problems loading data";
        }

        return new String[]{status, message, data};
    }

    public String[] shareProject(String idUser, String emailShare, String idproj, String permit, String state) {
        String status = "4", message = "Error when sharing the project", data = "{}";
        String permitShare = "", stateShare = "";
        idproj = codec.textDecryptor(idproj);
        if (permit.equals("SHARE_ADMIN")) {
            permitShare = "A";
        } else if (permit.equals("SHARE_WRITER")) {
            permitShare = "W";
        } else {
            permitShare = "R";
        }

        switch (state) {
            case "WAITING":
                stateShare = "S";
                break;
            case "ACTIVE":
                stateShare = "A";
                break;
            default:
                stateShare = "I";
                break;
        }

        String[] resp = master.shareProjectforEmail(idUser, emailShare, idproj, permitShare, stateShare);

        switch (resp[0]) {
            case "2":
                status = "2";
                message = "Successfully shared project.";
                break;
            case "3":
                status = "3";
                message = "There is no user registered with that email.";
                break;
            default:
                status = "4";
                message = "The project could not be shared.";
                break;
        }

        return new String[]{status, message, data};
    }

    public String[] listShareProject(String idPerson, String typeSelect, String idProject) {
        String status = "4", message = "Error returning data", data = "{}";
        String idType = typeSelect;
        idProject = !idProject.equals("0") ? codec.textDecryptor(idProject) : "0";
        String[] resp = master.listShareProject(idType, idPerson, idProject);

        if (resp[0].equals("2")) {
            JsonArray jarr = Methods.stringToJsonArray(resp[1]);

            for (int index = 0; index < jarr.size(); index++) {
                String code = jarr.get(index).getAsJsonObject().get("id_masterproject").getAsString();
                code = codec.textEncryptor(code);
                jarr.get(index).getAsJsonObject().addProperty("id_masterproject", code);
            }

            for (int index = 0; index < jarr.size(); index++) {
                String code = jarr.get(index).getAsJsonObject().get("id_permitmaster").getAsString();
                code = codec.textEncryptor(code);
                jarr.get(index).getAsJsonObject().addProperty("id_permitmaster", code);
            }

            status = "2";
            message = "Projects successfully loaded";
            data = jarr.toString();
        }

        return new String[]{status, message, data};
    }

    public String[] aceptInvitation(String idProject, String permit, String joinActive) {
        String status = "4", message = "Error accepting shared project invitation", data = "{}";
        idProject = codec.textDecryptor(idProject);
        if (joinActive.equals("I")) {
            message = "You are no longer a contributor to this project, the group appreciates the time you spent on the development of this project.";
        }
        if (master.aceptInvitation(idProject, permit, joinActive)) {

            status = "2";
            message = "Invitation successfully accepted, now you can collaborate with the development of this project.";

        } else {
            status = "4";
        }

        return new String[]{status, message, data};
    }

    public String getPropertyProject(String idperson, String idprojectmaster) {
        String idmastProject = codec.textDecryptor(idprojectmaster);
        return master.getprojectProperty(idperson, idmastProject);
    }
}
