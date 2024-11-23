/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

import java.net.NetworkInterface;
import java.net.UnknownHostException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import rojerusan.RSNotifyAnimated;

/**
 *
 * @author tonyp
 */
public final class UtilDesktop {
//    public static void dragDrop(){}

    public static String getUserPc() {
        return System.getProperty("user.name");
    }

    public static String getNameOS() {
        return System.getProperty("os.name");
    }

    public static String getPcName() {
        java.net.InetAddress localMachine;
        try {
            localMachine = java.net.InetAddress.getLocalHost();
            return localMachine.getHostName();
        } catch (UnknownHostException ex) {
            Logger.getLogger(UtilDesktop.class.getName()).log(Level.SEVERE, null, ex);
            return "unknown";
        }
    }

    public static String getMac() {
        String firstInterface = null;
        String MACAddress = "unknown";
        Map<String, String> addressByNetwork = new HashMap<>();
        Enumeration<NetworkInterface> networkInterfaces;
        try {
            networkInterfaces = NetworkInterface.getNetworkInterfaces();
            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface network = networkInterfaces.nextElement();

                byte[] bmac = network.getHardwareAddress();
                if (bmac != null) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < bmac.length; i++) {
                        sb.append(String.format("%02X%s", bmac[i], (i < bmac.length - 1) ? "-" : ""));
                    }

                    if (sb.toString().isEmpty() == false) {
                        addressByNetwork.put(network.getName(), sb.toString());
                    }

                    if (sb.toString().isEmpty() == false && firstInterface == null) {
                        firstInterface = network.getName();
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        if (firstInterface != null) {
            MACAddress = addressByNetwork.get(firstInterface);
        }
        return MACAddress;
    }

    public static void notification(String tittle, String content, int status) {
        RSNotifyAnimated.TypeNotify type;
        switch (status) {
            case 1:
                type = RSNotifyAnimated.TypeNotify.INFORMATION;
                break;
            case 2:
                type = RSNotifyAnimated.TypeNotify.SUCCESS;
                break;
            case 3:
                type = RSNotifyAnimated.TypeNotify.WARNING;
                break;
            default:
                type = RSNotifyAnimated.TypeNotify.ERROR;
                break;
        };

        new rojerusan.RSNotifyAnimated(tittle, content, 7,
                RSNotifyAnimated.PositionNotify.BottomRight, RSNotifyAnimated.AnimationNotify.RightLeft,
                type).setVisible(true);
    }
}
