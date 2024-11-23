/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.ea;

/*
 * @author tonyp
 */
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.json.JsonObject;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import ws.*;

/**
 * The socket in glassfish doesn't give problems without encoders and decoders,
 * but in tomcat it does, or it doesn't work. The serverEndpoint is the socket
 * link, followed by the encoder and decoder.
 */
@ServerEndpoint(
        value = "/ws_sharing_Ea",
        encoders = {EncoderJson.class},
        decoders = {DecoderJson.class}
)
public class EaSocket {

    /**
     * They are added to a list so that information can be sent to them by
     * scrolling through the list and obtaining each of the connected sessions.
     */
    private static final List<Groups> connected = new ArrayList<>();//sesiones

    /**
     * This method is executed when a connection is made to the web scoket, then
     * it receives as the session, which is added to the list with the other
     * sessions.
     *
     * @param sesion is given by default.
     */
    @OnOpen
    public void open(Session sesion) {
        /**
         * adds the session to the list when it is created
         */
        System.out.println("opnex");
        sesion.setMaxTextMessageBufferSize(10000500);
    }

    /**
     * This method is executed when the connection with the web scoket is
     * interrupted and receives the session of the person who cut off the
     * communication. This method removes the inactive session from the session
     * list.
     *
     * @param sesion is given by default.
     * @throws EncodeException by the encoder.
     * @throws IOException for possible exceptions.
     */
    @OnClose
    public void exit(Session sesion) throws IOException, EncodeException {
        int row = searchSession(sesion);//se busca la sesión en la lista
        if (row > -1 && row < connected.size()) {
            connected.get(row).removeUser(sesion);
            if (connected.get(row).usersCount() <= 0) {
                connected.remove(row);//quita el grupo de la lista
            }
        }
    }

    /**
     * It is the method that allows the transition of data, it occurs when a
     * message is sent and it is the one that redirects the information to the
     * other sessions.
     *
     * @param ses is the session and is given by default.
     * @param message is the object with the information.
     * @throws EncodeException by the encoder.
     * @throws IOException for possible exceptions.
     */
    @OnMessage
    public void message(Session ses, JsonObject message) throws IOException, EncodeException {
        System.out.println("CONFIG: " + JsonMessageUtils.getString(message, "config", ""));
        System.out.println("GROUP ID: " + JsonMessageUtils.getString(message, "groupId", ""));
        switch (JsonMessageUtils.getString(message, "config", "")) {
            case "init": {
                int row = getGroup(JsonMessageUtils.getString(message, "groupId", ""));
                if (row != -1 && row < connected.size()) {
                    boolean newhost = JsonMessageUtils.getBoolean(message, "host");
                    JsonObject dataUser = JsonMessageUtils.getJsonObject(message, "user");
                    MeSession me = createMeSession(ses, newhost, dataUser);
                    if (me != null) {
                        connected.get(row).setUsers(me);
                    } else {
                        SendError(ses, "Missing parameters.");
                    }
                } else {
                    Groups gp = new Groups(JsonMessageUtils.getString(message, "groupId", ""));
                    //primero en unirse, es host
                    boolean newhost = true;//JsonMessageUtils.getBoolean(message, "host");
                    JsonObject dataUser = JsonMessageUtils.getJsonObject(message, "user");
                    MeSession me = createMeSession(ses, newhost, dataUser);
                    if (me != null) {
                        gp.setUsers(me);
                        connected.add(gp);
                    } else {
                        SendError(ses, "Missing parameters.");
                    }
                }
            }
            break;
            case "save": {
                int row = getGroup(JsonMessageUtils.getString(message, "groupId", ""));
                if (row != -1 && row < connected.size()) {
                    connected.get(row).shareHost(ses, message);
                } else {
                    SendError(ses, "Group not found.");
                }
            }
            break;
            default: {
                int row = getGroup(JsonMessageUtils.getString(message, "groupId", ""));
                if (row != -1 && row < connected.size()) {
                    connected.get(row).shareNoMi(ses, message);
                } else {
                    SendError(ses, "Group not found.");
                }
            }
            break;
        }
    }

    /**
     * It occurs when an exception occurs.
     *
     * @param session failed session.
     * @param throwable for the exception.
     */
    public final void onError(Session session, java.lang.Throwable throwable) {
        System.out.println("wsError:" + throwable.getMessage());
    }

    /**
     * You get the index of where the session you are looking for is located.
     *
     * @param mysession the session for which you want to know your position.
     */
    private int searchSession(Session mysession) {
        int resultRow = -1;
        for (int row = 0; row < connected.size(); row++) {
            int index = connected.get(row).returnIndex(mysession);
            if (index != -1) {
                resultRow = row;
            }
        }
        return resultRow;
    }

    /**
     * Method of obtaining the group.
     *
     * @param identifier String type variable, contains the identifier.
     * @return Return an integer, with the result.
     */
    private int getGroup(String identifier) {
        int resultRow = -1;
        for (int row = 0; row < connected.size(); row++) {
            System.out.println("ID GUARDADO: " + connected.get(row).getGroupID());
            //System.out.println("ID GUARDADO: " + connected.get(row + 1).getGroupID());
            if (connected.get(row).getGroupID().equals(identifier)) {
                resultRow = row;
            }
        }
        return resultRow;
    }

    /**
     * Method for sending the error.
     *
     * @param ses is given by default.
     * @param erroDetail Detail of the error.
     */
    private void SendError(Session ses, String erroDetail) {
        Groups.SendError(ses, erroDetail);
    }

    /**
     * Method for creating the session.
     *
     * @param ses is given by default.
     * @param content It contains the context.
     * @return Return the session.
     */
    private MeSession createMeSession(Session ses, boolean host, JsonObject user) {
        MeSession me = null;
        if (user.size() > 0) {
            me = new MeSession(ses, host);
            me.setUserObject(user);
        }
        return me;
    }

    public JsonObject easyMessage(String header, String content, String config) {
        return Groups.easyMessage(header, content, config);
    }
}
