/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author tonyp
 */
public class TerminalWindows {

    private OutputStreamWriter outputStreamWriter;
    private Process p;

    public String resultado = "";
    public boolean status = false;

    public TerminalWindows() {
        openProcess();
    }

    public boolean openProcess() {
        String[] command = {"cmd",};
//        String[] command = {"powershell",};
        try {
            p = Runtime.getRuntime().exec(command);
            status = true;
            System.out.println("opened");
            return true;
        } catch (IOException e) {
            System.err.println("declare process error:" + e.getMessage());
            status = false;
            return false;
        }
    }

    public boolean closeProcess() {
        p.destroy();
        status = false;
        return true;
    }

    public boolean wait_for() {
        try {
            p.waitFor();
            return true;
        } catch (InterruptedException ex) {
            System.err.println("wait_for()" + ex.getMessage());
            return false;
        }
    }

    public String ejecutarComandos(String[] comandos) {
        System.out.println("estado:" + status);
        if (status) {
            try {
                outputStreamWriter = new OutputStreamWriter(p.getOutputStream());
                for (String comando : comandos) {
                    outputStreamWriter.write(comando + "\n");
                }
                outputStreamWriter.close();
                return getLogs();
            } catch (IOException ex) {
                wait_for();
                return "[command error] " + ex.getMessage();
            }
        }
        return "[commands could not be executed]";
    }

    public String ejecutar(String comando) {
        if (openProcess()) {
            try {
                outputStreamWriter = new OutputStreamWriter(p.getOutputStream());
                outputStreamWriter.write(comando + "\n");
                outputStreamWriter.close();
                return getLogs();
            } catch (IOException ex) {
                wait_for();
                return "[command error] " + ex.getMessage();
            }
        }
        return "[commands could not be executed]";
    }

    public String getLogs() {
        String result = "";
        try {
            String line;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                while ((line = reader.readLine()) != null) {
                    result += line + "\n";
                }
            }
            try (BufferedReader bre = new BufferedReader(new InputStreamReader(p.getErrorStream()))) {
                while ((line = bre.readLine()) != null) {
                    result += "[error] " + line + "\n";
                }
            }
        } catch (IOException err) {
            System.out.println("error:" + err.getMessage());
        }
        wait_for();
        return result.replace("<", "|").replace(">", "|");
    }

    public File creaFicheroTemporal(String[] comandos) {
        File tempFile = null;
        try {
            tempFile = File.createTempFile("mificherotemporal", ".bat");
            try (BufferedWriter out = new BufferedWriter(new FileWriter(tempFile))) {
                for (int indice = 0; indice < comandos.length; indice++) {
                    out.write(comandos[indice]);
                    if (indice < comandos.length - 1) {
                        out.newLine();
                    }
                }
            }
        } catch (IOException ex) {
            System.out.println("erroTempFile:" + ex.getMessage());
        }
        return tempFile;
    }
}
