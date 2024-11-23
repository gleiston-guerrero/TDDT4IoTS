/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

import comunicacionserial.ArduinoExcepcion;
import comunicacionserial.ComunicacionSerial_Arduino;
import comunicacionserial.ComunicacionSerial_MultiMensajes;
import java.util.List;
import jssc.SerialPort;
import jssc.SerialPortEvent;
import jssc.SerialPortEventListener;
import jssc.SerialPortList;

/**
 *
 * @author tonyp
 */
public class MonitorSerial {

    private static ComunicacionSerial_Arduino ard_cnn = null;
    private static SerialPortEventListener ard_listen = null;
    private static ComunicacionSerial_MultiMensajes multiMsg = null;

    public MonitorSerial() {
        ard_cnn = new ComunicacionSerial_Arduino();
        multiMsg = new ComunicacionSerial_MultiMensajes(1, ard_cnn);
    }

    public ComunicacionSerial_MultiMensajes getMultiArduinoMessage() {
        return multiMsg;
    }

    public String[] getPorts() {
        return SerialPortList.getPortNames();
    }

    public String[] getPortsName() {
        String[] ports = getPorts();
        String[] resp = new String[ports.length];
        for (int i = 0; i < ports.length; i++) {
            SerialPort port = new SerialPort(ports[i]);
            resp[i] = port.getPortName();
        }
        return resp;
    }

    public boolean startRXTX(String port, int frequency) {
        try {
            ard_cnn.arduinoRXTX(port, frequency, ard_listen);
            return true;
        } catch (ArduinoExcepcion ex) {
            System.out.println("[startRXTX] " + ex.getMessage());
        }
        return false;
    }

    public boolean sendData(String data, int frequency) {
        try {
//            Thread.sleep(5000);
            ard_cnn.sendData(data);
            return true;
        } catch (Exception ex) {
            System.out.println("[sendData] " + ex.getMessage());
        }
        return false;
    }

    public void serialListener() {
        ard_listen = new SerialPortEventListener() {
            @Override
            public void serialEvent(SerialPortEvent spe) {
                try {
                    if (multiMsg.dataReceptionCompleted()) {
                        List<String> listMsg = multiMsg.getMessageList();
                        for (String line : listMsg) {
                            System.out.println("a:" + line);
                        }
                        multiMsg.flushBuffer();
                    }
                } catch (Exception e) {
                    System.out.println("[serialListener] " + e.getMessage());
                }
            }
        };
    }

}
