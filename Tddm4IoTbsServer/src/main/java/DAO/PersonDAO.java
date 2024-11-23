/**
 * Esta clase esta destinada a la realización del acceso a datos de la Entidad
 * Persona, permitiendo procesos de registro, modificación, logeo, entre otras
 */
package DAO;

import com.google.gson.JsonObject;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import javax.swing.table.DefaultTableModel;
import models.Person;
import util.Conection;
import util.DataStatic;
import util.Methods;

/**
 *
 * @author tonyp
 */
public class PersonDAO {

    private Conection conex;

    /**
     * In this function, the information of the new user is sent to the
     * database, in order for it to be inserted correctly and then return the
     * data of the registered user and avoid doing a repetitive function that
     * requests the data once the data is obtained. id of the user who
     * registers.
     *
     * @param per user data to be inserted.
     * @return [0] insert result, [1] data to return and save the log
     */
    public String[] insertPerson(Person per) {
        String query = String.format("select * from person_insert('%s')", per.returnXml());
        System.out.println(query);
        conex = new Conection();
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", "[]"};
        }
    }

    /**
     * *
     * Returns a table with all the users that have an email associated with the
     * sent parameter.
     *
     * @param per User information to be logged in.
     * @return returns a table with the users.
     */
    public DefaultTableModel logIn(Person per) {
        String query = String.format("select per.id_person, per.name_person, per.lastname_person, per.email_person, per.password_person, per.pathimg_person, per.type_person, per.provider_person from person as per where per.email_person='%s'", per.getEmail_person());
        conex = new Conection();
        System.out.println(query);
        return conex.returnRecord(query);
    }

    public int[] getIndexLogin(DefaultTableModel table, String contrasenia, String proveedor,
            int indc, int indp) {
        int index = -1, status = 4;
        boolean flag1 = false, flag2 = false;
        for (int cont = 0; cont < table.getRowCount(); cont++) {
            if (table.getValueAt(cont, indc).toString().equals(contrasenia)) {
                flag1 = true;
            } else {
                index = cont;
                status = 3;
            }
            if (table.getValueAt(cont, indp).toString().equals(proveedor)) {
                flag2 = true;
            } else {
                status = 5;
                index = cont;
            }
            if (flag1 && flag2) {
                index = cont;
                status = 2;
            }
        }
        return new int[]{status, index};
    }

    /**
     * Extract the user data required to form the session token.
     *
     * @param jso - Json object that contains the information of the user in
     * question.
     * @return returns the session object, purged of sensitive parameters and
     * with the jwt included.
     */
    public String personToJson(JsonObject jso, String customer) {
        String key = DataStatic.privateKey;
        long tiempo = System.currentTimeMillis();
        JwtBuilder jwtb = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, key)
                .setSubject("-1")
                .claim("user", Methods.JsonToString(jso, "id_person", ""))
                .claim("permit", Methods.JsonToString(jso, "type_person", ""))
                .setIssuedAt(new Date(tiempo));

        if (!customer.equals("mobile") && !customer.equals("desktop")) {
            jwtb = jwtb.setExpiration(new Date(tiempo + 7200000));//120 min
        }
        String jwt = jwtb.compact();

        jso.addProperty("user_token", jwt);
        jso.remove("id_person");
        jso.remove("password_person");

        return jso.toString();
    }

    /**
     * *
     * Allows the user in question to edit. Query user data.
     *
     * @param per - You need the parameters that you are going to modify.
     * @return - [0] edit result, [1] data to return and save
     */
    public String[] updatePerson(Person per) {
        String query = String.format("select * from person_update('%s')", per.returnXml());
        conex = new Conection();
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", "[]"};
        }
    }

    /**
     * *
     * In this function the modification of the database is carried out,
     * establishing a new verification code.
     *
     * @param per - send the necessary data to modify the user code.
     * @param flag - possibilities: 1 the user id is sent, flag 2 the email.
     *
     * @return email
     */
    public String[] requestCode(Person per, String flag) {
        String query = String.format("select * from person_requestcode('%s', %s)", per.returnXml(), flag);
        conex = new Conection();
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", "[]"};
        }
    }

    public String changePassword(Person per, String flag) {
        String query = String.format("select * from person_changepassword('%s', %s)", per.returnXml(), flag);
        conex = new Conection();
        return conex.fillString(query);
    }

    public boolean activeAccount(Person per) {
        String query = String.format("update person set type_person='U', codeverifitacion_person='' where id_person=%s and codeverifitacion_person='%s'", per.getId_person(), per.getCodeverifitacion_person());
        System.out.println(query);
        conex = new Conection();
        return (conex.updateDB(query) == 1);
    }

    public String changeImage(Person per) {
        String query = String.format("select pathimg_person from person where id_person=%s", per.getId_person());
        conex = new Conection();
        return conex.fillString(query);
    }

    public String getProfile(Person per) {
        String query = String.format("SELECT name_person, lastname_person, email_person, pathimg_person, datereg_person, type_person, id_city, provider_person FROM public.person where id_person=%s", per.getId_person());
        conex = new Conection();
        return conex.getRecordsInJson(query);
    }

    public Boolean isAdminOrRoot(String identifier) {
        conex = new Conection();
        String sentency = String.format("select count(*) from person as p where p.id_person=%s and (p.type_person='A' or p.type_person='R')", identifier);
        String res = conex.fillString(sentency);
        return res.equals("1");
    }

    public boolean insertCodigo(String email, String code) {
        conex = new Conection();
        String query = String.format("update person set codeverifitacion_person = '%s' where email_person = '%s'", code, email);
        return conex.modifyBD(query);
    }

    public String[] getUsers(Person per) {
        String query = String.format("select * from person_select('%s')", per.getId_person());
        System.out.println(query);
        conex = new Conection();
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", "[]"};
        }
    }

    public String stateUsers(String idUsers, String status) {
        conex = new Conection();
        String query = String.format("select * from person_state(%s, '%s')", idUsers, status);
        System.out.println(query);
        String resp = conex.fillString(query);
        return resp.matches("[24]") ? resp : "4";
    }
    
    public String emailtoid(String email)
    {
        conex = new Conection();
        String query = String.format("select * from email_to_id('%s')", email);
        DefaultTableModel table=conex.returnRecord(query);
        if(table.getRowCount()>0)
            return table.getValueAt(0, 1).toString();
        else
            return "[]";
    }
    
    
    
}
