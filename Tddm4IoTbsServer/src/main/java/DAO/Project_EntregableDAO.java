/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAO;
import Controller.PersonaCtrl;
import javax.swing.table.DefaultTableModel;
import models.Project_Entregable;
import util.Conection;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Project_EntregableDAO {
    private Conection conexion;
    private PersonaCtrl person;
    
    public Project_EntregableDAO(){
        conexion = new Conection();
        person=new PersonaCtrl();
    }
    
    public String [] createPprojectEntregable(String entregable){
        String query = String.format("Select * from project_entregable_insert('%s')", entregable);
        DefaultTableModel table = conexion.returnRecord(query);        
        
        if(table.getRowCount() > 0){
            return new String[]
            {
                table.getValueAt(0, 0).toString(),   
                table.getValueAt(0, 1).toString()
            };
        }
        else
            return new String[]{""};
    }
    
    public String[] updateProjectEntregable(String xmlEntregable){
        String query = String.format("Select * from project_entregable_update('%s')", xmlEntregable);
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[]{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else{
            return new String[]{
                "4", "[]"
            };
        }
    }
    
    public String [] updateBasePercentageEntregable(String xml){
        String query = String.format(String.format("Select * from project_entregable_component_update('%s')", xml));
        
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[] {
                table.getValueAt(0, 0).toString()
            };
        }
        else{
            return new String[] {
                ""
            };            
        }
       
    }
    
    public String [] selectProjectEntregable(String type, String idProject,String email){
        
        String d=person.emailgetid(email);
        String query = String.format("Select * from project_entregable_select('%s','%s','%s')", type, idProject,d);
        DefaultTableModel table = conexion.returnRecord(query);        
        
        if(table.getRowCount() > 0){
            return new String []{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else
            return new String[]{"", ""};
    }
}
