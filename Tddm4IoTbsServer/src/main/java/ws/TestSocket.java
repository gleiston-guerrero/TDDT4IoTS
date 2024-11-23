/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author tonyp
 */
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.json.JsonObject;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(
        value = "/ws_sharing",
        encoders = {EncoderJson.class},
        decoders = {DecoderJson.class}
)
public class TestSocket {

    private static final List<Session> connected = new ArrayList<>();//sesiones

    @OnOpen
    public void inicio(Session sesion) {
        connected.add(sesion);
        System.out.println("new user");
    }

    @OnClose
    public void salir(Session sesion) throws IOException, EncodeException {
        connected.remove(sesion);
    }

    @OnMessage
    public void message(Session ses, JsonObject message) throws IOException, EncodeException {
//        System.out.println("nuevo message de:" + message.getNombre() + "\ncontenido:"+message.getMensaje());
        System.out.println("nuevo message de:" + message);
        for (Session isession : connected) {
            if (isession != ses) {
                isession.getBasicRemote().sendObject(message);
            }
        };
    }
    
    @OnError
    public final void onError(Session session, java.lang.Throwable throwable) {
        System.out.println("wsError:" + throwable.getMessage());
    }
}
