/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controller;

import DAO.Project_EntregableDAO;
import com.google.gson.JsonArray;
import util.Methods;
import util.WeEncoder;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Project_EntregableCtrl {
    
    private Project_EntregableDAO entregableDAO;
    public Project_EntregableCtrl(){
        entregableDAO  = new Project_EntregableDAO();
    }
    
    public String selectEntregables(String type, String idProject,String email){
        //Decrypt the id:
        WeEncoder encoder =  new WeEncoder();
        if((type.equals("4"))){
            idProject = encoder.textDecryptor(idProject);
        }
        String [] response = entregableDAO.selectProjectEntregable(type, idProject,email);
        JsonArray jArr = Methods.stringToJsonArray(response[1]);     
      
        return jArr.toString();
    }
    
    public String [] insertNewEntregable(String xml){
        String [] response = entregableDAO.createPprojectEntregable(xml);
        
        String status = response[0];
        String message = "Error";
        String data = response[1];

        if (response[0].equals("1")){
            message = "Succesfully inserted.";
            status = "2";
        }
        else if (response[0].equals("2")){
            message = "Error.";
            status = "4";
        }
        else if(response[0].equals("3")){
           message = "You don't have permissions to do it.";
           status = "4";
        }
        else if (response[0].equals("4")){
            message = "Already exist a deliverable with the inserted name.";
            status = "4";
        }
        else if (response[0].equals("5")){
            message = "The sum of the percentages is greater than 100%.";
            status = "4";
        }
        else if (response[0].equals("6")){
            message = "Error in the estimated date.";
            status = "4";
        }
        
        return new String []{status, message, data};
    }
    
   public String [] updateEntregable(String xml){
       String [] response = entregableDAO.updateProjectEntregable(xml);       
       
       String message = "Succesfully updated.";
       String status = response[0];
       String data = response[1];
       
       System.out.println("ESTADO ACTUALIZAR = " + status);
       
        if(response[0].equals("1")){
           message = "Succesfully updated.";
           status = "2";
       }
       if(response[0].equals("2")){
           message = "You don't have permissions to do it.";
           status = "4";
       }
       if(response[0].equals("3")){
           message = "The sum of the percentages is greater than 100%.";
           status = "4";
       }
       if(response[0].equals("4")){
            message = "Already exist a deliverable with the inserted name.";
            status = "4";
       }
        if(response[0].equals("5")){
            status = "4";
            message = "Error in the estimated date.";
       }
       
       return new String []{ status, message, data};
   }
   
   public String [] updatePercentageEntregable(String xml){
       String [] response = entregableDAO.updateBasePercentageEntregable(xml);       
       return response;
   }
   
}
