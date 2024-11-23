/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package view;

import comunicacionserial.ArduinoExcepcion;
import comunicacionserial.ComunicacionSerial_Arduino;
import comunicacionserial.ComunicacionSerial_MultiMensajes;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import jssc.SerialPort;
import jssc.SerialPortEvent;
import jssc.SerialPortEventListener;
import jssc.SerialPortException;
import jssc.SerialPortList;
import utiles.BrowserClass;
import utiles.DataStatic;
import utiles.RestClient;
import utiles.TerminalWindows;

/**
 *
 * @author tonyp
 */
public class puertos {

    private static ComunicacionSerial_Arduino ard_cnn = null;
    private static SerialPortEventListener ard_listen = null;

    public static void main(String[] args) {

        ard_cnn = new ComunicacionSerial_Arduino();
        ComunicacionSerial_MultiMensajes multiMsg = new ComunicacionSerial_MultiMensajes(1, ard_cnn);

        ard_listen = new SerialPortEventListener() {
            @Override
            public void serialEvent(SerialPortEvent spe) {
                try {
//                    if (ard_cnn.isMessageAvailable()) {
//                        System.out.println("a:" + ard_cnn.printMessage());
//                    }
                    if (multiMsg.dataReceptionCompleted()) {
                        List<String> listMsg = multiMsg.getMessageList();
                        for (String line : listMsg) {
                            System.out.println("a:" + line);
                        }
                        multiMsg.flushBuffer();
                    }
                } catch (Exception e) {
                    System.out.println("[serial error] " + e.getMessage());
                }
            }
        };
        String[] ports = SerialPortList.getPortNames();
        
        System.out.println("puertos:" + ports.length);
        for (int i = 0; i < ports.length; i++) {
            System.out.println(ports[i]);
            SerialPort port = new SerialPort(ports[i]);
            System.out.println(port.getPortName());
        }
        System.out.println("inicializar RXTX");
        
        try {
            ard_cnn.arduinoRXTX("COM3", 9600, ard_listen);
        } catch (ArduinoExcepcion ex) {
            System.out.println("[Error] " + ex.getMessage());
        }
        System.out.println("WRTIEEEEEEEe-------------");

        try {
            Thread.sleep(5000);
            ard_cnn.sendData("Anth");
        } catch (Exception ex) {
            System.out.println("[Error] " + ex.getMessage());
        }
        /*
            TerminalWindows terminal = new TerminalWindows();
            String[] cm = {"arduino-cli board list"};
            String logs = terminal.ejecutarComandos(cm);
            System.out.println("logs:" + logs);
            
            System.out.println("----------------------------");
            String[] lines = logs.split("\t");
            for (String line : lines) {
            System.out.println(line);
            }
         */
 /*BrowserClass br = new BrowserClass();
            
            //otro
            String ruta = "https://firebasestorage.googleapis.com/v0/b/letritas-48681.appspot.com/o/edificios_uteq.json?alt=media&token=59791cd5-96bc-41bd-a6a0-c50096e8797d";
            br.descargarArchivo(ruta, "/main.json");
         */
//        JsonObject json = Json.createObjectBuilder()
//                .add("email", "anthony.pachay2017@uteq.edu.ec")
//                .add("password", "Abc123")
//                .build();
//        String[] resp = RestClient.requestPost(DataStatic.getServicesURL("personapis/logIn"), json.toString());
//
//        System.out.println("0:" + resp[0]);
//        System.out.println("1:" + resp[1]);
//        System.out.println("response");
//        System.out.println(resp[0]);
//        System.out.println(resp[1]);

    }
}
