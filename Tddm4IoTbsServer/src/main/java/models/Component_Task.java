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
public class Component_Task {
    private String id_task;
    private String id_component;
    private String name_task;
    private String description_task;
    private String status_task;
    private String path_task;
    private String base_percentage_task;
    private String actual_percentage_task;
    private String creationdate_task;
    private String updatedate_task;
    private String stimateddate_task;
    private String finishdate_task ;
    private String develop_status_task;

    public Component_Task(){
        
    }
    
    public String getId_task() {
        return id_task;
    }

    public void setId_task(String id_task) {
        this.id_task = id_task;
    }

    public String getId_component() {
        return id_component;
    }

    public void setId_component(String id_component) {
        this.id_component = id_component;
    }

    public String getName_task() {
        return name_task;
    }

    public void setName_task(String name_task) {
        this.name_task = name_task;
    }

    public String getDescription_task() {
        return description_task;
    }

    public void setDescription_task(String description_task) {
        this.description_task = description_task;
    }

    public String getStatus_task() {
        return status_task;
    }

    public void setStatus_task(String status_task) {
        this.status_task = status_task;
    }

    public String getPath_task() {
        return path_task;
    }

    public void setPath_task(String path_task) {
        this.path_task = path_task;
    }

    public String getBase_percentage_task() {
        return base_percentage_task;
    }

    public void setBase_percentage_task(String base_percentage_task) {
        this.base_percentage_task = base_percentage_task;
    }

    public String getActual_percentage_task() {
        return actual_percentage_task;
    }

    public void setActual_percentage_task(String actual_percentage_task) {
        this.actual_percentage_task = actual_percentage_task;
    }

    public String getCreationdate_task() {
        return creationdate_task;
    }

    public void setCreationdate_task(String creationdate_task) {
        this.creationdate_task = creationdate_task;
    }

    public String getUpdatedate_task() {
        return updatedate_task;
    }

    public void setUpdatedate_task(String updatedate_task) {
        this.updatedate_task = updatedate_task;
    }

    public String getStimateddate_task() {
        return stimateddate_task;
    }

    public void setStimateddate_task(String stimateddate_task) {
        this.stimateddate_task = stimateddate_task;
    }

    public String getFinishdate_task() {
        return finishdate_task;
    }

    public void setFinishdate_task(String finishdate_task) {
        this.finishdate_task = finishdate_task;
    }

    public String getDevelop_status_task() {
        return develop_status_task;
    }

    public void setDevelop_status_task(String develop_status_task) {
        this.develop_status_task = develop_status_task;
    }
    
    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<component_task>" + XML.toString(jsonU) + "</component_task>";
    }
}
