/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package view;

import java.io.File;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import utiles.BrowserClass;
import utiles.RestClient;
import utiles.TerminalWindows;

/**
 *
 * @author tonyp
 */
public class test {

    public static void main(String[] args) {
//        try {
//            Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler cmd");
//        } catch (IOException ex) {
//            Logger.getLogger(test.class.getName()).log(Level.SEVERE, null, ex);
//        }
        //powershell -Command "Start-Process cmd -Verb RunAs"
//        String[] cm = {"arduino-cli core list", "arduino-cli core install arduino:samd", "arduino-cli core list"};
        String[] cm = {"arduino-cli core list", "arduino-cli core install arduino:samd", "arduino-cli core list"};

//        TerminalWindows terminal = new TerminalWindows();

//        String logs = terminal.ejecutarComandos(cm);
//        System.out.println("logs:" + logs);
//--------------------
//        File tempFile = terminal.creaFicheroTemporal(cm);
//        if (tempFile != null) {
////            File fichero = new File("test.txt");
////            System.out.println("La ruta del fichero es: " + fichero.getAbsolutePath());
//            System.out.println(tempFile.getName());
//            System.out.println(tempFile.getAbsoluteFile());
////            String cmf = String.format("powershell -Command \"Start-Process cmd -Verb RunAs\" /c %s", tempFile.getAbsoluteFile());
//            String cmf = String.format("powershell -Command \"Start-Process -FilePath '%s' -Verb RunAs\"", tempFile.getAbsoluteFile());
////            String cmf = String.format("%s", tempFile.getAbsoluteFile());
//            System.out.println(cmf);
//            String logs = terminal.ejecutar(cmf);
////            tempFile.deleteOnExit();
//            System.out.println("logs:" + logs);
//        }
        RestClient.downloadFile("https://firebasestorage.googleapis.com/v0/b/letritas-48681.appspot.com/o/circuit-board.png?alt=media&token=919882ea-9aa8-496c-9e34-94d4d85afac4");
    }
}
