/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.websocket.Session;

/**
 * This java class is about groups, it contains the get and set methods.
 *
 * @author tonyp
 */
public class Groups {

    private String groupID = "";
    private List<MeSession> users;

    public Groups() {
        this.users = new ArrayList<>();
    }

    public Groups(String groupID) {
        this.groupID = groupID;
        this.users = new ArrayList<>();
    }

    public String getGroupID() {
        return groupID;
    }

    public void setGroupID(String groupID) {
        this.groupID = groupID;
    }

    /**
     * Method for obtaining users.
     *
     * @param user user logging in.
     */
    public void setUsers(MeSession user) {
        this.users.add(user);
        shareNoMi(user.getSesion(), easyMessage("System", user.getUserObject(), "connect"));
        shareall(easyMessage("System", getAllUsers(), "list"));
    }

    /**
     * Get session users.
     *
     * @param mysession is given by default.
     * @return Returns the status of the session.
     */
    public MeSession getUsers(Session mysession) {
        int row = returnIndex(mysession);
        if (row > -1 && row < users.size()) {
            return users.get(row);
        } else {
            return null;
        }
    }

    /**
     * Method to remove a user.
     *
     * @param mysession is given by default.
     * @return returns a boolean operation that states whether it was executed
     * or not.
     */
    public boolean removeUser(Session mysession) {
        int row = returnIndex(mysession);
        boolean flag = false;
        if (row > -1 && row < users.size()) {
            //verifica si era host
//            boolean isHost = users.get(row).isHost();
            //lo desconecta
            MeSession tmp = users.remove(row);
            if (tmp != null) {
                //informa de la desconexión
                this.shareNoMi(mysession, easyMessage("System", tmp.getUserObject(), "disconnect"));
                //si era host, asigna uno nuevo
                if (tmp.isHost()) {
                    //cambio el host
                    setHost(0);
                }
                //actualiza la lista de participantes
                shareall(easyMessage("System", getAllUsers(), "list"));
                flag = true;
            }
        } else {
            flag = false;
        }
        return flag;
    }

    /**
     * Method to get all users.
     *
     * @return returns a string with the obtained data.
     */
    public JsonArray getAllUsers() {
        JsonArrayBuilder builder = Json.createArrayBuilder();
        for (int index = 0; index < users.size(); index++) {
            builder.add(
                    Json.createObjectBuilder()
                            .add("host", users.get(index).isHost())
                            .add("usr", JsonMessageUtils.getJsonObjectBuilder(users.get(index).getUserObject()))
            );
        }
        return builder.build();
    }

    /**
     * Method to obtain the position of the session.
     *
     * @param mysession is given by default.
     * @return returns the position of the session.
     */
    public int returnIndex(Session mysession) {
        int resultRow = -1;
        for (int row = 0; row < users.size(); row++) {
            if (users.get(row).getSesion() == mysession) {
                resultRow = row;
            }
        }
        return resultRow;
    }

    public void setHost(int index) {
        boolean changeHost = false;
        for (int ind = 0; ind < users.size(); ind++) {
            if (ind == index) {
                users.get(ind).setHost(true);
                changeHost = true;
            } else {
                users.get(ind).setHost(false);
            }
        }
        if (!changeHost && users.size() > 0) {
            users.get(0).setHost(true);
        }
        shareall(easyMessage("System", "The host has changed.", "host"));
        //shareall();
    }

    public void shareHost(Session ses, JsonObject message) {
        for (MeSession xsession : users) {
            if (xsession.isHost()) {
                try {
                    xsession.getSesion().getBasicRemote().sendObject(message);
                } catch (Exception e) {
                    System.err.println("shareHost:" + e.getMessage());
                }
            }
        };
    }

    /**
     * Share to all but me.
     *
     * @param ses is given by default
     * @param message It contains the information.
     */
    public void shareNoMi(Session ses, JsonObject message) {
        for (MeSession xsession : users) {
            if (xsession.getSesion() != ses) {
                try {
                    xsession.getSesion().getBasicRemote().sendObject(message);
                } catch (Exception e) {
                    System.err.println("shareNoMi:" + e.getMessage());
                }
            }
        };
    }

    /**
     * Share only me.
     *
     * @param ses is given by default
     * @param message It contains the information.
     */
    public void shareOnlyMi(Session ses, JsonObject message) {
        try {
            ses.getBasicRemote().sendObject(message);
        } catch (Exception e) {
            System.err.println("shareOnlyMi:" + e.getMessage());
        }
    }

    /**
     * Share to all.
     *
     * @param message It contains the information.
     */
    public void shareall(JsonObject message) {
        for (MeSession xsession : users) {
            try {
                xsession.getSesion().getBasicRemote().sendObject(message);
            } catch (Exception e) {
                System.err.println("shareall:" + e.getMessage());
            }
        };
    }

    /**
     * Method for counting users.
     *
     * @return Returns the number of users.
     */
    public int usersCount() {
        return users.size();
    }

    /**
     * Method to get a message.
     *
     * @param header It contains the message header.
     * @param content It contains the body or context of the message.
     * @param config It contains the message settings.
     * @return Return the message.
     */
    public static JsonObject easyMessage(String header, String content, String config) {
        return JsonMessageUtils.easyMessage(header, content, config);
    }

    public static JsonObject easyMessage(String header, JsonObject content, String config) {
        return JsonMessageUtils.easyMessage(header, content, config);
    }

    public static JsonObject easyMessage(String header, JsonArray content, String config) {
        return JsonMessageUtils.easyMessage(header, content, config);
    }

    public void sendMessage(Session xsession, JsonObject message) {
        try {
            xsession.getBasicRemote().sendObject(message);
        } catch (Exception e) {
            System.err.println("sendMessage:" + e.getMessage());
        }
    }

    public static void SendError(Session ses, String erroDetail) {
        JsonObject errmsg = easyMessage("System", erroDetail, "error");
        try {
            ses.getBasicRemote().sendObject(errmsg);//se envia el mensaje
        } catch (Exception ex) {
            System.out.println("SendErr: " + ex.getMessage());
        }
    }
}
