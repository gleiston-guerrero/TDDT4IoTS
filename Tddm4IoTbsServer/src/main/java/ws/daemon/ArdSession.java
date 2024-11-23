/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.daemon;

/**
 * This class is used to contain the session and the identifier of the person to
 * whom the information will be sent.
 *
 * @author tonyp
 */
import javax.websocket.Session;

public class ArdSession {

    private String name = "";
    private String type = "";
    private String status = "";
    private Session sesion;

    public ArdSession() {
    }

    public ArdSession(Session sesion) {
        this.sesion = sesion;
    }

    public Session getSesion() {
        return sesion;
    }

    public void setSesion(Session sesion) {
        this.sesion = sesion;
    }

    public String getName() {
        return name;
    }

    public void setName(String Name) {
        this.name = Name;
    }

    public String getType() {
        return type;
    }

    public void setType(String Type) {
        this.type = Type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
