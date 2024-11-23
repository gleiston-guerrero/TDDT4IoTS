/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controller;

import DAO.Entregable_MembersDAO;
import com.google.gson.JsonArray;
import util.Methods;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Entregable_MembersCtrl {  
    
    private Entregable_MembersDAO eMembersDAO;
    
    public Entregable_MembersCtrl(){
        eMembersDAO = new Entregable_MembersDAO();
    }
    
    
    public String [] insertMembers(String dataXML)
    {
        String [] response = eMembersDAO.insertEntregableMember(dataXML);
        
        String message = response[0];
        String data = response[1];
        String status = response[0];
        
        if(response[0].equals("1")){
            message = "Data inserted successfully.";
            status = "2";
        }
         else if (response[0].equals("2")){
            message = "Error";
            status = "4";
        }     
        else if(response[0].equals("3")){
           message = "You don't have permissions to do it.";
           status = "4";
        }
        else if(response[0].equals("4")){
            message = "The user is already added, check the role or the status of the member.";
            status = "4";
        }
        else if (response[0].equals("5")){
            message = "Error, the email doesn't exist.";
            status = "4";
        }     
        
        return new String [] {status, message, data};
    }
    
    public String [] updateMember(String dataXML)
    {
        String [] response = eMembersDAO.updateEntregableMember(dataXML);
        
        String message = response[0];
        String data = response[1];
        String status = response[0];
        
        if(response[0].equals("1")){
            message = "Data updated successfully.";
            status = "2";
        }       
        else if(response[0].equals("2")){
           message = "You don't have permissions to do it.";
           status = "4";
        }
        else if (response[0].equals("3")){
            message = "This user can't be modified.";
            status = "4";
        }  
        else if (response[0].equals("4")){
            message = "There is no user with that hotmail in this task.";
            status = "4";
        }  
        else {
            message = "Error.";
            status = "4";
        }  
        
        return new String [] {status, message, data};
    }    
    
   
    
    public String [] selectMembersEntregable(String type, String idComponentOrTask){
        String [] response = eMembersDAO.selectMembersEntregable(type, idComponentOrTask);    
        String status = "4";
        String message = "Error in loading data";
        String data = "[]";
        
        //If is different than 4, everything it's ok
        if (!(response[0].equals("5"))){
            JsonArray jArr = Methods.stringToJsonArray(response[1]);
            status = response[0];
            message = "Components successfully loaded";
            data = jArr.toString();        
        }            
        return new String []{
            status, message, data
        };
    }
}
