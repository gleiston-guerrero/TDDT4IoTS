/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utiles;

import ses.UserObject;
import socks.WsCliente;
import view.InitForm;

/**
 *
 * @author tonyp
 */
public class ScopeApp {

    private static UserObject dataUser = null;
    private static WsCliente wsClient = null;
    private static InitForm mainForm = null;

    public static UserObject getDataUser() {
        return dataUser;
    }

    public static void setDataUser(UserObject dataUser) {
        ScopeApp.dataUser = dataUser;
    }

    public static WsCliente getWsClient() {
        return wsClient;
    }

    public static void setWsClient(WsCliente wsClient) {
        ScopeApp.wsClient = wsClient;
    }

    public static InitForm getMainForm() {
        return mainForm;
    }

    public static void setMainForm(InitForm mainForm) {
        ScopeApp.mainForm = mainForm;
    }

}
