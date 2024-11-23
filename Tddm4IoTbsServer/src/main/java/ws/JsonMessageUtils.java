/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws;

import java.io.StringReader;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonValue;

/**
 *
 * @author tonyp
 */
public class JsonMessageUtils {

    public static JsonObject newJsonVoid() {
        return Json.createObjectBuilder().build();
    }

    public static JsonObject easyMessage(String header, String content, String config) {
        javax.json.JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }

    public static JsonObject easyMessage(String header, JsonObject content, String config) {
        javax.json.JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }
    public static JsonObject easyMessage(String header, JsonArray content, String config) {
        javax.json.JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }

    public static JsonObject String2JsonObject(String jsonObj) {
        JsonObject resp;
        try {
            JsonReader jsonReader = Json.createReader(new StringReader(jsonObj));
            resp = jsonReader.readObject();
            jsonReader.close();
        } catch (Exception e) {
            resp = Json.createObjectBuilder().build();
        }
        return resp;
    }

    public static String getString(JsonObject obj, String param, String def) {
        String resp = "";
        try {
            resp = obj.getString(param);
            resp = resp != null ? resp : def;
        } catch (Exception e) {

            resp = def;
        }
        return resp;
    }

    public static boolean getBoolean(JsonObject obj, String param) {
        boolean resp;
        try {
            resp = obj.getBoolean(param);
        } catch (Exception e) {
            resp = false;
        }
        return resp;
    }

    public static JsonObject getJsonObject(JsonObject obj, String param) {
        JsonObject resp;
        try {
            resp = obj.getJsonObject(param);
            resp = resp != null ? resp : Json.createObjectBuilder().build();
        } catch (Exception e) {
            resp = Json.createObjectBuilder().build();
        }
        return resp;
    }

    public static JsonObjectBuilder getJsonObjectBuilder(JsonObject jso) {
        try {
            JsonObjectBuilder builder = Json.createObjectBuilder();

            for (Map.Entry<String, JsonValue> entry : jso.entrySet()) {
                builder.add(entry.getKey(), entry.getValue());
            }
            return builder;
        } catch (Exception e) {
            return Json.createObjectBuilder();
        }
    }
}
