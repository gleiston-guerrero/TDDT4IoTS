/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apis;
import Controller.Entregable_ComponentCtrl;
import Controller.PersonaCtrl;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.File;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import util.DataStatic;
import util.FileAccess;
import util.Methods;
import util.WeEncoder;

/**
 *
 * @author HECTOR CASANOVA
 */

@Path("entregableComponents")
public class Entregable_TaskApis {
    Entregable_ComponentCtrl entregableCtrl;
    PersonaCtrl person;
    public Entregable_TaskApis(){
        entregableCtrl = new Entregable_ComponentCtrl();
        person=new PersonaCtrl();
    }
    
    @Context
    private HttpServletRequest request;
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/saveEntregableTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createTask(String data) {
        String menssage = "";

        JsonObject Jso = Methods.stringToJSON(data);

        if (Jso.size() > 0) {
            String idEntregable = Methods.JsonToString(Jso, "id_entregable", "");
            String nombreTarea = Methods.JsonToString(Jso, "name_component", "");
            String descripcionTarea = Methods.JsonToString(Jso, "description_component", "");
            String statusTask = Methods.JsonToString(Jso, "status_component", "");  //finalizado intermedio y asi
            String visibilidadTask = Methods.JsonToString(Jso, "visibility_component", ""); // si a sido borado o no
            String fechaEstimada = Methods.JsonToString(Jso, "stimateddate_component", "");
            String fechaFinalizacion = Methods.JsonToString(Jso, "finishdate_component", "");
            //String pathtask = Methods.JsonToString(Jso, "path_component", "");
            String pathtask = nombreTarea;
            String base_porcentaje_component = Methods.JsonToString(Jso, "base_percentage_component", "");
            String develop_status_component = Methods.JsonToString(Jso, "develop_status_component", "");
            String actual_percentage_component = Methods.JsonToString(Jso, "actual_percentage_component", "");
            String path_master_project = Methods.JsonToString(Jso, "path_master_project", "");
            String path_project_entregable = Methods.JsonToString(Jso, "path_project_entregable", "");
            String startdate_component = Methods.JsonToString(Jso, "startdate_component", "");
            String email = Methods.JsonToString(Jso, "emailperson", "");
            String id_tcejorpmaster = Methods.JsonToString(Jso, "id_tcejorpmaster", "");
            
            WeEncoder encoder = new WeEncoder();
            id_tcejorpmaster = encoder.textDecryptor(id_tcejorpmaster);
            
            
            //Replace the special characters to create the folder and save on the database:
            pathtask = pathtask.replaceAll("\\W", "x"); 
            
            String toInsert = (""
                    + "<project_entregable_component>\n"
                        + "	<stimateddate_component>" + fechaEstimada + "</stimateddate_component>\n"
                        + "	<description_component>" + descripcionTarea + "</description_component>\n"
                        + "	<name_component>" + nombreTarea + "</name_component>\n"
                        + "	<status_component>" + statusTask + "</status_component>\n"
                        + "	<id_entregable>" + idEntregable + "</id_entregable>\n"
                        + "	<visibility_component>" + visibilidadTask + "</visibility_component>\n"
                        + "	<finishdate_component>" + fechaFinalizacion + "</finishdate_component>\n"
                        + "	<path_component>" + pathtask + "</path_component>"
                        + "     <base_percentage_component>" + base_porcentaje_component + "</base_percentage_component>\n"
                        + "     <actual_percentage_component>" + actual_percentage_component + "</actual_percentage_component>\n"
                        + "     <develop_status_component>" + develop_status_component + "</develop_status_component>"
                        + "     <startdate_component>" + startdate_component + "</startdate_component>"
                        + "	<personid>"+person.emailgetid(email)+"</personid>\n" 
                        + "	<id_masterproject>"+id_tcejorpmaster+"</id_masterproject>\n" 
                    + "</project_entregable_component>");
            String [] response = entregableCtrl.insertNewEntregableTask(toInsert);
            
            menssage = Methods.getJsonMessage(response[0], response[1], response[2]);            
            //String objResp=resp[0].substring(1, resp[0].length()-1);
            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));
            
