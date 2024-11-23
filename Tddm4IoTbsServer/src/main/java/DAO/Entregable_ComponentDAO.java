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
public class Entregable_ComponentDAO {
    private Conection conexion;
    private PersonaCtrl person;
    
    public Entregable_ComponentDAO(){
        conexion = new Conection();
        person=new PersonaCtrl();
    }
    
    public String [] createEntregableTask(String entregable_task){
        String query = String.format("Select * from project_entregable_component_insert('%s')", entregable_task);
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[]
            {
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()                
            };
        }
        else
            return new String[]
            {
                "4", "Error."               
            };
    }
    
    public String[] updateEntregableTask(String xmlEntregableComponent) {
        
        //String query = String.format("select * from entregable_component_update('%s')", xmlEntregableTask);
        String query = String.format("select * from project_entregable_component_update('%s')", xmlEntregableComponent);
        DefaultTableModel table = conexion.returnRecord(query);

        if (table.getRowCount() > 0) {
            return new String[]{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        } else {
            return new String[]{
                "4", "[]"
            };
        }
    }
    
    public String [] updateBasePercentageComponent(String xmlEdit){
        String query = String.format("Select * from updatePercentageForElements('%s')", xmlEdit);
        
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[]{
                table.getValueAt(0, 0).toString()
            };
        }
        else{
            return new String[]{
                ""
            };
        }        
    }
        
    public String [] selectEntregableTask(String type, String entregable_id,String email){
        String d= person.emailgetid(email);
        String query = String.format("Select * from project_entregable_component_select('%s', '%s','%s')", type,entregable_id,d); 
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String []{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else
            return new String[]{"",""};
   }
}
