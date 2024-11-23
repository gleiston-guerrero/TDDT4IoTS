/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package apis;
import Controller.PersonaCtrl;
import Controller.Project_EntregableCtrl;
import com.google.gson.JsonArray;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import util.Methods;
import com.google.gson.JsonObject;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
@Path("entregable")
public class Project_EntregableApis {
    Project_EntregableCtrl entregablectrl;
    PersonaCtrl person;
    
    public Project_EntregableApis()
    {
        entregablectrl = new Project_EntregableCtrl();
        person=new PersonaCtrl();
    } 
    @Context
    private HttpServletRequest request;
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/saveEntregable")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createEntregable(String data)
    {
        String messagee = "";

        JsonObject Jso = Methods.stringToJSON(data);
        if(Jso.size()>0)
        {
            String id_masterproject = Methods.JsonToString(Jso, "idmasterproject", "");
            String nameEntregable = Methods.JsonToString(Jso, "name_entregable", "");
            String descripcion = Methods.JsonToString(Jso, "description_entregable", "");
            String status = Methods.JsonToString(Jso, "status_entregable", "");
            String develop_status_entregable = Methods.JsonToString(Jso, "develop_status_entregable", "");
            String stimateddate_entregable=Methods.JsonToString(Jso,"stimateddate_entregable","");
            String path = nameEntregable;
            String priority = Methods.JsonToString(Jso,"prioritylevel_entregable", "");
            String base_percentage_entregable = Methods.JsonToString(Jso,"base_percentage_entregable", "");
            String actual_percentage_entregable = Methods.JsonToString(Jso,"actual_percentage_entregable", "");
            String path_master_project = Methods.JsonToString(Jso, "path_master_project", "");
            String startdate_entregable = Methods.JsonToString(Jso, "startdate_entregable", "");
            String emailperson = Methods.JsonToString(Jso, "emailperson", "");
            
            WeEncoder encoder = new WeEncoder();
            id_masterproject = encoder.textDecryptor(id_masterproject);
            
            //Replace the special characters to create the folder and save on the database:
            path = path.replaceAll("\\W", "x"); 
            

            
            String Xmltext = "<project_entregable>\n" +
                                                "	<name_entregable>"+nameEntregable+"</name_entregable>\n" +
                                                "       <prioritylevel_entregable>"+priority+"</prioritylevel_entregable>\n" +
                                                "       <base_percentage_entregable>"+base_percentage_entregable+"</base_percentage_entregable>\n" +
                                                "       <actual_percentage_entregable>"+"100"+"</actual_percentage_entregable>\n" +  
                                                "	<id_masterproject>"+id_masterproject+"</id_masterproject>\n" +
                                                "	<status_entregable>"+status+"</status_entregable>\n" +
                                                "	<develop_status_entregable>"+develop_status_entregable+"</develop_status_entregable>\n" +
                                                "	<description_entregable>"+descripcion+"</description_entregable>\n" +
                                                "	<path_entregable>"+path+"</path_entregable>\n" +
                                                "	<stimateddate_entregable>"+stimateddate_entregable+"</stimateddate_entregable>\n" +
                                                "	<startdate_entregable>"+startdate_entregable+"</startdate_entregable>\n" +
                                                "	<personid>"+person.emailgetid(emailperson)+"</personid>\n" +
                                            "</project_entregable>";  
            

            /*
            LocalDate dt1 = LocalDate.parse(startdate_entregable);
            LocalDate dt2= LocalDate.parse(stimateddate_entregable);

            long diffDays = ChronoUnit.DAYS.between(dt1, dt2);
            System.out.println(diffDays);            
            */
            String [] response = entregablectrl.insertNewEntregable(Xmltext);
            
            messagee=Methods.getJsonMessage(response[0], response[1], response[2]);
            
            String ruta = DataStatic.getLocation(request.getServletContext().getRealPath(""));
            
            FileAccess fileCreate = new FileAccess();
            
            String rutaAbsEntregableAux=ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) //poner ruta del proyecto
                       .concat(DataStatic.folderEntregables);
            fileCreate.ValidateFolderExists(rutaAbsEntregableAux);
            
            String rutaAbs=ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) //poner ruta del proyecto
                       .concat(DataStatic.folderEntregables)
                       .concat(path + "/");  

            fileCreate.ValidateFolderExists(rutaAbs);
            
