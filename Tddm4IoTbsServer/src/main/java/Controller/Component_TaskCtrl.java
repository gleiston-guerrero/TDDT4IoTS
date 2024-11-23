/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controller;

import DAO.Component_TaskDAO;
import DAO.Entregable_ComponentDAO;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Component_TaskCtrl {
    private Component_TaskDAO taskDAO;
    
    public Component_TaskCtrl(){
        taskDAO = new Component_TaskDAO();
    }
    
    public String [] insertTask(String xmlTask){
        String [] response = taskDAO.insertTask(xmlTask);
        
       String message = "Error.";
       String status = response[0];
       String data = response[1];
       
       
       if(response[0].equals("1")){
           message = "Data inserted successfully.";
           status = "2";
       }
       if(response[0].equals("2")){
           message = "Error.";
           status = "4";
       }
       if(response[0].equals("3")){
           message = "You don't have permissions to do it.";
           status = "3";
       }
       if(response[0].equals("4")){
           message = "The sum of the percentages is greater than 100%.";
           status = "4";
       }
       if(response[0].equals("5")){
           status = "4";
           message = "Already exist a task with the inserted name.";
       }
       if(response[0].equals("6")){
           status = "4";
           message = "Error in the estimated date.";
       }
         else if(response[0].equals("7")){
            message = "The estimated finish date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        else if(response[0].equals("8")){
            message = "The start develop date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        
        return new String [] { status, message, data };
    }    
    
    public String [] selectTasks(String type, String id_element,String email){
        String [] response = taskDAO.selectTasks(type, id_element,email);
        return response;
    }
    
    public String [] updateTask(String xmlEditTask){
        String [] response = taskDAO.updateTask(xmlEditTask); 
        
       String message = "Error.";
       String status = response[0];
       String data = response[1];
       
       if(response[0].equals("0")){
           message = "Not possible to change the develop percentage. Check the date is between the "
                   + "start develop date and the finish estimated date.";
           status = "4";
       }
       else if(response[0].equals("1")){
           message = "Data updated successfully.";
           status = "2";
       }
       else if(response[0].equals("2")){
           message = "Data updated successfully.";
           status = "2";
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
           message = "Already exist a task with the inserted name.";
           status = "4";
       }
       else if(response[0].equals("6")){
           status = "4";
           message = "Error in the estimated date.";
       }
         else if(response[0].equals("7")){
            message = "The estimated finish date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        else if(response[0].equals("8")){
            message = "The start develop date is invalid. Set the date between the start develop date and estimated finish date of deliverable.";
            status = "4";
        }
        else if(response[0].equals("9")){
            message = "The new task percentage must be greater than or equal to the actual percentage.";
            status = "4";
        }
        else{
           status = "4";
           message = "Error.";
       }
        
        return new String [] { status, message, data };
    }
    
    public void updateAllElements(String idPerson){
        taskDAO.updateAllElements(idPerson);
    }
}
