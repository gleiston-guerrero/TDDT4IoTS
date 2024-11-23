/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import DAO.PersonDAO;
import models.Person;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import javax.swing.table.DefaultTableModel;
import util.DataStatic;
import util.FileAccess;
import util.Methods;
import util.TemplateEmail;
import util.WeEncoder;

/**
 *
 * @author tonyp
 */
public class PersonaCtrl {

    /**
     * Instancia del acceso a datos de persona.
     */
    PersonDAO pdao;
    /**
     * Instancia de la clase destinada a encriptar y generar el código de
     * verificación
     */
    WeEncoder codec;

    public PersonaCtrl() {
        pdao = new PersonDAO();
    }

    public String[] insertPerson(
            String names,
            String lastname,
            String email,
            String password,
            String id_city,
            String provider,
            String base,
            String context
    ) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        System.out.println(names);
        System.out.println(lastname);
        System.out.println(email);
        System.out.println(password);
        System.out.println(provider);

        if (Methods.verifyString(names, "", 75)
                && Methods.verifyString(lastname, "", 75)
                && Methods.comprobeEmail(email)
                && ((Methods.comprobePassword(password) && provider.equals("native")) || !provider.equals("native"))
                && Methods.testregex("[0-9]+\\-[0-9]+\\-[0-9]+", id_city)
                && Methods.verifyString(provider, "", 15)) {
            codec = new WeEncoder();
            password = codec.encriptPassword(password);
            String code = codec.getEmailCode();

            Person per = new Person();

            per.setName_person(names.toUpperCase());
            per.setLastname_person(lastname.toUpperCase());
            per.setEmail_person(email.toLowerCase());
            per.setPassword_person(password);
            per.setId_city(id_city);
            per.setCodeverifitacion_person(code);
            per.setProvider_person(provider.equals("native") ? "native" : "U");
            per.setType_person("U");

            String[] answer = pdao.insertPerson(per);

            switch (answer[0]) {
                case "2": {
                    //todo bien, 'logeate'
                    JsonArray jarr = Methods.stringToJsonArray(answer[1]);
                    JsonObject jso = Methods.getIndixJarray(jarr, 0);
                    if (jso.size() > 0) {

                        if (per.getType_person().equals("S")) {
                            TemplateEmail temp = new TemplateEmail();
                            temp.insertarUsuario(per.getEmail_person(), per.getName_person(), per.getLastname_person(),
                                    per.getCodeverifitacion_person());
                            pdao.insertCodigo(per.getEmail_person(), per.getCodeverifitacion_person());
                        }
                        if (base.length() > 0) {
                            Thread tr = new Thread(() -> {
                                FileAccess fac = new FileAccess();
                                boolean resp = fac.SaveImg(base, DataStatic.getLocation(context)
                                        + DataStatic.folderUser + email.toLowerCase() + ".png");
                            });
                            tr.start();
                        }
                        status = "2";
                        message = "User registered successfully.";
                        data = "[" + pdao.personToJson(jso, "webapp") + "]";
                    } else {
                        status = "4";
                        message = "User data not available.";
                    }
                }
                break;
                case "3": {
                    status = "3";
                    message = "This email is associated with another account.";
                }
                break;
                default: {
                    status = "4";
                    message = "The user could not be registered, please try again.";
                }
                break;
            }
        }
        return new String[]{status, message, data};
    }

    public String[] logIn(String email, String password, String provider, String customer) {
        String status = "4", message = "Error in the entered parameters", data = "[]";

        if (Methods.comprobeEmail(email) && ((Methods.comprobePassword(password) && provider.equals("native"))
                || !provider.equals("native"))) {
            codec = new WeEncoder();
            System.out.println("PD:" + password);
            password = codec.encriptPassword(password);
            Person per = new Person();
            per.setEmail_person(email.toLowerCase());
            per.setPassword_person(password);

            System.out.println("PD:" + password);
            DefaultTableModel tab = pdao.logIn(per);//4
            if (tab.getRowCount() > 0) {

                int[] resp = pdao.getIndexLogin(tab, password, provider, 4, 7);
                if (resp[0] != 4) {
                    switch (resp[0]) {
                        case 2: {
                            JsonObject jso = Methods.RowToJson(tab, resp[1]);
                            if (jso.size() > 0) {
                                if (tab.getValueAt(resp[1], 6).toString().equals("S")) {
                                    status = "5";
                                    message = "Your account has not been verified.";
                                    data = "[" + pdao.personToJson(jso, customer) + "]";
                                } else {
                                    status = "2";
                                    message = "Session successfully started.";
                                    data = "[" + pdao.personToJson(jso, customer) + "]";
                                }
                            } else {
                                status = "3";
                                message = "User data not available.";
                            }
                        }
                        break;
                        case 3: {
                            status = "3";
                            message = "Incorrect password.";
                        }
                        break;
                        case 5: {
                            status = "3";
                            message = "This email is registered with " + tab.getValueAt(resp[1], 7).toString() + ".";
                            message = message.replace("con native", "manually in the app");
                        }
                        break;
                        default: {
                            status = "3";
                            message = "The access parameters are not valid, verify that you are accessing with the correct provider.";
                        }
                        break;
                    }
                } else {
                    status = "4";
                    message = "Unregistered user.";
                }
            } else {
            }
        } else {
            status = "3";
            message = "Invalid entered parameters.";
        }
        return new String[]{status, message, data};
    }

    public String[] updatePerson(String id_person, String name, String lastname, String id_city) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (Methods.isInteger(id_person)
                && Methods.verifyString(name, "", 75)
                && Methods.verifyString(lastname, "", 75)
                //                && Methods.verifyMaxLength(contacto, 20)
                && Methods.testregex("[0-9]+\\-[0-9]+\\-[0-9]+", id_city)) {
            Person per = new Person();
            per.setId_person(id_person);
            per.setName_person(name.toUpperCase());
            per.setLastname_person(lastname.toUpperCase());
            per.setId_city(id_city);

            String[] answer = pdao.updatePerson(per);
            if (answer[0].equals("2")) {
                //todo bien, 'logeate'
                JsonArray jarr = Methods.stringToJsonArray(answer[1]);
                JsonObject jso = Methods.getIndixJarray(jarr, 0);
                if (jso.size() > 0) {
                    status = "2";
                    message = "Data successfully modified.";
                    data = "[" + pdao.personToJson(jso, "webapp") + "]";
                } else {
                    status = "4";
                    message = "User data not available.";
                }
            } else {
                status = "4";
                message = "The user could not be edited, please try again.";
            }
        }
        return new String[]{status, message, data};
    }

    public String[] requestCode(String identifier, String flag) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (flag.equals("1") || flag.equals("2")) {

            codec = new WeEncoder();
            String code = codec.getEmailCode();
            Person per = new Person();
            per.setCodeverifitacion_person(code);
            if (flag.equals("1") && Methods.isInteger(identifier)) {
                per.setId_person(identifier);
            } else if (flag.equals("2") && Methods.comprobeEmail(identifier)) {
                per.setEmail_person(identifier);
            }
            String[] answer = pdao.requestCode(per, flag);
            switch (answer[0]) {
                case "2":
                    JsonArray jarr = Methods.stringToJsonArray(answer[1]);
                    JsonObject jso = Methods.getIndixJarray(jarr, 0);
                    if (jso.size() > 0) {

                        TemplateEmail temp = new TemplateEmail();
                        temp.solicitarCodigo(
                                Methods.JsonToString(jso, "email_person", ""),
                                Methods.JsonToString(jso, "name_person", ""),
                                Methods.JsonToString(jso, "lastname_person", ""),
                                code);

                    }
                    status = "2";
                    message = "Code successfully requested.";
                    break;
                case "3":
                    status = "3";
                    message = "Email not associated with any account.";
                    break;
                default:
                    status = "4";
                    message = "The code has not been requested, please try again.";
                    break;
            }
        }
        return new String[]{status, message, data};
    }

    public String[] changePassword(String identifier, String code, String password, String flag) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (flag.equals("1") || flag.equals("2") && Methods.comprobePassword(password) && Methods.verifyString(code, "", 10)) {
            codec = new WeEncoder();
            password = codec.encriptPassword(password);
            Person per = new Person();
            per.setCodeverifitacion_person(code);
            per.setPassword_person(password);
            if (flag.equals("1") && Methods.isInteger(identifier)) {
                per.setId_person(identifier);

            } else if (flag.equals("2") && Methods.comprobeEmail(identifier)) {
                per.setEmail_person(identifier);
            }
            String answer = pdao.changePassword(per, flag);
            switch (answer) {
                case "2":
                    status = "2";
                    message = "Password changed successfully.";
                    break;
                case "3":
                    status = "3";
                    message = "Email not associated with any account.";
                    break;
                case "5":
                    status = "3";
                    message = "The code entered is invalid.";
                    break;
                default:
                    status = "4";
                    message = "It is not possible to change your password, please try again.";
                    break;
            }
        }
        return new String[]{status, message, data};
    }

    public String[] activeAccount(String identifier, String code) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (Methods.isInteger(identifier) && Methods.verifyString(code, "", 10)) {
            Person per = new Person();
            per.setId_person(identifier);
            per.setCodeverifitacion_person(code);
            if (pdao.activeAccount(per)) {
                status = "2";
                message = "Your account has been verified, please log in again.";
            } else {
                status = "4";
                message = "Your account could not be activated, please try again.";
            }
        }
        return new String[]{status, message, data};
    }

    public String[] changeImage(String identifier, String context, String imageInfo) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (Methods.isInteger(identifier) && Methods.verifyString(imageInfo, "", -1)) {
            Person per = new Person();
            per.setId_person(identifier);
            String img_name = pdao.changeImage(per);
            if (Methods.verifyString(img_name, "", 105)) {
                FileAccess fac = new FileAccess();
                boolean resp = fac.SaveImg(imageInfo, DataStatic.getLocation(context) + DataStatic.folderUser + img_name);
                if (resp) {
                    status = "2";
                    message = "Image changed successfully.";
                } else {
                    status = "4";
                    message = "An image processing problem has occurred, please try again.";
                }
            } else {
                status = "4";
                message = "Ha ocurrido un problema con el nombre de la imagen del usuario.";
            }
        }
        return new String[]{status, message, data};
    }

    public String[] getProfile(String identifier) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (Methods.isInteger(identifier)) {
            Person per = new Person();
            per.setId_person(identifier);
            data = pdao.getProfile(per);
            if (!data.equals("[]")) {
                status = "2";
                message = "Image changed successfully.";
            } else {
                status = "3";
                message = "User records could not be found.";
            }
        }
        return new String[]{status, message, data};
    }

    public String[] getUsers(String identifier) {
        String status = "4", message = "Error in the entered parameters", data = "[]";
        if (Methods.isInteger(identifier)) {
            codec = new WeEncoder();
            Person per = new Person();
            per.setId_person(identifier);
            String[] result = pdao.getUsers(per);
            if (result[0].equals("2")) {
                JsonArray jsonArray = Methods.stringToJsonArray(result[1]);
                JsonObject resultsUser = jsonArray.get(0).getAsJsonObject();

                JsonArray admins = Methods.JsonToArray(resultsUser, "admins");
                JsonArray users = Methods.JsonToArray(resultsUser, "users");

                for (int index = 0; index < admins.size(); index++) {
                    String code = admins.get(index).getAsJsonObject().get("id_person").getAsString();
                    code = codec.textEncryptor(code);
                    admins.get(index).getAsJsonObject().addProperty("id_person", code);
                }
                for (int index = 0; index < users.size(); index++) {
                    String code = users.get(index).getAsJsonObject().get("id_person").getAsString();
                    code = codec.textEncryptor(code);
                    users.get(index).getAsJsonObject().addProperty("id_person", code);
                }
                JsonObject jsonObject = new JsonObject();
                jsonObject.add("admins", admins);
                jsonObject.add("users", users);

                status = "2";
                message = "Data obtained successfully.";
                data = jsonObject.toString();
            } else {
                status = "3";
                message = "Users records could not be found.";
            }
        }
        return new String[]{status, message, data};
    }

    public String[] stateUsers(String idusers, String state, String permit) {
        System.out.println("stateUsers");
        codec = new WeEncoder();
        String status = "4", message = "Error returning data", data = "[]";
        String action = "X";
        idusers = codec.textDecryptor(idusers);
        if (state.equals("PROMOTE")) {
            if (permit.matches("[AR]")) {
                action = "A";
            }
        }
        if (state.equals("DEGRADE")) {
            if (permit.matches("[AR]")) {
                action = "U";
            }
        }
        if (state.equals("ACTIVATE")) {
            action = "U";
        }
        if (state.equals("INACTIVATE")) {
            action = "I";
        }

        if (idusers.matches("[0-9]+") && action.matches("[AUI]")) {
            String resp = pdao.stateUsers(idusers, action);
            if (resp.equals("2")) {
                status = "2";
                message = "Successful User Update";
            }
        } else {
            status = "3";
            message = "Check the parameters entered.";
        }
        return new String[]{status, message, data};
    }
    
    public String emailgetid(String email)
    {
        return  pdao.emailtoid(email);
    }
    
}