            rutaAbs = ruta.trim().concat("tddm4iotbs_projects")
                       .concat(String.format("/%s/", path_master_project)) //poner ruta del proyecto
                       .concat(DataStatic.folderEntregables)
                       .concat(path + "/")
                       .concat(DataStatic.folderComponents + "/");  

            fileCreate.ValidateFolderExists(rutaAbs);
        }
        else
            messagee = Methods.getJsonMessage("4", "Missing data.", "[]");
        return Response.ok(messagee)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/updateEntregable")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateEntregable(String data)
    {
        String messagee = "";

        JsonObject Jso = Methods.stringToJSON(data);
        if(Jso.size()>0)
        {
            String id_masterproject = Methods.JsonToString(Jso, "id_masterproject", "");
            String id_entregable = Methods.JsonToString(Jso, "id_entregable", "");
            String nameEntregable = Methods.JsonToString(Jso, "name_entregable", "");
            String descripcion = Methods.JsonToString(Jso, "description_entregable", "");
            String status = Methods.JsonToString(Jso, "status_entregable", "");
            String stimateddate_entregable=Methods.JsonToString(Jso,"stimateddate_entregable","");
            String path = Methods.JsonToString(Jso, "path_entregable", "");
            String develop_status_entregable = Methods.JsonToString(Jso, "develop_status_entregable", "");
            String base_percentage_entregable = Methods.JsonToString(Jso,"base_percentage_entregable","");
            String actual_percentage_entregable = Methods.JsonToString(Jso, "actual_percentage_entregable", "");
            String startdate_entregable = Methods.JsonToString(Jso, "startdate_entregable", "");
            String priority = Methods.JsonToString(Jso,"prioritylevel_entregable", "");
            String email = Methods.JsonToString(Jso, "emailperson", "");
             
            WeEncoder encoder = new WeEncoder();
            //id_masterproject = encoder.textDecryptor(id_masterproject);
            
            String Xmltext = "<project_entregable>\n" +
                                                "	<id_entregable>"+id_entregable+"</id_entregable>\n" +
                                                "	<name_entregable>"+nameEntregable+"</name_entregable>\n" +
                                                "       <prioritylevel_entregable>"+priority+"</prioritylevel_entregable>\n" +
                                                "	<id_masterproject>"+id_masterproject+"</id_masterproject>\n" +
                                                "	<status_entregable>"+status+"</status_entregable>\n" +
                                                "	<description_entregable>"+descripcion+"</description_entregable>\n" +
                                                "	<path_entregable>"+path+"</path_entregable>\n" +
                                                "	<develop_status_entregable>"+develop_status_entregable+"</develop_status_entregable>\n" +
                                                "	<base_percentage_entregable>"+base_percentage_entregable+"</base_percentage_entregable>\n" +
                                                "	<actual_percentage_entregable>"+actual_percentage_entregable+"</actual_percentage_entregable>\n" +
                                                "	<stimateddate_entregable>"+stimateddate_entregable+"</stimateddate_entregable>\n" +
                                                "	<startdate_entregable>"+startdate_entregable+"</startdate_entregable>\n" +                                                
                                                "	<personid>"+person.emailgetid(email)+"</personid>\n" +
                                            "</project_entregable>";  
            
            String [] response = entregablectrl.updateEntregable(Xmltext);
           
            messagee=Methods.getJsonMessage(response[0], response[1], response[2]);
        }
        else
            messagee = Methods.getJsonMessage("4", "Missing data.", "[]");
        return Response.ok(messagee)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
    
    
    
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    @Path("/selectEntregables")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response selectEntregables(String data)
    {
        String messagee = "";        
        JsonObject Jso = Methods.stringToJSON(data);
        
        if(Jso.size()>0)
        {
            String id_masterproject = Methods.JsonToString(Jso, "idmasterproject", "");           
            String type = Methods.JsonToString(Jso, "type", "");    
            String email = Methods.JsonToString(Jso, "email", "");     
            String resp = "";
            if(type.equals(3)){
                 resp = entregablectrl.selectEntregables(type, id_masterproject,email);    
            }
            else
                 resp = entregablectrl.selectEntregables(type, id_masterproject,email);
            
            //JsonArray jArr = Methods.stringToJsonArray(resp);
            messagee = Methods.getJsonMessage("1", "Data loaded successfully.", resp);
        }else
            messagee = Methods.getJsonMessage("4", "Missing data.", "[]");
        
        return Response.ok(messagee)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, PUT, UPDATE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-with")
                .build();
    }
}
