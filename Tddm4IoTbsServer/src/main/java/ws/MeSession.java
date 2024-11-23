/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws;

/**
 * This class is used to contain the session and the identifier of the person to whom the information will be sent.
 * @author tonyp
 */

import javax.json.Json;
import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.Session;

public class MeSession {
    
    private JsonObject userObject;
    private boolean host = false;
    private Session sesion;
    
    public MeSession(){
        this.userObject = Json.createObjectBuilder().build();
    }
    
    public MeSession(Session sesion, boolean host){
        this.sesion = sesion;
        this.host = host;
        this.userObject = Json.createObjectBuilder().build();
    }

    public JsonObject getUserObject() {
        return userObject;
    }

    public void setUserObject(JsonObject userObject) {
        this.userObject = userObject;
    }

    public boolean isHost() {
        return host;
    }

    public void setHost(boolean host) {
        this.host = host;
    }
    
    public Session getSesion() {
        return sesion;
    }

    public void setSesion(Session sesion) {
        this.sesion = sesion;
    }
    
}
