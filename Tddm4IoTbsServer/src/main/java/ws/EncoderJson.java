/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws;

import java.io.IOException;
import java.io.Writer;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 *
 * @author tonyp
 */
public class EncoderJson implements Encoder.TextStream<JsonObject>{

    @Override
    public void encode(JsonObject object, Writer writer) throws EncodeException, IOException {
        try (JsonWriter jsonWriter = Json.createWriter(writer)){
            jsonWriter.writeObject(object);
        }catch(Exception e)
        {
            System.out.println("enconding said:"+e.getMessage());
        }
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
