/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package models;

import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author LUIS CASANOVA
 */
public class Entregable_Component {
    private String id_entregable_component;
    private String id_entregable;
    private String name_component;
    private String description_component;
    private String status_component;
    private String visibility_component;
    private String path_component;
    private String develop_status_component;
    private String base_percentage_component;
    private String actual_percentage_component;
    private String creationdate_component;
    private String updatedate_component;
    private String stimateddate_component;
    private String finishdate_component;

    public String getId_entregable_component() {
        return id_entregable_component;
    }

    public void setId_entregable_component(String id_entregable_component) {
        this.id_entregable_component = id_entregable_component;
    }

    public String getId_entregable() {
        return id_entregable;
    }

    public void setId_entregable(String id_entregable) {
        this.id_entregable = id_entregable;
    }

    public String getName_component() {
        return name_component;
    }

    public void setName_component(String name_component) {
        this.name_component = name_component;
    }

    public String getDescription_component() {
        return description_component;
    }

    public void setDescription_component(String description_component) {
        this.description_component = description_component;
    }

    public String getStatus_component() {
        return status_component;
    }

    public void setStatus_component(String status_component) {
        this.status_component = status_component;
    }

    public String getVisibility_component() {
        return visibility_component;
    }

    public void setVisibility_component(String visibility_component) {
        this.visibility_component = visibility_component;
    }

    public String getPath_component() {
        return path_component;
    }

    public void setPath_component(String path_component) {
        this.path_component = path_component;
    }
   
    public String getBase_percentage_component() {
        return base_percentage_component;
    }

    public String getDevelop_status_component() {
        return develop_status_component;
    }

    public void setDevelop_status_component(String develop_status_component) {
        this.develop_status_component = develop_status_component;
    }

    
    
    public void setBase_percentage_component(String base_percentage_component) {
        this.base_percentage_component = base_percentage_component;
    }

    public String getActual_percentage_component() {
        return actual_percentage_component;
    }

    public void setActual_percentage_component(String actual_percentage_component) {
        this.actual_percentage_component = actual_percentage_component;
    }

    public String getCreationdate_component() {
        return creationdate_component;
    }

    public void setCreationdate_component(String creationdate_component) {
        this.creationdate_component = creationdate_component;
    }

    public String getUpdatedate_component() {
        return updatedate_component;
    }

    public void setUpdatedate_component(String updatedate_component) {
        this.updatedate_component = updatedate_component;
    }

    public String getStimateddate_component() {
        return stimateddate_component;
    }

    public void setStimateddate_component(String stimateddate_component) {
        this.stimateddate_component = stimateddate_component;
    }

    public String getFinishdate_component() {
        return finishdate_component;
    }

    public void setFinishdate_component(String finishdate_component) {
        this.finishdate_component = finishdate_component;
    }
    
    public Entregable_Component(){
        
    }    
    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<project_entregable_component>" + XML.toString(jsonU) + "</project_entregable_component>";
    }

}
