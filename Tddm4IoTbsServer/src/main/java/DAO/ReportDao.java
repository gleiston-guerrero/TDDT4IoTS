/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAO;

import javax.swing.table.DefaultTableModel;
import util.Conection;

/**
 *
 * @author HECTOR CASANOVA
 */
public class ReportDao {

    private Conection conexion;

    public ReportDao() {
        conexion = new Conection();
    }

    public DefaultTableModel queryReport(String query) {
        DefaultTableModel tabla = conexion.returnRecord(query);
        if (tabla.getColumnCount() > 0) {
            return tabla;
        } else {
            return null;
        }
    }
    
 
}
