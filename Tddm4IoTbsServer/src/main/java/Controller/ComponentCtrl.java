
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import DAO.ComponentDAO;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.io.File;
import models.Component;
import util.DataStatic;
import util.FileAccess;
import util.Methods;
import util.WeEncoder;

/**
 *
 * @author tonyp
 */
public class ComponentCtrl {

    private ComponentDAO cdao;

    public ComponentCtrl() {
        cdao = new ComponentDAO();
    }

    public String[] selectComponents(String idtype, String userID, String contextPath) {
        String status = "4", message = "Error returning data", data = "[]";
        String flag = "-1";
        if (idtype.equals("ALL")) {
            flag = "2";//Todos los componentes
        }
        if (idtype.equals("ACTIVE")) {
            flag = "3";//Componentes activos
        }
        if (idtype.equals("ACTIVE ALL")) {
            flag = "8";//Componentes activos
        }
        if (idtype.equals("INACTIVE")) {
            flag = "4";//Componentes inactivos
        }
        if (idtype.equals("SLEEP")) {
            flag = "5";//Componentes en espera
        }
        if (idtype.equals("MINE")) {
            flag = "6";//Componentes de un usuario
        }
        if (idtype.equals("REJECT")) {
            flag = "5";//Componentes de un usuario
        }
        if (idtype.equals("MY ALL ACTIVE")) {
            flag = "9";//Componentes de un usuario y los activos
        }

        if (flag.matches("[23456789]")) {
            String[] resp = cdao.selectComponents(flag, userID);
            if (resp[0].equals("2")) {
                JsonArray jarr = Methods.stringToJsonArray(resp[1]);
                if (jarr.size() > 0) {
                    for (int i = 0; i < jarr.size(); i++) {
                        JsonObject jso = Methods.JsonElementToJSO(jarr.get(i));
                        String folder = Methods.JsonToString(jso, "pathports_component", "");
                        if (folder.length() > 0) {
                            String path = DataStatic.getLocation(contextPath) + DataStatic.folderComponent + folder;
                            jso.add("data_json", Methods.stringToJSON(cdao.readFile(path)));
                        }
                    }
                    status = "2";
                    message = "Components successfully loaded";
                    data = jarr.toString();
                } else {
                    status = "3";
                    message = "You have no components entered";
                    data = jarr.toString();
                }
            }
        } else {
            status = "3";
            message = "Check the parameters entered.";
        }
        return new String[]{status, message, data};
    }

    public String[] getComponentInfo(String idquery, String contextPath) {
        String status = "4", message = "Error returning data", data = "[]";
        if (idquery.matches("[0-9]+")) {
            String[] resp = cdao.selectComponents("1", idquery);
            if (resp[0].equals("2")) {
                JsonArray jarr = Methods.stringToJsonArray(resp[1]);
                if (jarr.size() > 0) {
                    JsonObject jso = Methods.JsonElementToJSO(jarr.get(0));
                    String folder = Methods.JsonToString(jso, "pathports_component", "");
                    if (folder.length() > 0) {
                        String path = DataStatic.getLocation(contextPath) + DataStatic.folderComponent + folder;
                        jso.add("data_json", Methods.stringToJSON(cdao.readFile(path)));
                    }
                }
                status = "2";
                message = "Components successfully loaded";
                data = jarr.toString();
            }
        } else {
            status = "3";
            message = "Check the parameters entered.";
        }
        return new String[]{status, message, data};
    }

    public String[] insertComponent(
            String name_component,
            String description_component,
            String type_component,
            String person_id_person,
            String contextPath,
            String base64img,
            String dataJson,
            String permitUser
    ) {
        String status = "4", message = "Error returning data", data = "[]";

        Methods.verifyString(name_component, "", 35);

        Component com = new Component();
        WeEncoder we = new WeEncoder();
        FileAccess fac = new FileAccess();

        String folderName = fac.cleanFileName(name_component) + we.getUrlGeneric() + person_id_person;
        com.setPathports_component(folderName);
        com.setPathimg_component(folderName);

        com.setType_component(type_component);
        com.setDescription_component(description_component);
        com.setName_component(name_component);
        com.setPerson_id_person(person_id_person);
        com.setActive_component(permitUser.matches("[RA]") ? "A" : "S");

        String[] resp = cdao.saveComponent(com);
        if (resp[0].equals("2")) {
            Thread th = new Thread(() -> {
                try {
                    String path = DataStatic.getLocation(contextPath) + DataStatic.folderComponent + folderName;
                    File fold = new File(path);
                    if (!fold.exists()) {
                        fold.mkdir();
                    }

                    cdao.saveImage(path + "/", base64img);
                    cdao.saveFile(path + "/", dataJson);
                    System.out.println("[creando archivo]: " + path);
                } catch (Exception e) {
                    System.out.println("[Error en hilo] " + e.getMessage());
                }
            });
            th.start();
            data = resp[1];
            message = "The return is successful";
            status = resp[0];
        }

        return new String[]{status, message, data};
    }

    public String[] stateComponent(String idcomponent, String state, String permit) {
        System.out.println("stateComponent");
        String status = "4", message = "Error returning data", data = "[]";
        String action = "X";
        if (state.equals("APROBE")) {
            action = "A";
        }
        if (state.equals("DELETE")) {
            action = "I";
        }
        if (state.equals("REJECT")) {
            if (permit.matches("[AR]")) {
                action = "R";
            }
        }
        if (idcomponent.matches("[0-9]+") && action.matches("[AIR]")) {
            String resp = cdao.stateComponent(idcomponent, action);
            if (resp.equals("2")) {
                status = "2";
                message = "Components successfully loaded";
            }
        } else {
            status = "3";
            message = "Check the parameters entered.";
        }
        return new String[]{status, message, data};
    }

    public String[] updateComponent(
            String idComponent,
            String name_component,
            String description_component,
            String type_component,
            String person_id_person,
            String contextPath,
            String dataJson,
            String folderName
    ) {
        String status = "4", message = "Error returning data", data = "[]";

        Methods.verifyString(name_component, "", 35);

        Component com = new Component();
        WeEncoder we = new WeEncoder();
        FileAccess fac = new FileAccess();

        com.setId_component(idComponent);
        com.setType_component(type_component);
        com.setDescription_component(description_component);
        com.setName_component(name_component);
        com.setPerson_id_person(person_id_person);

        String[] resp = cdao.UpdateComponent(com);
        if (resp[0].equals("2")) {
            Thread th = new Thread(() -> {
                try {
                    String path = DataStatic.getLocation(contextPath) + DataStatic.folderComponent + folderName;
                    File fold = new File(path);
                    if (!fold.exists()) {
                        fold.mkdir();
                    }
                    cdao.saveFile(path + "/", dataJson);
                    System.out.println("[creando archivo]: " + path);
                } catch (Exception e) {
                    System.out.println("[Error en hilo] " + e.getMessage());
                }
            });
            th.start();
            data = resp[1];
            message = "The return is successful";
            status = resp[0];
        }

        return new String[]{status, message, data};
    }
}
