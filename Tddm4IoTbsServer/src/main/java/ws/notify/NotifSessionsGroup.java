/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.notify;

import java.util.ArrayList;
import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.Session;

/**
 *
 * @author tonyp
 */
public class NotifSessionsGroup {

    private String email = "";
    private ArrayList<Session> sesionList;

    public NotifSessionsGroup() {
        sesionList = new ArrayList<>();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ArrayList<Session> getSesionList() {
        return sesionList;
    }

    public void setSesionList(ArrayList<Session> sesionList) {
        this.sesionList = sesionList;
    }

    private boolean RemoveOrAdd(Session ses, boolean remove) {
        boolean find = hasSession(ses);
        if (!find) {
            if (remove) {
                return sesionList.remove(ses);
            } else {
                return sesionList.add(ses);
            }
        }
        return false;
    }

    public boolean hasSession(Session ses) {
        boolean find = false;
        for (Session tmpSes : sesionList) {
            if (tmpSes == ses) {
                find = true;
            }
        }
        return find;
    }

    public int searchSession(Session ses) {
        int index = -1;
        for (int i = 0; i < sesionList.size(); i++) {
            if (sesionList.get(i) == ses) {
                index = i;
            }
        }
        return index;
    }

    public boolean addSession(Session ses) {
        return RemoveOrAdd(ses, false);
    }

    public boolean removeSession(Session ses) {
        return RemoveOrAdd(ses, true);
    }

    public int usersCount() {
        return sesionList.size();
    }

    public void shareMessage(Session ses, JsonObject message, String flag, String identifier) {
        if (flag.equals("me")) {
            sendMessage(ses, message);
        } else {
            for (Session xsession : sesionList) {
                switch (flag) {
                    case "nome":
                        if (xsession != ses) {
                            sendMessage(xsession, message);
                        }
                        break;
                    case "to":
                        if (xsession.getId().equals(identifier)) {
                            sendMessage(xsession, message);
                        }
                        break;
                    case "all":
                        sendMessage(xsession, message);
                        break;
                    default:
                        sendMessage(ses, easyMessage("System", "unknown message type.", "error"));
                        break;
                }
            };
        }
    }

    public void sendMessage(Session xsession, JsonObject message) {
        try {
            xsession.getBasicRemote().sendObject(message);
        } catch (Exception e) {
            System.err.println("sendMessage:" + e.getMessage());
        }
    }

    public JsonObject easyMessage(String header, String content, String config) {
        JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }
}
