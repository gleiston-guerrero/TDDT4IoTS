/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ses;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import utiles.DataStatic;
import utiles.JsonMessageUtils;
import utiles.RestClient;
import utiles.ScopeApp;
import utiles.UtilDesktop;

/**
 *
 * @author tonyp
 */
public class Dao {

    public static boolean LogIn(String user, String password) {
        JsonObject json = Json.createObjectBuilder()
                .add("email", user)
                .add("password", password)
                .build();

        String[] resp = RestClient.requestPost(DataStatic.getServicesURL("personapis/logIn"), json.toString());

        System.out.println("response");
        System.out.println(resp[0]);
        System.out.println(resp[1]);
        if (resp[0].equals("2")) {
            json = JsonMessageUtils.String2JsonObject(resp[1]);
            if (json.size() > 0) {
                int status = JsonMessageUtils.getInteger(json, "status", 4);
                String information = JsonMessageUtils.getString(json, "information", "No idea.");
                System.out.println("satatus:" + status);
                UtilDesktop.notification("Login - " + DataStatic.applicationName, information, status);
                if (status == 2) {
                    JsonArray data = JsonMessageUtils.getJsonArray(json, "data");
                    if (data.size() > 0) {
                        json = JsonMessageUtils.String2JsonObject(data.get(0).toString());
                        UserObject usr = new UserObject(json);
                        ScopeApp.setDataUser(usr);
                    }
                    return true;
                }
            }
        }
        return false;
    }
}
