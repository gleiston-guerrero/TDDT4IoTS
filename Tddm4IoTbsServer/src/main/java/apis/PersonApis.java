/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package apis;

import Controller.PersonaCtrl;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import util.Methods;

/**
 * REST Web Service
 *
 * @author tonyp
 */
@Path("personapis")
public class PersonApis {

    @Context
    private UriInfo context;
    @Context
    private HttpServletRequest request;

    PersonaCtrl pControl;

    /**
     * Creates a new instance of PersonaApis
     */
    public PersonApis() {
        pControl = new PersonaCtrl();
    }

    @POST
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response insertPerson(String data) {
        String message;
        System.out.println("insertPerson...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String name = Methods.JsonToString(jso, "name", "");
            String lastname = Methods.JsonToString(jso, "lastname", "");
            String email = Methods.JsonToString(jso, "email", "");
            String password = Methods.JsonToString(jso, "password", "");
//            String id_ciudad = Methods.JsonToString(jso, "id_ciudad", "103-1807-562846");
            String provider = Methods.JsonToString(jso, "provider", "");

            String base = Methods.JsonToString(jso, "base64", "");

            String[] res = pControl.insertPerson(name, lastname, email, password, "103-1807-562846", provider,
                    base, request.getServletContext().getRealPath(""));
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/logIn")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response logIn(@Context HttpHeaders headers, String data) {

        /*
        headers.getHeaderString("Tddm4IoTbs")
         */
        String message;
        System.out.println("logIn...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String email = Methods.JsonToString(jso, "email", "");
            String password = Methods.JsonToString(jso, "password", "");
            String provider = Methods.JsonToString(jso, "provider", "native");
//            String customer = headers.getHeaderString("customer");
//            customer = customer == null ? "" : customer;
            String customer = "desktop";
            String[] res = pControl.logIn(email, password, provider, customer);
            message = Methods.getJsonMessage(res[0], res[1], res[2]);
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }

        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/updatePerson")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updatePerson(String data) {
        String message;
        System.out.println("updatePerson...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String name = Methods.JsonToString(jso, "name", "");
            String lastname = Methods.JsonToString(jso, "lastname", "");
//            String contacto = Methods.JsonToString(jso, "contacto", "");
            String id_ciudad = Methods.JsonToString(jso, "id_ciudad", "");

            String user_token = Methods.JsonToString(jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(user_token);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = pControl.updatePerson(clains[0], name, lastname, id_ciudad);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else {
                message = Methods.getJsonMessage("4", "Error in the request parameters.", "[]");
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/requestCode")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response requestCode(String data) {
        String message;
        System.out.println("requestCode...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String flag = Methods.JsonToString(jso, "flag", "");
            if (flag.equals("1")) {
                String user_token = Methods.JsonToString(jso, "user_token", "");
                String[] clains = Methods.getDataToJwt(user_token);

                String[] res = Methods.validatePermit(clains[0], clains[1], 1);
                if (res[0].equals("2")) {
                    res = pControl.requestCode(clains[0], flag);
                    message = Methods.getJsonMessage(res[0], res[1], res[2]);
                } else {
                    message = Methods.getJsonMessage(res[0], res[1], res[2]);
                }
            } else {
                String email = Methods.JsonToString(jso, "email", "");
                String[] res = pControl.requestCode(email, flag);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/changePassword")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changePassword(String data) {
        String message;
        System.out.println("changePassword...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String flag = Methods.JsonToString(jso, "flag", "");
            String codigo = Methods.JsonToString(jso, "codigo", "");
            String contrasenia = Methods.JsonToString(jso, "contrasenia", "");
            if (flag.equals("1")) {
                String user_token = Methods.JsonToString(jso, "user_token", "");
                String[] clains = Methods.getDataToJwt(user_token);

                String[] res = Methods.validatePermit(clains[0], clains[1], 1);
                if (res[0].equals("2")) {
                    res = pControl.changePassword(clains[0], codigo, contrasenia, flag);
                    message = Methods.getJsonMessage(res[0], res[1], res[2]);
                } else {
                    message = Methods.getJsonMessage(res[0], res[1], res[2]);
                }

            } else {
                String email = Methods.JsonToString(jso, "email", "");
                String[] res = pControl.changePassword(email, codigo, contrasenia, flag);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/activeAccount")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response activeAccount(String data) {
        String message;
        System.out.println("activeAccount...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String codigo = Methods.JsonToString(jso, "codigo", "");
            String user_token = Methods.JsonToString(jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(user_token);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = pControl.activeAccount(clains[0], codigo);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else {
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/changeImage")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeImage(String data) {
        String message;
        System.out.println("changeImage...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String imginfo = Methods.JsonToString(jso, "imginfo", "");
            String user_token = Methods.JsonToString(jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(user_token);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = pControl.changeImage(clains[0], request.getServletContext().getRealPath(""), imginfo);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else {
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/getProfile")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getProfile(String data) {
        String message;
        System.out.println("getProfile...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String user_token = Methods.JsonToString(jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(user_token);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = pControl.getProfile(clains[0]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else {
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/getdatasession")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getDataSession(String data) {
        JsonObject Jso = Methods.stringToJSON(data);
        String user_token = Methods.JsonToString(Jso, "user_token", "");
        String[] res = Methods.getDataToJwt(user_token);
        String jsonresponse = Methods.getJsonMessage(
                String.valueOf(((res[0].equals("") || res[0].equals("-1")) ? 4 : 2)),
                (res[0].equals("") ? "invalid session" : "sesi�n v�lida."), "{\"permmit\":\"" + res[1] + "\"}");
        return Response.ok(jsonresponse)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @POST
    @Path("/getUsers")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getUsers(String data) {
        String message;
        System.out.println("getUsers...");
        JsonObject jso = Methods.stringToJSON(data);
        if (jso.size() > 0) {
            String user_token = Methods.JsonToString(jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(user_token);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = pControl.getUsers(clains[0]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else {
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "{}");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/stateUsers")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response stateUsers(String data) {
        String message;
        System.out.println("stateUsers()");
        System.out.println(data);
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String sessionToken = Methods.JsonToString(Jso, "user_token", "");
            String id_person = Methods.JsonToString(Jso, "id_person", "");
            String action = Methods.JsonToString(Jso, "action", "");
            String[] clains = Methods.getDataToJwt(sessionToken);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = pControl.stateUsers(id_person, action, clains[1]);
                message = Methods.getJsonMessage(res[0], res[1], res[2]);
            } else {
                message = Methods.getJsonMessage("4", "Error in the request parameters.", "[]");
            }
        } else {
            message = Methods.getJsonMessage("4", "Missing data.", "[]");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }

}
