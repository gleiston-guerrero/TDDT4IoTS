/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAO;

import Controller.PersonaCtrl;
import javax.swing.table.DefaultTableModel;
import util.Conection;


/**
 *
 * @author HECTOR CASANOVA
 */
public class Component_TaskDAO {
    private Conection conexion;
    private PersonaCtrl person;
    
    public Component_TaskDAO(){
        conexion = new Conection();
        person=new PersonaCtrl();
    }
    
    public String [] insertTask(String xmlTask){
        String query = String.format("Select * from project_entregable_component_task_insert('%s')",xmlTask);
        
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String []{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else{
            return new String []{
                "2",
                "[]"
            };
        }
    }
    
    public String [] selectTasks(String type, String id_element,String email){
      
        String id=person.emailgetid(email);
        String query = String.format("Select * from project_entregable_component_task_select('%s', '%s','%s')", type, id_element,id);
        
        DefaultTableModel table = conexion.returnRecord(query);
        if(table.getRowCount() > 0){
            return new String []{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else{
            return new String []{
                "", ""
            };
        }
    }
    
    public String [] updateTask(String xmlEditTask){
        String query = String.format("Select * from project_entregable_component_task_update('%s')", xmlEditTask);        
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String []{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else{
             return new String []{
                "2",
                "[]"
            };
        }
    }
    
    public void updateAllElements(String idPerson){
        String query = String.format("Select * from update_all_elements_by_person(%s)", idPerson);
        
        conexion.returnRecord(query);
    }
    
    
        public DefaultTableModel readPathTask(String idtask){
        String query = String.format("select pe.path_entregable,pec.path_component,ect.path_task\n" +
                "from project_entregable pe inner join project_entregable_component pec\n" +
                "on pe.id_entregable=pec.id_entregable \n" +
                "inner join entregable_component_task ect on pec.id_entregable_component=ect.id_component\n" +
                "where id_task='%s'",idtask);
        
        DefaultTableModel table = conexion.returnRecord(query);
        if(table.getRowCount() > 0)
            return table;
        else
           return null;
    }
    
//    public DefaultTableModel jsonToTableHistoryTask(String jsonCad)
//    {
//        String query = String.format("select * from taskHistoryTaskProTable('%s')",jsonCad);
//        
//        DefaultTableModel table = conexion.returnRecord(query);
//        if(table.getRowCount() > 0)
//            return table;
//        else
//           return null;
//    }
    
    
    
    
}
