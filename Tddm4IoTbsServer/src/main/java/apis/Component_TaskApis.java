/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apis;
import Controller.Component_TaskCtrl;
import Controller.PersonaCtrl;
import com.google.gson.JsonArray;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import util.Methods;
import com.google.gson.JsonObject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import util.DataStatic;
import util.FileAccess;
import util.WeEncoder;

/**
 *
 * @author HECTOR CASANOVA
 */
@Path("componentTask")
public class Component_TaskApis {
    Component_TaskCtrl taskController;
    private PersonaCtrl person;
    
    public Component_TaskApis(){
        taskController = new Component_TaskCtrl();
        person=new PersonaCtrl();
    }
    
    @Context
    private HttpServletRequest request;
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/insertComponentTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response insertComponentTask(String data){
        String message = "";
        System.out.println("la data " + data);
        JsonObject Jso = Methods.stringToJSON(data);
        System.out.println("la data2 jso " + Jso);
        if (Jso.size() > 0) {
            String idEntregable = Methods.JsonToString(Jso, "id_component", "");
            String nombreTarea = Methods.JsonToString(Jso, "name_task", "");
            String descripcionTarea = Methods.JsonToString(Jso, "description_task", "");
            String statusTask = Methods.JsonToString(Jso, "status_task", "");  //finalizado intermedio y asi
            String fechaEstimada = Methods.JsonToString(Jso, "stimateddate_task", "");
            //String fechaFinalizacion = Methods.JsonToString(Jso, "stimatteddate_task", "");
            String pathtask = nombreTarea;
            String base_porcentaje_component = Methods.JsonToString(Jso, "base_percentage_task", "");
            String actual_porcentaje_component = Methods.JsonToString(Jso, "actual_percentage_task", "");
            String develop_status_component = Methods.JsonToString(Jso, "develop_status_task", "");
            String path_master_project = Methods.JsonToString(Jso, "path_master_project", "");
            String path_project_entregable = Methods.JsonToString(Jso, "path_project_entregable", "");
            String path_component = Methods.JsonToString(Jso, "path_component", "");
            String startdate_task = Methods.JsonToString(Jso, "startdate_task", "");
//            String emailperson = Methods.JsonToString(Jso, "emailperson", "");
            String email = Methods.JsonToString(Jso, "emailperson", "");
            String id_masterproject = Methods.JsonToString(Jso, "id_masterproject", "");
            
            WeEncoder encoder = new WeEncoder();
            id_masterproject = encoder.textDecryptor(id_masterproject);
            
            //Replace the special characters to create the folder and save on the database:
            pathtask = pathtask.replaceAll("\\W", "x"); 
            
            String toInsert = (""
                    + "<component_task>\n"
                        + "	<id_component>" + idEntregable + "</id_component>\n"
                        + "	<name_task>" + nombreTarea + "</name_task>\n"
                        + "	<description_task>" + descripcionTarea + "</description_task>\n"
                        + "	<status_task>" + statusTask + "</status_task>\n"
                        + "	<path_task>" + pathtask + "</path_task>\n"
                        + "	<base_percentage_task>" + base_porcentaje_component + "</base_percentage_task>\n"
                        + "	<actual_percentage_task>" + actual_porcentaje_component + "</actual_percentage_task>\n"
                        + "     <stimateddate_task>" + fechaEstimada + "</stimateddate_task>\n"
                        + "     <develop_status_task>" + develop_status_component + "</develop_status_task>\n"
                        + "     <startdate_task>" + startdate_task + "</startdate_task>\n"
//                         + "     <idperson>" + person.emailgetid(emailperson) + "</idperson>\n"
                        +"	<personid>"+person.emailgetid(email)+"</personid>\n" 
                        +"	<id_masterproject>"+ id_masterproject +"</id_masterproject>\n"
                    + "</component_task>");
            System.out.println(toInsert);
            String [] response = taskController.insertTask(toInsert);
            
            message = Methods.getJsonMessage(response[0], response[1], response[2]);
            
            
            if(response[0].equals("2")){

                //Create JSON on Tasks folder
                JsonObject JsoResponse = Methods.stringToJSON("{'data':" + response[2] + "}");
                System.out.println("dataInserted = " + JsoResponse);

                   FileAccess fileCreate = new FileAccess();

                   //Data to add in JSON, (percentage, description and id of the task)

                   String responseStringJson = response[2].substring(1, response[2].length() - 1);

                   String idInserted = Methods.stringToJSON(responseStringJson).get("id_task").toString();
                   String update_date_Inserted = Methods.stringToJSON(responseStringJson).get("updatedate_task").toString();
                   String [] pepa={"0", "First insertion", idInserted, update_date_Inserted};             


                   String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

                   String rutaAbs=ruta.trim().concat("tddm4iotbs_projects")
                           .concat(String.format("/%s/", path_master_project)) 
                           .concat(DataStatic.folderEntregables)
                           .concat(path_project_entregable + "/")
                           .concat(DataStatic.folderComponents)
                           .concat(path_component + "/")
                           .concat(DataStatic.folderTasks);     

                   fileCreate.ValidateFolderExists(rutaAbs);
                   fileCreate.saveJsonEntregable(pepa, rutaAbs, pathtask);
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
    @Path("/selectTasks")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response selectEntregables(String data)
    {
        String messagee = "";
        System.out.println("la data "+data);
        JsonObject Jso = Methods.stringToJSON(data);
        
        if(Jso.size()>0)
        {
            String id_masterproject = Methods.JsonToString(Jso, "id_element", "");           
            String type = Methods.JsonToString(Jso, "type", "");           
            String email = Methods.JsonToString(Jso, "email", "");  
            
            String [] resp = taskController.selectTasks(type, id_masterproject,email);
            JsonArray jArr = Methods.stringToJsonArray(resp[1]);
            messagee = Methods.getJsonMessage("1", "Success", jArr.toString());
        }else
            messagee = Methods.getJsonMessage("4", "Missing data.", "[]");
        
        return Response.ok(messagee)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
    
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/updateComponentTask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateComponentTask(String data){
        String message = "";
        System.out.println("la data " + data);
        JsonObject Jso = Methods.stringToJSON(data);
        System.out.println("la data2 jso " + Jso);
        if (Jso.size() > 0) {
            String idTask = Methods.JsonToString(Jso, "id_task", "");
            String idEntregable = Methods.JsonToString(Jso, "id_component", "");
            String nombreTarea = Methods.JsonToString(Jso, "name_task", "");
            String descripcionTarea = Methods.JsonToString(Jso, "description_task", "");
            String statusTask = Methods.JsonToString(Jso, "status_task", "");  //finalizado intermedio y asi
            String fechaEstimada = Methods.JsonToString(Jso, "stimateddate_task", "");
            //String fechaFinalizacion = Methods.JsonToString(Jso, "stimatteddate_task", "");
            String pathtask = Methods.JsonToString(Jso, "path_task", "");
            String base_porcentaje_component = Methods.JsonToString(Jso, "base_percentage_task", "");
            String actual_porcentaje_component = Methods.JsonToString(Jso, "actual_percentage_task", "");
            String develop_status_component = Methods.JsonToString(Jso, "develop_status_task", "");
            String path_master_project = Methods.JsonToString(Jso, "path_master_project", "");
            String path_project_entregable = Methods.JsonToString(Jso, "path_project_entregable", "");
            String path_component = Methods.JsonToString(Jso, "path_component", "");
            String description_update_task = Methods.JsonToString(Jso, "description_update_task", "");
            String startdate_task = Methods.JsonToString(Jso, "startdate_task", "");
            String email = Methods.JsonToString(Jso, "emailperson", "");            
            
            String id_masterproject = Methods.JsonToString(Jso, "id_masterproject", "");
            
            WeEncoder encoder = new WeEncoder();
            id_masterproject = encoder.textDecryptor(id_masterproject);
            
            String toInsert = (""
                    + "<component_task>\n"
                        + "	<id_task>" + idTask + "</id_task>\n"
                        + "	<id_component>" + idEntregable + "</id_component>\n"
                        + "	<name_task>" + nombreTarea + "</name_task>\n"
                        + "	<description_task>" + descripcionTarea + "</description_task>\n"
                        + "	<status_task>" + statusTask + "</status_task>\n"
                        + "	<path_task>" + pathtask + "</path_task>\n"
                        + "	<base_percentage_task>" + base_porcentaje_component + "</base_percentage_task>\n"
                        + "	<actual_percentage_task>" + actual_porcentaje_component + "</actual_percentage_task>\n"
                        + "     <stimateddate_task>" + fechaEstimada + "</stimateddate_task>\n"
                        + "     <develop_status_task>" + develop_status_component + "</develop_status_task>\n"                    
                        + "     <startdate_task>" + startdate_task + "</startdate_task>\n"        
                        + "     <personid>" +person.emailgetid(email)+ "</personid>\n"  
                        +"	<id_masterproject>"+ id_masterproject +"</id_masterproject>\n"
                    + "</component_task>");
            System.out.println(toInsert);
            
            
        
            String [] response = taskController.updateTask(toInsert);
        
            message = Methods.getJsonMessage(response[0], response[1], response[2]);
        
            if(response[0].equals("2")){

            
            FileAccess fileCreate = new FileAccess();
                
               //Data to add in JSON, (percentage, description and id of the task)
               
               String responseStringJson = response[2].substring(1, response[2].length() - 1);
               
               String idInserted = Methods.stringToJSON(responseStringJson).get("id_task").toString();
               String update_date_Inserted = Methods.stringToJSON(responseStringJson).get("updatedate_task").toString();
               String [] pepa={actual_porcentaje_component, description_update_task, update_date_Inserted};             
               System.out.println("Fecha: " + update_date_Inserted);
               System.out.println("data Inserted 2 = " + idInserted);
               System.out.println("idInsertado = == = = " + update_date_Inserted);
               
              
               String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

               String rutaAbs=ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) 
                       .concat(DataStatic.folderEntregables)
                       .concat(path_project_entregable + "/")
                       .concat(DataStatic.folderComponents)
                       .concat(path_component + "/")
                       .concat(DataStatic.folderTasks)
                       .concat(pathtask + ".json");                       
               
               if (fileCreate.ValidateFolderExists(rutaAbs) && (description_update_task != null && !description_update_task.equals(""))){  
                    System.out.println("se va a crear");
                    fileCreate.upateJsonEntregable(pepa, rutaAbs);    
               }
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
    @Path("/viewUpdateHistory")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response viewUpdateHistory(String data){
        String message = "";
        
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String id_task = Methods.JsonToString(Jso, "id_task", "");
            String path_task = Methods.JsonToString(Jso, "path_task", "");
            String path_master_project = Methods.JsonToString(Jso, "path_master_project", "");
            String path_project_entregable = Methods.JsonToString(Jso, "path_project_entregable", "");
            String path_component = Methods.JsonToString(Jso, "path_component", "");
            
            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));

            String rutaAbs=ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) 
                       .concat(DataStatic.folderEntregables)
                       .concat(path_project_entregable + "/")
                       .concat(DataStatic.folderComponents)
                       .concat(path_component + "/")
                       .concat(DataStatic.folderTasks)
                       .concat(path_task + ".json");
               
            FileAccess fileGetData = new FileAccess();
            System.out.println("RUTA HISTORY " + rutaAbs);
            JsonObject jsonResponse =fileGetData.readFileJson(rutaAbs);
            System.out.println(jsonResponse);
            message = Methods.getJsonMessage("4", "Missing data.", jsonResponse.toString());        
        } 
        else {
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
    @Path("/updateAllElements")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateAllElements(String data){
        String message = "";
        
        JsonObject Jso = Methods.stringToJSON(data);
        if (Jso.size() > 0) {
            String id_person = Methods.JsonToString(Jso, "id_person", "");           
            
            
            
            taskController.updateAllElements(id_person);
            
            message = Methods.getJsonMessage("4", "Missing data.", "[]");
        } 
        else {
            message = Methods.getJsonMessage("4", "Missing data.", "[]");
        }
        return Response.ok(message)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
    
}
