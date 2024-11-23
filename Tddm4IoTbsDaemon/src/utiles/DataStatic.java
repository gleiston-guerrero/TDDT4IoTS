/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

/**
 *
 * @author Usuario
 */
public class DataStatic {

    public static String applicationName = "TddM4IoTBS";

    private static String protocol = "http";
//    private static String domain = "aplicaciones.uteq.edu.ec/";
    private static String domain = "localhost:8080/";

    private static String uriServer = "Tddm4IoTbsServer/";
    private static String uriApplication = "tddm4iots/";

    private static String uriWebSocket = "daemon_socket";
    private static String uriWebServices = "webapis/";

    public static String getWebSocketURL() {
        return (protocol.equals("http") ? "ws" : "wss") + "://" + domain + uriServer + uriWebSocket;
    }

    //personapis/logIn
    public static String getServicesURL(String relUrl) {
        return protocol + "://" + domain + uriServer + uriWebServices + relUrl;
    }

    public static String getApplicationURL() {
        return protocol + "://" + domain + uriApplication;
    }

    public static String uriStorage = "storageTddm4IoTbs/";

    private static String dirUser = "UserImage/";
    private static String dirProject = "tddm4iotbs_projects/";

    public static String getStorageUrl(String flag) {
        if (flag.equals("usr")) {
            return protocol + "://" + domain + uriStorage + dirUser;
        } else {
            return protocol + "://" + domain + uriStorage + dirProject;
        }
    }

}
