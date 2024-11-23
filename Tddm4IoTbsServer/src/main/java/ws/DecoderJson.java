/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws;

import java.io.IOException;
import java.io.Reader;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.stream.JsonParser;
import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

/**
 *
 * @author tonyp
 */
public class DecoderJson implements Decoder.TextStream<JsonObject> {

    @Override
    public JsonObject decode(Reader reader) throws DecodeException, IOException {
        JsonObject json = Json.createObjectBuilder().build();
        JsonParser parser = Json.createParser(reader);
        if (parser.hasNext()) {
            parser.next();
            try {
                json = parser.getObject();

                parser.close();
            } catch (Exception e) {
                System.out.println("deconding say:" + e.getMessage());
                return Json.createObjectBuilder().build();
            }
        }
//        System.out.println("x:" + json);
        return json;
    }

    @Override
    public void init(EndpointConfig config) {
//        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void destroy() {
//        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

}
