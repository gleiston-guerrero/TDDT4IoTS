/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controller;

import DAO.Entregable_ComponentDAO;
import com.google.gson.JsonArray;
import util.Methods;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Entregable_ComponentCtrl {
    private Entregable_ComponentDAO taskDAO;
    
    public Entregable_ComponentCtrl(){
        taskDAO = new Entregable_ComponentDAO();
    }
    
    public String[] insertNewEntregableTask(String xmlTask){
        String [] response = taskDAO.createEntregableTask(xmlTask);
        
        String status = response[0];
        String message = "Error";
        String data = response[1];
        
        if(response[0].equals("1")){
            message = "Data inserted correctly.";
            status = "2";
        }
        else if(response[0].equals("2")){
            message = "Error while the data has being inserted.";
            status = "4";
        }  
        else if(response[0].equals("3")){
           message = "You don't have permissions to do it.";
           status = "4";
        }         
        else if(response[0].equals("4")){
            message = "The sum of the percentages is greater than 100%.";
            status = "4";
        }   
        else if(response[0].equals("5")){
            message = "The name of the component already exists.";
            status = "4";
        }   
        else if(response[0].equals("6")){
            message = "The estimated date is incorrect.";
            status = "4";
        }        
        else if(response[0].equals("7")){
            message = "The estimated finish date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        else if(response[0].equals("8")){
            message = "The start develop date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        
        return new String [] {status, message, data};
    }
    
    
    public String[] UpdateEntregableTask(String xmlTask){
        System.out.println("confirmaaaaaaaaaaaaaaa");
        String [] response = taskDAO.updateEntregableTask(xmlTask);
        
        String status = response[0];
        String message = "Error";
        String data = response[1];
        
        if(response[0].equals("1")){
            message = "Data updated correctly.";
            status = "2";
        }
        else if(response[0].equals("2")){
           message = "You don't have permissions to do it.";
           status = "4";
        }
        else if(response[0].equals("3")){
            message = "The sum of the percentages is greater than 100%.";
            status = "4";
        }
        else if(response[0].equals("4")){
            message = "The name of the component already exists.";
            status = "4";
        }
        else if(response[0].equals("5")){
            message = "The estimated date is incorrect.";
            status = "4";
        }
        else if(response[0].equals("6")){
            message = "The estimated finish date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        else if(response[0].equals("7")){
            message = "The start develop date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        
        return new String [] { status, message, data };
    }
    
    public String [] updateBasePercentageComponent(String xmlEdit){
        String [] response = taskDAO.updateBasePercentageComponent(xmlEdit);
        return response;
    }
  
    public String [] selectEntregableTask(String type, String idEntregable,String email){
        String status = "5";
        String message = "Error in loading data";
        String data = "[]";               
        
        String [] response = taskDAO.selectEntregableTask(type, idEntregable,email);
        
        System.out.println(response[1]+"ress");
        if(!(response[0].equals("5"))){
            JsonArray jArr = Methods.stringToJsonArray(response[1]);
            message = "Components successfully loaded";
            data = jArr.toString();  
        }
        
        return new String[] {status, message, data};
    }
    
}
