/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package socks;

import utiles.DataStatic;
import java.net.URI;
import java.net.URISyntaxException;
import javax.annotation.PostConstruct;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.swing.JFrame;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.drafts.Draft_6455;
import org.java_websocket.handshake.ServerHandshake;
import utiles.JsonMessageUtils;
import utiles.ScopeApp;
import utiles.TerminalWindows;
import utiles.UtilDesktop;
import view.InitForm;
//import util.DataStatic;

/**
 *
 * @author tonyp
 */
public class WsCliente {

    private WebSocketClient ws;

//    private InitForm miform = null;
    private TerminalWindows Terminal;

    private String groupID = "";
    private String deviceID = "";
    private String partnetID = "";

    public WsCliente(String group) {

        this.groupID = group;
        Terminal = new TerminalWindows();
        Terminal.openProcess();
        initializeSocket();
    }

//    @PostConstruct
    private void initializeSocket() {
        System.out.println("construyendo =>" + DataStatic.getWebSocketURL());
        try {
            ws = new WebSocketClient(new URI(DataStatic.getWebSocketURL()), new Draft_6455()) {
                @Override
                public void onMessage(String message) {
                    System.out.println("recib");
                    System.out.println(message);

                    JsonObject obj = JsonMessageUtils.String2JsonObject(message);
                    String head = JsonMessageUtils.getString(obj, "header", "");
                    String content = JsonMessageUtils.getString(obj, "content", "");
                    String config = JsonMessageUtils.getString(obj, "config", "");

                    switch (config) {
                        case "list":
                            break;
                        case "join":
                            break;
                        case "error":
                            UtilDesktop.notification(head, content, 4);
                            break;
                        case "close":
                            UtilDesktop.notification("Disconnection", content + " it has disconnected.", 3);
                            break;
                        case "mejoin":
                            deviceID = content;
                            UtilDesktop.notification("Connection", "connection established successfully.", 2);
                            break;
                        case "conected":
                            deviceID = content;
                            UtilDesktop.notification("Connection", "connection established successfully.", 1);
                            ScopeApp.getMainForm().conectedWs(true);
                            break;
                        default:

                            System.out.println("consola");
                            System.out.println(content);
                            JsonObject minobj = JsonMessageUtils.String2JsonObject(content);
                            String conected = JsonMessageUtils.getString(minobj, "conected", "");
                            if (conected.length() > 0) {
                                partnetID = conected;
                                UtilDesktop.notification("Sync", "Sync established successfully.", 2);
                            }
                            String command = JsonMessageUtils.getString(minobj, "command", "");
                            if (Terminal.status && command.length() > 0) {
                                String console = Terminal.ejecutar(command);
                                ScopeApp.getMainForm().txtconsola.setText(
                                        ScopeApp.getMainForm().txtconsola.getText() + console
                                );

                                JsonObject objCommand = Json.createObjectBuilder()
                                        .add("command", console)
                                        .build();
                                sendMessage(groupID, objCommand, partnetID);
                            } else {
                                System.out.println("terminal:" + Terminal.status);
                            }
                            break;
                        //config - id

                    };

                }

                @Override
                public void onOpen(ServerHandshake handshake) {
                    System.out.println("opened connection");

                    JsonObject obj = Json.createObjectBuilder()
                            .add("name", UtilDesktop.getPcName() + " - " + UtilDesktop.getUserPc())
                            .add("type", UtilDesktop.getNameOS())
                            .build();
                    sendMessage(groupID, obj, "init");
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    System.out.println("closed connection");
                }

                @Override
                public void onError(Exception ex) {
                    System.out.println("err WS:" + ex.getMessage());
                    ws = null;
                    ex.printStackTrace();
                }

            };
            ws.connectBlocking();
        } catch (Exception ex) {
            ws = null;
            System.out.println("erroWS:" + ex.getMessage());
        }
    }

    public void sendMessage(String header, String content, String config) {
        JsonObject obj = JsonMessageUtils.easyMessage(header, content, config);
        sendMessageEvent(obj.toString());
    }

    public void sendMessage(String header, JsonObject content, String config) {
        JsonObject obj = JsonMessageUtils.easyMessage(header, content, config);
        sendMessageEvent(obj.toString());
    }

    public void sendMessage(String header, JsonArray content, String config) {
        JsonObject obj = JsonMessageUtils.easyMessage(header, content, config);
        sendMessageEvent(obj.toString());
    }

    public void sendMessageEvent(String message) {
        System.out.println(message);
        try {
            if (ws != null) {
                ws.send(message);
            }
        } catch (Exception e) {
            ws = null;
            System.out.println("WebSocketError:" + e.getMessage());
        }
    }

    public void closeWebSocket() {
        if (ws != null) {
            ws.close();
        }
    }

    public WebSocketClient getWs() {
        return ws;
    }

    public void setWs(WebSocketClient ws) {
        this.ws = ws;
    }

}
