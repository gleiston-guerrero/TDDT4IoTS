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
public class Entregable_Members {  
   private String id_entregable_member;
   private String id_person;
   private String id_project_task;
   private String role_member;
   private String status_member;
   private String creationdate_em;
   private String updatedate_em;
   
   public Entregable_Members(){
       
   }
   
   public String getId_entregable_member() {
        return id_entregable_member;
    }

    public void setId_entregable_member(String id_entregable_member) {
        this.id_entregable_member = id_entregable_member;
    }

    public String getId_person() {
        return id_person;
    }

    public void setId_person(String id_person) {
        this.id_person = id_person;
    }

    public String getId_project_task() {
        return id_project_task;
    }

    public void setId_project_task(String id_project_task) {
        this.id_project_task = id_project_task;
    }

    public String getRole_member() {
        return role_member;
    }

    public void setRole_member(String role_member) {
        this.role_member = role_member;
    }

    public String getStatus_member() {
        return status_member;
    }

    public void setStatus_member(String status_member) {
        this.status_member = status_member;
    }

    public String getCreationdate_em() {
        return creationdate_em;
    }

    public void setCreationdate_em(String creationdate_em) {
        this.creationdate_em = creationdate_em;
    }

    public String getUpdatedate_em() {
        return updatedate_em;
    }

    public void setUpdatedate_em(String updatedate_em) {
        this.updatedate_em = updatedate_em;
    }
    
    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<project_entregable_task>" + XML.toString(jsonU) + "</project_entregable_task>";
    }
    
}
