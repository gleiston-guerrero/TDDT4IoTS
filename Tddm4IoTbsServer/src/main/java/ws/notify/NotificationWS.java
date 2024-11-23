/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.notify;

/*
 * @author tonyp
 */
import javax.json.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import util.Methods;
import ws.DecoderJson;
import ws.EncoderJson;

/**
 * The socket in glassfish doesn't give problems without encoders and decoders,
 * but in tomcat it does, or it doesn't work. The serverEndpoint is the socket
 * link, followed by the encoder and decoder.
 */
@ServerEndpoint(
        value = "/notification_ws",
        encoders = {EncoderJson.class},
        decoders = {DecoderJson.class}
)
public class NotificationWS {

    /**
     * They are added to a list so that information can be sent to them by
     * scrolling through the list and obtaining each of the connected sessions.
     */
    private static final List<NotifSessionsGroup> connected = new ArrayList<>();//sesiones

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
//        sesion.setMaxTextMessageBufferSize(10000500);
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
        System.out.println("bye");
        int row = searchSession(sesion);//se busca la session en la lista
        if (row > -1 && row < connected.size()) {
            connected.get(row).removeSession(sesion);
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
        switch (message.getString("config")) {
            case "init": {
                int row = getGroup(message.getString("header"));
                if (row != -1 && row < connected.size()) {
                    if (ses != null) {
                        connected.get(row).addSession(ses);
                    } else {
                        SendError(ses, "Missing parameters.");
                    }
                } else {
                    NotifSessionsGroup me = createMeSession(ses, message.getString("header"));
                    if (me != null) {
                        connected.add(me);
                    } else {
                        SendError(ses, "Missing parameters.");
                    }
                }
            }
            break;
            case "close": {
                int row = getGroup(message.getString("header"));
                if (row != -1 && row < connected.size()) {
                    connected.get(row).removeSession(ses);
                }
                disconect(ses, message.getString("header"));
            }
            break;
            default: {
                /**
                 * here you will find a message recipient
                 */
                int row = getGroup(message.getString("header"));
                if (row != -1 && row < connected.size() && message.getString("header").length() > 0) {
                    connected.get(row).shareMessage(ses, message, "to", message.getString("config"));
                } else {
                    SendError(ses, "Undefined action.");
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

    public int searchSession(Session mysession) {
        int resultRow = -1;
        for (int row = 0; row < connected.size(); row++) {
            int index = connected.get(row).searchSession(mysession);
            if (index != -1) {
                resultRow = row;
            }
        }
        return resultRow;
    }

    public boolean disconect(Session mysession, String identifier) {
        int resultRow = getGroup(identifier);
        if (resultRow > -1) {
            connected.get(resultRow).removeSession(mysession);
            return true;
        } else {
            SendError(mysession, "Group not found.");
        }
        return false;
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
            if (connected.get(row).getEmail().equals(identifier)) {
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
        JsonObject json = Json.createObjectBuilder()
                .add("header", "System")
                .add("config", "error")
                .add("content", erroDetail)
                .build();
        try {
            ses.getBasicRemote().sendObject(json);
        } catch (Exception ex) {
            System.out.println("SendError:" + ex.getMessage());
        }
    }

    /**
     * Method for creating the session.
     *
     * @param ses is given by default.
     * @param content It contains the context.
     * @return Return the session.
     */
    private NotifSessionsGroup createMeSession(Session ses, String identifier) {
        NotifSessionsGroup me = null;
        if (identifier != null && identifier.length() > 0) {
            me = new NotifSessionsGroup();
            me.addSession(ses);
            me.setEmail(identifier);
        }
        return me;
    }
}
