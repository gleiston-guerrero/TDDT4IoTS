/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAO;

import com.google.gson.JsonArray;
import static javassist.CtMethod.ConstParameter.string;
import javax.swing.table.DefaultTableModel;
import util.Conection;
import util.Methods;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Entregable_MembersDAO {
    
    
     private Conection conexion;
    
    public Entregable_MembersDAO(){
        conexion = new Conection();
    }
    
    public String [] selectMembersEntregable(String type, String componentOrTask){
        String query = String.format("Select * from entregable_members_select('%s', '%s')", type, componentOrTask);        
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[]{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else
            return new String[]{
                "4",
                "[]"
            };
    }
    
    public String [] insertEntregableMember(String xml){        
        String query = String.format("Select * from entregable_members_insert('%s')", xml);
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[]{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else
            return new String []{
                "4",
                "[]"
        };
    }
    
    public String [] updateEntregableMember(String xml){        
        String query = String.format("Select * from project_entregable_component_task_member_update('%s')", xml);
        DefaultTableModel table = conexion.returnRecord(query);
        
        if(table.getRowCount() > 0){
            return new String[]{
                table.getValueAt(0, 0).toString(),
                table.getValueAt(0, 1).toString()
            };
        }
        else
            return new String []{
                "4",
                "[]"
        };
    }
}
