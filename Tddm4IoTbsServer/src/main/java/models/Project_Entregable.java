/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package models;

import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author HECTOR CASANOVA
 */
public class Project_Entregable {
    String id_entregable;
    String id_masterproject;
    String name_entregable;
    String description_entregable;
    String status_entregable;
    String develop_status_entregable;    
    String path_entregable;
    String prioritylevel_entregable; 
    String base_percentage_entregable;
    String actual_percentage_entregable;
    String creationdate_entregable;
    String updatedate_entregable;
    String stimateddate_entregable;
    String finishdate_entregable;
      
    public Project_Entregable(){
        
    }
    
    public String getDevelop_status_entregable() {
        return develop_status_entregable;
    }

    public void setDevelop_status_entregable(String develop_status_entregable) {
        this.develop_status_entregable = develop_status_entregable;
    }
    
    public String getBase_percentage_entregable() {
        return base_percentage_entregable;
    }

    public void setBase_percentage_entregable(String base_percentage_entregable) {
        this.base_percentage_entregable = base_percentage_entregable;
    }

    public String getActual_percentage_entregable() {
        return actual_percentage_entregable;
    }

    public void setActual_percentage_entregable(String actual_percentage_entregable) {
        this.actual_percentage_entregable = actual_percentage_entregable;
    }
    
    public String getId_entregable() {
        return id_entregable;
    }

    public void setId_entregable(String id_entregable) {
        this.id_entregable = id_entregable;
    }

    public String getId_masterproject() {
        return id_masterproject;
    }

    public void setId_masterproject(String id_masterproject) {
        this.id_masterproject = id_masterproject;
    }

    public String getName_entregable() {
        return name_entregable;
    }

    public void setName_entregable(String name_entregable) {
        this.name_entregable = name_entregable;
    }

    public String getDescription_entregable() {
        return description_entregable;
    }

    public void setDescription_entregable(String description_entregable) {
        this.description_entregable = description_entregable;
    }

    public String getStatus_entregable() {
        return status_entregable;
    }

    public void setStatus_entregable(String status_entregable) {
        this.status_entregable = status_entregable;
    }
    
    
    public String getPrioritylevel_entregable() {
        return prioritylevel_entregable;
    }

    public void setPrioritylevel_entregable(String prioritylevel_entregable) {
        this.prioritylevel_entregable = prioritylevel_entregable;
    }

    public String getPath_entregable() {
        return path_entregable;
    }

    public void setPath_entregable(String path_entregable) {
        this.path_entregable = path_entregable;
    }
    
    public String getCreationdate_entregable() {
        return creationdate_entregable;
    }

    public void setCreationdate_entregable(String creationdate_entregable) {
        this.creationdate_entregable = creationdate_entregable;
    }

    public String getUpdatedate_entregable() {
        return updatedate_entregable;
    }

    public void setUpdatedate_entregable(String updatedate_entregable) {
        this.updatedate_entregable = updatedate_entregable;
    }

    public String getStimateddate_entregable() {
        return stimateddate_entregable;
    }

    public void setStimateddate_entregable(String stimateddate_entregable) {
        this.stimateddate_entregable = stimateddate_entregable;
    }
    
    public String getFinishdate_entregable() {
        return finishdate_entregable;
    }

    public void setFinishdate_entregable(String finishdate_entregable) {
        this.finishdate_entregable = finishdate_entregable;
    }
    
    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<project_entregable>" + XML.toString(jsonU) + "</project_entregable>";
    }
}
