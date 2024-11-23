/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package apis;

import Controller.ComponentCtrl;
import util.Methods;
import com.google.gson.JsonObject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import util.DataStatic;

/**
 * REST Web Service
 *
 * @author tonyp
 */
@Path("components")
public class ComponentsApis {

    @Context
    private UriInfo context;

    private ComponentCtrl cControl;

    @Context
    private HttpServletRequest request;

    /**
     * Creates a new instance of ComponentsApis
     */
    public ComponentsApis() {
        cControl = new ComponentCtrl();
    }

    /**
     * This is the web service that allows you to obtain the components that are
     * active.
     *
     * @param data String type variable, receives a json with the necessary data
     * (one of them is the session token).
     * @return Returns a json with the results of the processes of the
     * Controller's getComponentsActive function
     */
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/getComponents")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getComponents(String data) {
        String message;
        System.out.println("getComponents() xter");
        System.out.println(data);
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String sessionToken = Methods.JsonToString(Jso, "user_token", "");
            String type = Methods.JsonToString(Jso, "type", "");
            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

            String[] clains = Methods.getDataToJwt(sessionToken);
            System.out.println("clains 0 => " + clains[0]);
            System.out.println("clains 1 => " + clains[1]);
            //clains[0] = "1";/*BORRARRRR*/

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = cControl.selectComponents(type, clains[0], ruta);
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

    /**
     * This is the web service that allows you to save the components.
     *
     * @param data String type variable, receives a json with the necessary data
     * (one of them is the session token).
     * @return Returns a json with the results of the processes of the
     * Controller's saveComponent function.
     */
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/saveComponent")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response saveComponent(String data) {
        String message;
        System.out.println("saveComponent()");
        System.out.println(data);
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String sessionToken = Methods.JsonToString(Jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(sessionToken);

            String nameComponent = Methods.JsonToString(Jso, "nameComponent", "");
            String descriptionComponennt = Methods.JsonToString(Jso, "descriptionComponent", "");
            String type = Methods.JsonToString(Jso, "type", "");

            String base64component = Methods.JsonToString(Jso, "base64component", "");
            String dataParamPorts = Methods.JsonToString(Jso, "dataPorts", "");

            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = cControl.insertComponent(nameComponent, descriptionComponennt, type, clains[0], ruta, base64component, dataParamPorts, clains[1]);
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

    /**
     * This is the web service that allows you to update the components.
     *
     * @param data String type variable, receives a json with the necessary data
     * (one of them is the session token).
     * @return Returns a json with the results of the processes of the
     * Controller's saveComponent function.
     */
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/updateComponent")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateComponent(String data) {
        String message;
        System.out.println("updateComponent()");
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String sessionToken = Methods.JsonToString(Jso, "user_token", "");
            String[] clains = Methods.getDataToJwt(sessionToken);

            String nameComponent = Methods.JsonToString(Jso, "nameComponent", "");
            String descriptionComponennt = Methods.JsonToString(Jso, "descriptionComponent", "");
            String type = Methods.JsonToString(Jso, "type", "");
            String idComponent = Methods.JsonToString(Jso, "idComponent", "");
            
            String dataParamPorts = Methods.JsonToString(Jso, "dataPorts", "");

            String folderName = Methods.JsonToString(Jso, "folderName", "");

            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = cControl.updateComponent(idComponent ,nameComponent, descriptionComponennt, type, clains[0], ruta, dataParamPorts, folderName);
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

    /**
     * This is the web service that allows you to obtain the components that
     * were approved.
     *
     * @param data String type variable, receives a json with the necessary data
     * (one of them is the session token).
     * @return It returns a json with the results of the processes of the
     * function aproveComponent of the Controller.
     */
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/stateComponent")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response stateComponent(String data) {
        String message;
        System.out.println("stateComponent()");
        System.out.println(data);
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String sessionToken = Methods.JsonToString(Jso, "user_token", "");
            String idComponent = Methods.JsonToString(Jso, "id_component", "");
            String action = Methods.JsonToString(Jso, "action", "");
            String[] clains = Methods.getDataToJwt(sessionToken);

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = cControl.stateComponent(idComponent, action, clains[1]);
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

    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/getInfoComponent")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getInfoComponent(String data) {
        String message;
        System.out.println("getInfoComponent()");
        System.out.println(data);
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String sessionToken = Methods.JsonToString(Jso, "user_token", "");
            String id_component = Methods.JsonToString(Jso, "id_component", "");
            String[] clains = Methods.getDataToJwt(sessionToken);

            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

            String[] res = Methods.validatePermit(clains[0], clains[1], 1);
            if (res[0].equals("2")) {
                res = cControl.getComponentInfo(id_component, ruta);
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
