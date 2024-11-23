/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import com.google.gson.JsonArray;
import javax.swing.table.DefaultTableModel;
import models.Component;
import util.Conection;
import util.FileAccess;
import util.Methods;

/**
 * class for component data handling
 *
 * @author tonyp
 */
public class ComponentDAO {

    private Conection conex;

    public ComponentDAO() {
        conex = new Conection();
    }

    /**
     * Get all the components.
     *
     * @param idtype indicates the option to use in the function
     * @param idquery it is only used in the case of wanting to obtain the
     * detailed data of a component
     * @return a json with the data about the components.
     */
    public String[] selectComponents(String idtype, String idquery) {
        String query = String.format("select * from component_select(%s, %s)", idtype, idquery);
        DefaultTableModel tab = conex.returnRecord(query);
        if (tab.getRowCount() > 0) {
            return new String[]{
                tab.getValueAt(0, 0).toString(),
                tab.getValueAt(0, 1).toString()};
        } else {
            return new String[]{"4", "[]"};
        }
    }

    /**
     * Method for saving components.
     *
     * @param comp Model variable of a component.
     * @return a json with the data about the components.
     */
    public String[] saveComponent(Component comp) {
        String query = String.format("select * from component_insert('%s')", comp.returnXml());
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
     * method to change component state.
     *
     * @param idComponent String type variable, contains the component
     * identifier
     * @param status String type variable, contains the new state for the
     * component
     * @return Boolean that returns when the update is done.
     */
    public String stateComponent(String idComponent, String status) {
        String query = String.format("select * from component_state(%s, '%s')", idComponent, status);
        String resp = conex.fillString(query);
        return resp.matches("[24]") ? resp : "4";
    }

    /**
     * Method used to change component related parameters
     *
     * @param comp Component object with the data to process
     * @return returns a vector with the results of the changes
     */
    public String[] UpdateComponent(Component comp) {
        String query = String.format("select * from component_update('%s')", comp.returnXml());
        
        
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
     * This methods is user fot save the component image
     *
     * @param absPath - the absolute path to project
     * @param data - the info to be container into the file.png
     */
    public void saveImage(String absPath, String data) {
        FileAccess fac = new FileAccess();
        fac.SaveImg(data, absPath + "component.png");
    }

    /**
     * This methods is user fot save the component data
     *
     * @param absPath - the absolute path to project
     * @param data - the info to be container into the file.json
     */
    public void saveFile(String absPath, String data) {
        FileAccess fac = new FileAccess();
        fac.writeFileText(absPath + "component.json", data);
    }

    /**
     * This methods is user fot read the component data
     *
     * @param absPath - the absolute path to project
     * @param data - the info to be container into the file.json
     */
    public String readFile(String absPath) {
        FileAccess fac = new FileAccess();
        String data = fac.readFileText(absPath + "/component.json", "");
        return data;
    }
}
