/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.daemon;

//import com.google.gson.JsonArray;
//import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.websocket.Session;

/**
 *
 * @author tonyp
 */
public class ArdGroups {

    private String groupID = "";
    private List<ArdSession> users;

    public ArdGroups() {
        this.users = new ArrayList<>();
    }

    public ArdGroups(String groupID) {
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
    public void setUsers(ArdSession user) {
        this.users.add(user);
        shareMessage(user.getSesion(), easyMessage("System", user.getSesion().getId(), "mejoin"), "me", "");
        shareMessage(user.getSesion(), easyMessage("System", user.getName(), "join"), "nome", "");
        shareMessage(user.getSesion(), easyMessage("System", getAllUsers(), "list"), "all", "");
    }

    /**
     * Get session users.
     *
     * @param mysession is given by default.
     * @return Returns the status of the session.
     */
    public ArdSession getUsers(Session mysession) {
        int row = searchSession(mysession);
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
        int row = searchSession(mysession);
        boolean flag = false;
        if (row > -1 && row < users.size()) {
            shareMessage(mysession, easyMessage("System", users.get(row).getName(), "close"), "nome", "");
            flag = (users.remove(row) != null);
            shareMessage(mysession, easyMessage("System", getAllUsers(), "list"), "all", "");
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
            JsonObject objtmp = Json.createObjectBuilder()
                    .add("identifier", users.get(index).getSesion().getId())
                    .add("name", users.get(index).getName())
                    .add("type", users.get(index).getType())
                    .build();
            builder.add(objtmp);
        }
        return builder.build();
    }

    /**
     * Method to obtain the position of the session.
     *
     * @param mysession is given by default.
     * @return returns the position of the session.
     */
    public int searchSession(Session mysession) {
        int resultRow = -1;
        for (int row = 0; row < users.size(); row++) {
            if (users.get(row).getSesion() == mysession) {
                resultRow = row;
            }
        }
        return resultRow;
    }

    /**
     * Method to obtain the position of the Mac.
     *
     * @param mac the mac of the device to connect.
     * @return returns the position of the Mac.
     */
    public int searchName(String mac) {
        int resultRow = -1;
        for (int row = 0; row < users.size(); row++) {
            if (users.get(row).getName().equals(mac)) {
                resultRow = row;
            }
        }
        return resultRow;
    }

    /**
     * method to share a message within the group
     *
     * @param ses is the one who sends the message
     * @param message the information to be shared.
     * @param flag conditional for message type.
     * @param identifier identifier for send message.
     */
    public void shareMessage(Session ses, JsonObject message, String flag, String identifier) {
        if (flag.equals("me")) {
            sendMessage(ses, message);
        } else {
            for (ArdSession xsession : users) {
                switch (flag) {
                    case "nome":
                        if (xsession.getSesion() != ses) {
                            sendMessage(xsession.getSesion(), message);
                        }
                        break;
                    case "to":
                        if (xsession.getSesion().getId().equals(identifier)) {
                            sendMessage(xsession.getSesion(), message);
                        }
                        break;
                    case "type":
                        if (xsession.getType().equals("WebApp")) {
                            sendMessage(xsession.getSesion(), message);
                        } else {
                            sendMessage(xsession.getSesion(), message);
                        }
                        break;
                    case "all":
                        sendMessage(xsession.getSesion(), message);
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
     * @param contect It contains the body or context of the message.
     * @param config It contains the message settings.
     * @return Return the message.
     */
    public JsonObject easyMessage(String header, String content, String config) {
        javax.json.JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }

    public JsonObject easyMessage(String header, JsonObject content, String config) {
        javax.json.JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }

    public JsonObject easyMessage(String header, JsonArray content, String config) {
        javax.json.JsonObject json = Json.createObjectBuilder()
                .add("header", header)
                .add("config", config)
                .add("content", content)
                .build();
        return json;
    }
}
