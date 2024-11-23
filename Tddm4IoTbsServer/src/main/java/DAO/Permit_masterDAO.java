/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import javax.swing.table.DefaultTableModel;
import models.Permit_master;
import util.Conection;

/**
 * Class to handle user permissions to projects.
 *
 * @author tonyp
 */
public class Permit_masterDAO {

    /**
     * Global database connection variable
     */
    private Conection conex;

    /**
     * Class constructor
     */
    public Permit_masterDAO() {
        conex = new Conection();
    }

    /**
     * Method used to enter a participant.
     *
     * @param perm Permit_master object with the data to process.
     * @return Returns a vector with the results of the process.
     */
    public String[] insertPermit(Permit_master perm) {
        String query = String.format("select * from permit_master_insert('%s')", perm.returnXml());
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", ""};
        }
    }

    /**
     * Method used to modify a participant's access to the project
     *
     * @param perm Permit_master object with the data to process.
     * @return Returns a vector with the results of the process.
     */
    public String[] updatePermit(Permit_master perm) {
        String query = String.format("select * from permit_master_update('%s')", perm.returnXml());
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", ""};
        }
    }

    /**
     * Function to change the status or permission that a user has to a project
     *
     * @param perm Permit_master object with the data to process.
     * @return Returns a vector with the results of the process.
     */
    public String[] statePermitOrPermit(Permit_master perm, String flag) {
        String query = String.format("select * from permit_master_state('%s', '%s')", perm.returnXml(), flag);
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", ""};
        }
    }
    
    
}
