/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package util;

import javax.swing.table.DefaultTableModel;

/**
 *
 * @author tonyp
 */
public class TemplateEmail {

    private Conection conex;
    private final String sentency = "select * from public.utils";

    public TemplateEmail() {
        conex = new Conection();
    }

    public void insertarUsuario(String email, String name, String lastname, String code) {
        Thread tr = new Thread(() -> {
            System.out.println("Create user()");
            eInsertarUsuario(email, name, lastname, code);
        });
        tr.start();
    }

    public void solicitarCodigo(String email, String name, String lastname, String code) {
        Thread tr = new Thread(() -> {
            System.out.println("request code()");
            eSolicitarCodigo(email, name, lastname, code);
        });
        tr.start();
    }

    private void eInsertarUsuario(String email, String name, String lastname, String code) {
        DefaultTableModel table = conex.returnRecord(sentency);
        String respon = recorre(table, "splantilla");
        String urlx = recorre(table, "urlX");

        respon = respon.replace("${paramnames}", name + " " + lastname);
        respon = respon.replace("${paramintro}", "This account has been registered");
        respon = respon.replace("${hosturl}", urlx);
        respon = respon.replace("${hostname}", DataStatic.nameApplication);
        respon = respon.replace("${paramdetail}", "account confirmation");
        respon = respon.replace("${code}", code);
        respon = respon.replace("To skip some steps in the process, click on the link below <a href=\"${hosthackurl}\" target=\"_blank\">link</a>.", "");

        Email em = new Email();
        WeEncoder wEr = new WeEncoder();
        em.setmyEmailFrom(recorre(table, "email"), recorre(table, "emailpass"));
        em.setContentEmail(email, "Welcome to the " + DataStatic.nameApplication + " community.", respon);
        boolean status = em.sendmyEmail();
        System.out.println("Status send email: " + status);
    }

    private void eSolicitarCodigo(String email, String name, String lastname, String code) {
        DefaultTableModel table = conex.returnRecord(sentency);
        String respon = recorre(table, "splantilla");
        String urlx = recorre(table, "urlaplication");

        respon = respon.replace("${paramnames}", name + " " + lastname);
        respon = respon.replace("${paramintro}", "You have requested a code for account recovery");
        respon = respon.replace("${hosturl}", urlx);
        respon = respon.replace("${hostname}", DataStatic.nameApplication);
        respon = respon.replace("${paramdetail}", "change of password");
        respon = respon.replace("${code}", code);
        respon = respon.replace("${hosthackurl}", urlx + "resetpassword.html?op=chgpwd&usr=" + email + "&code=" + code);

        Email em = new Email();
        WeEncoder wEr = new WeEncoder();
        em.setmyEmailFrom(recorre(table, "email"), recorre(table, "emailpass"));
        em.setContentEmail(email, "Password change request in the " + DataStatic.nameApplication + " community.", respon);

        boolean status = em.sendmyEmail();
        System.out.println("Status send email: " + status);
    }

    private String recorre(DefaultTableModel table, String param) {
        String result = "";
        for (int index = 0; index < table.getRowCount(); index++) {
            if (table.getValueAt(index, 0).toString().equals(param)) {
                result = table.getValueAt(index, 1).toString();
            }
        }
        return result;
    }

    public boolean enviarSugerencia(String asunto, String sugerencia) {

        DefaultTableModel table = conex.returnRecord(sentency);

        Email em = new Email();
        WeEncoder wEr = new WeEncoder();
        em.setmyEmailFrom(recorre(table, "email"), wEr.textDecryptor(recorre(table, "emailpass")));
        em.setContentEmail(recorre(table, "email"), asunto + " " + DataStatic.nameApplication + ".", sugerencia);

        boolean status = em.sendmyEmail();
        System.out.println("Status send email: " + status);
        return status;
    }
}