            FileAccess fileCreate = new FileAccess();
            
               //System.out.println(ruta.trim().concat("tddm4iotbs_projects").concat("/caaaaEolPoOZaiErTrZbrZbrZbZaiCNZZaiPoOMAwrZbJZZfWEtnnO115").concat("/Entregables"));
               //String [] pepa={"10","hola mundo","21"};
               //saveJsonEntregable(pepa,ruta1);
              // String rutaAbs=ruta.trim().concat("tddm4iotbs_projects")
              //         .concat("/caaaaEolPoOZaiErTrZbrZbrZbZaiCNZZaiPoOMAwrZbJZZfWEtnnO115/").concat(DataStatic.folderEntregables)
                //       .concat("/entregable.json");
              // jsonObjectCreateNomenclature(pepa,ruta2,false);
               String rutaAbs=ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) //poner ruta del proyecto
                       .concat(DataStatic.folderEntregables)
                       .concat(path_project_entregable + "/")
                       .concat(DataStatic.folderComponents)
                       .concat(pathtask + "/");  
               //jsonObjectCreateNomenclature(pepa,ruta2,false);
               fileCreate.ValidateFolderExists(rutaAbs);
               //String [] datos={"",descripcionTarea,Methods.stringToJSON(objResp).get("id_entregable_task").toString()};
               //saveJsonEntregable(datos,rutaAbs,nombreTarea);
            // CreateJsonEntregable(ruta1,null);              
            
                rutaAbs =ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) //poner ruta del proyecto
                       .concat(DataStatic.folderEntregables)
                       .concat(path_project_entregable + "/")
                       .concat(DataStatic.folderComponents)
                       .concat(pathtask + "/")
                       .concat(DataStatic.folderTasks + "/");  
               //jsonObjectCreateNomenclature(pepa,ruta2,false);
               fileCreate.ValidateFolderExists(rutaAbs);
        } else {
            menssage = Methods.getJsonMessage("4", "Missing data.", "[]");
        }
        return Response.ok(menssage)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/updateEntregableComponent")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response UpdateTask(String data) {

        String menssage = "";
        JsonObject Jso = Methods.stringToJSON(data);

        if (Jso.size() > 0) {

            String identregableTask = Methods.JsonToString(Jso, "identregablecomponent", "");
            String nombreTarea = Methods.JsonToString(Jso, "name_component", "");
            String descripcionTarea = Methods.JsonToString(Jso, "description_component", "");
            String statusTask = Methods.JsonToString(Jso, "status_component", "");  //finalizado intermedio y asi
            String fechaEstimada = Methods.JsonToString(Jso, "stimateddate_component", "");
            String pathtask = Methods.JsonToString(Jso, "path_component", "");
            String porcentaje = Methods.JsonToString(Jso, "base_percentage_component", "");
            String id_entregable = Methods.JsonToString(Jso, "id_entregable", "");
            String actual_percentage_component = Methods.JsonToString(Jso, "actual_percentage_component", "");
            String startdate_component = Methods.JsonToString(Jso, "startdate_component", "");            
            String email = Methods.JsonToString(Jso, "emailperson", "");    
            String id_tcejorpmaster = Methods.JsonToString(Jso, "id_tcejorpmaster", "");
            
            
            String toInsert = ("<project_entregable_component>\n"
                                    + " <id_entregable_component>" + identregableTask + "</id_entregable_component>\n"
                                    + "	<stimateddate_component>" + fechaEstimada + "</stimateddate_component>\n"
                                    + "	<description_component>" + descripcionTarea + "</description_component>\n"
                                    + "	<name_component>" + nombreTarea + "</name_component>\n"
                                    + "	<status_component>" + statusTask + "</status_component>\n"
                                    + "	<path_component>" + pathtask + "</path_component>"
                                    + " <actual_percentage_component>" + actual_percentage_component + "</actual_percentage_component>\n"
                                    + " <base_percentage_component>" + porcentaje + "</base_percentage_component>"
                                    + "	<personid>"+person.emailgetid(email)+"</personid>\n" 
                                    + "	<id_masterproject>"+ id_tcejorpmaster +"</id_masterproject>\n" 
                    + "</project_entregable_component>");
            
            
            String [] rep=entregableCtrl.UpdateEntregableTask("<project_entregable_component>\n"
                                    + "<id_entregable_component>" + identregableTask + "</id_entregable_component>\n"
                                    + "	<stimateddate_component>" + fechaEstimada + "</stimateddate_component>\n"
                                    + "	<description_component>" + descripcionTarea + "</description_component>\n"
                                    + "	<name_component>" + nombreTarea + "</name_component>\n"
                                    + "	<status_component>" + statusTask + "</status_component>\n"
                                    + "	<path_component>" + pathtask + "</path_component>\n"
                                    + " <base_percentage_component>" + porcentaje + "</base_percentage_component>\n"
                                    + " <actual_percentage_component>" + actual_percentage_component + "</actual_percentage_component>\n"
                                    + " <id_entregable>" + id_entregable + "</id_entregable>\n"
                                    + " <startdate_component>" + startdate_component + "</startdate_component>\n"   
                                    + "	<personid>"+person.emailgetid(email)+"</personid>\n"
                                    + "	<id_masterproject>"+ id_tcejorpmaster +"</id_masterproject>\n" 
                    + "</project_entregable_component>");
            
            menssage = Methods.getJsonMessage(rep[0], rep[1], rep[2]);
//
            /*String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));
            String rutaAbs = ruta.trim().concat("tddm4iotbs_projects")
                    .concat("/aaaaaaaaaaEolPoOZaiYUoErTErTErTSkpCNZZairZbCNZErTDepDDkkDsp115/").concat(DataStatic.folderEntregables)
                    .concat("/"+nombreTarea+".json");
            //jsonObjectCreateNomenclature(pepa,ruta2,false);
            String[] datos = {porcentaje, descripcionTarea, identregableTask};
            upateJsonEntregable(datos, rutaAbs);
            System.out.println("se va a actualizar222");*/
        } else {
            menssage = Methods.getJsonMessage("4", "Missing data.", "[]");
        }
        return Response.ok(menssage)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/updatePercentageComponent")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updatePercentageComponent(String data) {
        String message;
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {            
            String idType = "2";            
            String idParentElement = Methods.JsonToString(Jso, "idParentElement", "");
            String idElementToEdit = Methods.JsonToString(Jso, "idElementToEdit", "");
            String percentageEdit = Methods.JsonToString(Jso, "percentageEdit", "");
            String description_update_task = Methods.JsonToString(Jso, "description_update_task", "");
            
            String toInsert = "<update_element>\n"
                                    + "<type>" + idType + "</type>\n"
                                    + " <id_elementParent>" + idParentElement + "</id_elementParent>\n"
                                    + "	<id_elementToEdit>" + idElementToEdit + "</id_elementToEdit>\n"
                                    + "	<percentage>" + percentageEdit + "</percentage>\n"    
                                    + "	<description_update>" + description_update_task + "</description_update>\n"                    
                             + "</update_element>";
            
            String [] resp =entregableCtrl.updateBasePercentageComponent(toInsert);
            

            message = Methods.getJsonMessage(resp[0], "Succesfully updated", "[]");
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
    @Path("/getComponentas")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response selectComponents(String data){
        String message = "";        
        JsonObject jso = Methods.stringToJSON(data);
        if(jso.size() > 0){
            String id_entregable = Methods.JsonToString(jso, "id_entregable", "");
            String type = Methods.JsonToString(jso, "type", "");
            String email = Methods.JsonToString(jso, "email", "");

            String [] response = entregableCtrl.selectEntregableTask(type, id_entregable,email);
            JsonArray jArr = Methods.stringToJsonArray(response[2]);
            
            message = Methods.getJsonMessage(response[0], response[1], jArr.toString());            
            
        }
        else{
            message = Methods.getJsonMessage("4", "Missing data.", "[]");
        }
     
         return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }    
    
}
