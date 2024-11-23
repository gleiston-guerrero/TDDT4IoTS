/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ses;

import javax.json.JsonObject;
import utiles.DataStatic;
import utiles.JsonMessageUtils;

/**
 *
 * @author tonyp
 */
public class UserObject {

    String name_person = "";
    String lastname_person = "";
    String email_person = "";
    String pathimg_person = "";
    String type_person = "";
    String provider_person = "";
    String user_token = "";

    String jsonString = "{}";

    public UserObject(String userObj) {
        JsonObject obj = JsonMessageUtils.String2JsonObject(userObj);
        paserObj(obj);
    }

    public UserObject(JsonObject userObj) {
        paserObj(userObj);
    }

    private void paserObj(JsonObject obj) {
        if (obj.size() > 0) {
            this.name_person = JsonMessageUtils.getString(obj, "name_person", "");
            this.lastname_person = JsonMessageUtils.getString(obj, "lastname_person", "");
            this.email_person = JsonMessageUtils.getString(obj, "email_person", "");
            this.pathimg_person = DataStatic.getStorageUrl("usr") + JsonMessageUtils.getString(obj, "pathimg_person", "");
            this.type_person = JsonMessageUtils.getString(obj, "type_person", "");
            this.provider_person = JsonMessageUtils.getString(obj, "provider_person", "");
            this.user_token = JsonMessageUtils.getString(obj, "user_token", "");

            this.jsonString = obj.toString();
        }
    }

    public String getName_person() {
        return name_person;
    }

    public void setName_person(String name_person) {
        this.name_person = name_person;
    }

    public String getLastname_person() {
        return lastname_person;
    }

    public void setLastname_person(String lastname_person) {
        this.lastname_person = lastname_person;
    }

    public String getEmail_person() {
        return email_person;
    }

    public void setEmail_person(String email_person) {
        this.email_person = email_person;
    }

    public String getPathimg_person() {
        return pathimg_person;
    }

    public void setPathimg_person(String pathimg_person) {
        this.pathimg_person = pathimg_person;
    }

    public String getType_person() {
        return type_person;
    }

    public void setType_person(String type_person) {
        this.type_person = type_person;
    }

    public String getProvider_person() {
        return provider_person;
    }

    public void setProvider_person(String provider_person) {
        this.provider_person = provider_person;
    }

    public String getUser_token() {
        return user_token;
    }

    public void setUser_token(String user_token) {
        this.user_token = user_token;
    }

    @Override
    public String toString() {
        return jsonString;
    }
}
