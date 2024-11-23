/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author tonyp
 */
public class Permit_master {

    String id_permitmaster = "";
    String creationdate_pm = "";
    String updatedate_pm = "";
    String joinactive_pm = "";
    String permit_pm = "";
    String person_id_person = "";
    String master_project_id_masterproject = "";

    public String getMaster_project_id_masterproject() {
        return master_project_id_masterproject;
    }

    public void setMaster_project_id_masterproject(String master_project_id_masterproject) {
        this.master_project_id_masterproject = master_project_id_masterproject;
    }

    public String getId_permitmaster() {
        return id_permitmaster;
    }

    public void setId_permitmaster(String id_permitmaster) {
        this.id_permitmaster = id_permitmaster;
    }

    public String getCreationdate_pm() {
        return creationdate_pm;
    }

    public void setCreationdate_pm(String creationdate_pm) {
        this.creationdate_pm = creationdate_pm;
    }

    public String getUpdatedate_pm() {
        return updatedate_pm;
    }

    public void setUpdatedate_pm(String updatedate_pm) {
        this.updatedate_pm = updatedate_pm;
    }

    public String getJoinactive_pm() {
        return joinactive_pm;
    }

    public void setJoinactive_pm(String joinactive_pm) {
        this.joinactive_pm = joinactive_pm;
    }

    public String getPermit_pm() {
        return permit_pm;
    }

    public void setPermit_pm(String permit_pm) {
        this.permit_pm = permit_pm;
    }

    public String getPerson_id_person() {
        return person_id_person;
    }

    public void setPerson_id_person(String person_id_person) {
        this.person_id_person = person_id_person;
    }

    public String returnXml() {
        JSONObject jsonU = new JSONObject(this);
        return "<permit_master>" + XML.toString(jsonU) + "</permit_master>";
    }
}
