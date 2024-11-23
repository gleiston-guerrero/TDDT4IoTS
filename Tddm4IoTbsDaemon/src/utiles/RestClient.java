/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author tonyp
 */
public class RestClient {

    public static String[] requestGet(String urlService) {
        String[] resp = {"4", "{}"};
        try {
            URL url = new URL(urlService);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            if (conn.getResponseCode() == 200) {
                BufferedReader br = new BufferedReader(new InputStreamReader(
                        (conn.getInputStream())));
                String output;
                String response = "";
                while ((output = br.readLine()) != null) {
                    response += output;
                }
                resp[0] = "2";
                resp[1] = response;
            }
            conn.disconnect();

        } catch (Exception e) {
            System.out.println("GetError: " + e.getMessage());
        }
        return resp;
    }

    public static String[] requestPost(String urlService, String requestBody) {
        String[] resp = {"4", "{}"};
        try {
            URL url = new URL(urlService);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");

            OutputStream os = conn.getOutputStream();
            os.write(requestBody.getBytes());
            os.flush();

            if (conn.getResponseCode() == 200) {
                BufferedReader br = new BufferedReader(new InputStreamReader(
                        (conn.getInputStream())));
                String output;
                String response = "";
                while ((output = br.readLine()) != null) {
                    response += output;
                }
                resp[0] = "2";
                resp[1] = response;
            }
            conn.disconnect();

        } catch (Exception e) {
            System.out.println("PostError: " + e.getMessage());
        }
        return resp;
    }

    public static String[] downloadFile(String webUrl) {
        int bytesum = 0;
        int byteread = 0;
        String[] resp = new String[]{"4", "", ""};
        URL url;
        try {
            url = new URL(webUrl);
            URLConnection conn = url.openConnection();
            InputStream inStream = conn.getInputStream();
            String fileName = String.valueOf(System.currentTimeMillis()) + ".ino";
            FileOutputStream fs = new FileOutputStream(fileName);

            byte[] buffer = new byte[1204];
            while ((byteread = inStream.read(buffer)) != -1) {
                bytesum += byteread;
                fs.write(buffer, 0, byteread);
            }
            inStream.close();
            resp = new String[]{"2", "[downloadFile] ...ok", fileName};
            System.out.println(resp[1]);
        } catch (Exception e) {
            resp[1] = "[downloadFileError] " + e.getMessage();
            System.out.println(resp[1]);
        }
        return resp;
    }
}
