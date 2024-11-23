/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

import java.awt.Desktop;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.JLabel;
import org.apache.commons.io.FileUtils;

/**
 *
 * @author tonyp
 */
public class BrowserClass {

    private static void abrirNavegadorPredeterminadorWindows(String url) {
        try {
            Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
        } catch (IOException ex) {
            Logger.getLogger(BrowserClass.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static void abrirNavegadorPredeterminadorLinux(String url) {
        try {
            Runtime.getRuntime().exec("xdg-open " + url);
        } catch (IOException ex) {
            Logger.getLogger(BrowserClass.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static void abrirNavegadorPredeterminadorMacOsx(String url) {
        try {
            Runtime.getRuntime().exec("open " + url);
        } catch (IOException ex) {
            Logger.getLogger(BrowserClass.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static void abrirNavegadorPorDefecto(String url) {
        String osName = System.getProperty("os.name");
        if (osName.contains("Windows")) {
            abrirNavegadorPredeterminadorWindows(url);
        } else if (osName.contains("Linux")) {
            abrirNavegadorPredeterminadorLinux(url);
        } else if (osName.contains("Mac OS X")) {
            abrirNavegadorPredeterminadorMacOsx(url);
        } else {
            System.out.println("Imposible activar :c");
        }
    }

    public static Image cargarImagenDeInternet(String direccion) {
        try {
            URL url = new URL(direccion);
            Image img = ImageIO.read(url);
            return img;
        } catch (IOException ex) {
            return null;
        }
    }

    public static Image cargarImagenDeInternet(String direccion, int Width, int Height) {
        try {
            URL url = new URL(direccion);
            BufferedImage bimg = ImageIO.read(url);
            return bimg.getScaledInstance(Width, Height, Image.SCALE_AREA_AVERAGING);
        } catch (IOException ex) {
            System.out.println("cargarImagenDeInternetError: " + ex.getMessage());
            return null;
        }
    }

    public static String descargarArchivo(String uri, String filename) {
        String ruta;
        try {
            URL url = new URL(uri);
            Path tempDir = Files.createTempDirectory("tddm4iotbs");
            System.out.println("ruta: " + tempDir.toFile().getAbsolutePath());
            File tmp = new File(tempDir.toFile().getAbsolutePath() + "/" + filename);
            FileUtils.copyURLToFile(url, tmp);
            ruta = tmp.getAbsolutePath();
        } catch (IOException ex) {
            ruta = "";
            System.out.println("Error_DownloadFile: " + ex.getMessage());
        }
        return ruta;
    }

    public boolean iniciarProceso(String ruta) {
        try {
            Desktop.getDesktop().open(new File(ruta));
            return true;
        } catch (IOException ex) {
            return false;
        }
    }
}
